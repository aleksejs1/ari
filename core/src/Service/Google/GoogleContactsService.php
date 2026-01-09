<?php

namespace App\Service\Google;

use App\Dto\ContactAddressDto;
use App\Dto\ContactBiographyDto;
use App\Dto\ContactDateDto;
use App\Dto\ContactEmailDto;
use App\Dto\ContactImportDto;
use App\Dto\ContactNameDto;
use App\Dto\ContactOrganizationDto;
use App\Dto\ContactPhoneDto;
use App\Entity\TokenStorage;
use App\Entity\User;
use App\Repository\ImportMappingRepository;
use App\Entity\ImportMapping;
use App\Repository\TokenStorageRepository;
use App\Service\ContactImport\ContactImportService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GoogleContactsService
{
    private const PEOPLE_API_URL = 'https://people.googleapis.com/v1/people/me/connections';
    private const GROUPS_API_URL = 'https://people.googleapis.com/v1/contactGroups';

    public function __construct(
        private readonly TokenStorageRepository $tokenStorageRepository,
        private readonly ImportMappingRepository $importMappingRepository,
        private readonly GoogleOAuthService $oauthService,
        private readonly HttpClientInterface $httpClient,
        private readonly ContactImportService $contactImportService,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function importContacts(User $user, bool $addGoogleGroup = false): int
    {
        $tokenStorage = $this->tokenStorageRepository->findOneBy(['user' => $user, 'type' => 'google']);

        if (null === $tokenStorage) {
            throw new \RuntimeException('No Google connection found for this user.');
        }

        $accessToken = $this->getValidAccessToken($tokenStorage);
        $groupsMap = $this->importGroups($user, $accessToken);

        $googleGroup = null;
        if ($addGoogleGroup) {
            $googleGroup = $this->entityManager->getRepository(\App\Entity\Group::class)->findOneBy([
                'user' => $user,
                'name' => 'google',
            ]);

            if (null === $googleGroup) {
                $googleGroup = new \App\Entity\Group();
                $googleGroup->setUser($user);
                $googleGroup->setName('google');
                $this->entityManager->persist($googleGroup);
                $this->entityManager->flush();
            }
        }

        $importedCount = 0;
        $pageToken = null;

        do {
            $query = [
                'personFields' => 'names,birthdays,emailAddresses,phoneNumbers,' .
                    'addresses,organizations,biographies,memberships',
                'pageSize' => 1000,
            ];

            if ($pageToken) {
                $query['pageToken'] = $pageToken;
            }

            $response = $this->httpClient->request('GET', self::PEOPLE_API_URL, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
                'query' => $query,
            ]);

            $data = $response->toArray();

            if (!isset($data['connections']) || 0 === count($data['connections'])) {
                break;
            }

            foreach ($data['connections'] as $connection) {
                $resourceName = $connection['resourceName'] ?? null;
                if (null === $resourceName) {
                    continue;
                }

                $names = [];
                if (isset($connection['names'])) {
                    foreach ($connection['names'] as $nameParam) {
                        if (isset($nameParam['givenName']) || isset($nameParam['familyName'])) {
                            $names[] = new ContactNameDto(
                                family: $nameParam['familyName'] ?? '',
                                given: $nameParam['givenName'] ?? ''
                            );
                        }
                    }
                }

                $dates = [];
                if (isset($connection['birthdays'])) {
                    foreach ($connection['birthdays'] as $birthday) {
                        if (isset($birthday['date'])) {
                            $dateParts = $birthday['date'];
                            if (isset($dateParts['year'], $dateParts['month'], $dateParts['day'])) {
                                try {
                                    $date = new \DateTime(sprintf(
                                        '%04d-%02d-%02d',
                                        $dateParts['year'],
                                        $dateParts['month'],
                                        $dateParts['day']
                                    ));
                                    $dates[] = new ContactDateDto($date, 'Birthday');
                                } catch (\Exception $e) {
                                    // Ignore invalid dates
                                }
                            }
                        }
                    }
                }

                if (0 === count($names)) {
                    continue;
                }

                $emails = [];
                if (isset($connection['emailAddresses'])) {
                    foreach ($connection['emailAddresses'] as $emailParam) {
                        $emails[] = new ContactEmailDto(
                            value: $emailParam['value'] ?? '',
                            type: $emailParam['type'] ?? ''
                        );
                    }
                }

                $phones = [];
                if (isset($connection['phoneNumbers'])) {
                    foreach ($connection['phoneNumbers'] as $phoneParam) {
                        $phones[] = new ContactPhoneDto(
                            value: $phoneParam['value'] ?? '',
                            type: $phoneParam['type'] ?? ''
                        );
                    }
                }

                $addresses = [];
                if (isset($connection['addresses'])) {
                    foreach ($connection['addresses'] as $addressParam) {
                        $addresses[] = new ContactAddressDto(
                            street: $addressParam['streetAddress'] ?? '',
                            streetExtended: $addressParam['extendedAddress'] ?? '',
                            city: $addressParam['city'] ?? '',
                            region: $addressParam['region'] ?? '',
                            postalCode: $addressParam['postalCode'] ?? '',
                            country: $addressParam['country'] ?? '',
                            countryCode: $addressParam['countryCode'] ?? '',
                            type: $addressParam['type'] ?? ''
                        );
                    }
                }

                $organizations = [];
                if (isset($connection['organizations'])) {
                    foreach ($connection['organizations'] as $orgParam) {
                        $startDate = null;
                        if (isset($orgParam['startDate'])) {
                            $sd = $orgParam['startDate'];
                            if (isset($sd['year'], $sd['month'], $sd['day'])) {
                                $startDate = new \DateTime(
                                    sprintf('%04d-%02d-%02d', $sd['year'], $sd['month'], $sd['day'])
                                );
                            }
                        }
                        $endDate = null;
                        if (isset($orgParam['endDate'])) {
                            $ed = $orgParam['endDate'];
                            if (isset($ed['year'], $ed['month'], $ed['day'])) {
                                $endDate = new \DateTime(
                                    sprintf('%04d-%02d-%02d', $ed['year'], $ed['month'], $ed['day'])
                                );
                            }
                        }

                        $organizations[] = new ContactOrganizationDto(
                            name: $orgParam['name'] ?? '',
                            department: $orgParam['department'] ?? '',
                            title: $orgParam['title'] ?? '',
                            jobDescription: $orgParam['jobDescription'] ?? '',
                            type: $orgParam['type'] ?? '',
                            startDate: $startDate,
                            endDate: $endDate
                        );
                    }
                }

                $biographies = [];
                if (isset($connection['biographies'])) {
                    foreach ($connection['biographies'] as $bioParam) {
                        $biographies[] = new ContactBiographyDto(
                            value: $bioParam['value'] ?? '',
                            type: $bioParam['type'] ?? ''
                        );
                    }
                }

                $contactGroups = [];
                if (isset($connection['memberships'])) {
                    foreach ($connection['memberships'] as $membership) {
                        $groupResourceName = $membership['contactGroupMembership']['contactGroupResourceName'] ?? null;
                        if ($groupResourceName && isset($groupsMap[$groupResourceName])) {
                            $contactGroups[] = $groupsMap[$groupResourceName];
                        }
                    }
                }

                if (null !== $googleGroup) {
                    $exists = false;
                    foreach ($contactGroups as $g) {
                        if ($g === $googleGroup || (null !== $g->getId() && $g->getId() === $googleGroup->getId())) {
                            $exists = true;
                            break;
                        }
                    }
                    if (!$exists) {
                        $contactGroups[] = $googleGroup;
                    }
                }

                $dto = new ContactImportDto(
                    names: $names,
                    dates: $dates,
                    emails: $emails,
                    phones: $phones,
                    addresses: $addresses,
                    organizations: $organizations,
                    biographies: $biographies,
                    groups: $contactGroups
                );

                $mapping = $this->importMappingRepository->findOneBy([
                    'type' => 'google',
                    'externalId' => $resourceName,
                    'user' => $user,
                ]);

                $contact = null;
                if (null !== $mapping) {
                    $contact = $mapping->getContact();
                    if (null !== $contact) {
                        try {
                            // Force initialization to verify existence
                            /** @psalm-suppress UnusedMethodCall */
                            $contact->getUuid();
                            $this->contactImportService->update($contact, $dto);
                            ++$importedCount;
                        } catch (\Doctrine\ORM\EntityNotFoundException) {
                            $contact = null;
                        }
                    }
                }

                if (null === $contact) {
                    $contact = $this->contactImportService->import($dto, $user);
                    if (null !== $contact) {
                        if (null === $mapping) {
                            $mapping = new ImportMapping();
                            $mapping->setType('google');
                            $mapping->setExternalId($resourceName);
                            $mapping->setUser($user);
                        }
                        $mapping->setContact($contact);
                        $this->entityManager->persist($mapping);
                        $this->entityManager->flush();
                        ++$importedCount;
                    }
                }
            }

            $pageToken = $data['nextPageToken'] ?? null;
        } while ($pageToken);

        return $importedCount;
    }

    private function getValidAccessToken(TokenStorage $tokenStorage): string
    {
        if ($tokenStorage->getTokenExpiresAt() > new \DateTimeImmutable()) {
            return (string) $tokenStorage->getAccessToken();
        }

        $refreshToken = $tokenStorage->getRefreshToken();
        if (null === $refreshToken) {
            throw new \RuntimeException('Access token expired and no refresh token available.');
        }

        $newTokens = $this->oauthService->refreshAccessToken($refreshToken);

        $tokenStorage->setAccessToken($newTokens['access_token']);
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable(sprintf('+%d seconds', $newTokens['expires_in'])));

        // Save the new token
        $this->entityManager->flush();

        return (string) $tokenStorage->getAccessToken();
    }

    /**
     * @return array<string, \App\Entity\Group>
     */
    private function importGroups(User $user, string $accessToken): array
    {
        $groupsMap = [];
        $pageToken = null;

        do {
            $query = [];
            if ($pageToken) {
                $query['pageToken'] = $pageToken;
            }

            $response = $this->httpClient->request('GET', self::GROUPS_API_URL, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
                'query' => $query,
            ]);

            $data = $response->toArray();

            if (!isset($data['contactGroups'])) {
                break;
            }

            foreach ($data['contactGroups'] as $groupData) {
                $resourceName = $groupData['resourceName'] ?? null;
                $name = $groupData['formattedName'] ?? $groupData['name'] ?? null;

                if (null === $resourceName || null === $name) {
                    continue;
                }

                $mapping = $this->importMappingRepository->findOneBy([
                    'type' => 'google_group',
                    'externalId' => $resourceName,
                    'user' => $user,
                ]);

                $group = $mapping?->getGroup();
                if (null !== $group) {
                    try {
                        // Force initialization to verify existence
                        /** @psalm-suppress UnusedMethodCall */
                        $group->getName();
                    } catch (\Doctrine\ORM\EntityNotFoundException) {
                        $group = null;
                    }
                }

                if (null !== $group) {
                    $group->setName($name);
                } else {
                    $group = $this->entityManager->getRepository(\App\Entity\Group::class)->findOneBy([
                        'user' => $user,
                        'name' => $name,
                    ]);

                    if (null === $group) {
                        $group = new \App\Entity\Group();
                        $group->setUser($user);
                        $group->setName($name);
                        $this->entityManager->persist($group);
                    }

                    if (null === $mapping) {
                        $mapping = new ImportMapping();
                        $mapping->setType('google_group');
                        $mapping->setExternalId($resourceName);
                        $mapping->setUser($user);
                    }
                    $mapping->setGroup($group);
                    $this->entityManager->persist($mapping);
                }

                $groupsMap[$resourceName] = $group;
            }

            $pageToken = $data['nextPageToken'] ?? null;
        } while ($pageToken);

        $this->entityManager->flush();

        return $groupsMap;
    }
}
