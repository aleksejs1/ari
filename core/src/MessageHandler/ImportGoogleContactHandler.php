<?php

namespace Ari\MessageHandler;

use Ari\Dto\ContactAddressDto;
use Ari\Dto\ContactBiographyDto;
use Ari\Dto\ContactDateDto;
use Ari\Dto\ContactEmailDto;
use Ari\Dto\ContactImportDto;
use Ari\Dto\ContactNameDto;
use Ari\Dto\ContactOrganizationDto;
use Ari\Dto\ContactPhoneDto;
use Ari\Entity\Group;
use Ari\Entity\ImportMapping;
use Ari\Entity\TokenStorage;
use Ari\Entity\User;
use Ari\Message\ImportGoogleContactMessage;
use Ari\Repository\ImportMappingRepository;
use Ari\Repository\TokenStorageRepository;
use Ari\Repository\UserRepository;
use Ari\Service\ContactImport\ContactImportService;
use Ari\Service\Entitlement\EntitlementServiceInterface;
use Ari\Service\Entitlement\EntitlementState;
use Ari\Service\Google\GoogleOAuthService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsMessageHandler]
final class ImportGoogleContactHandler
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly TokenStorageRepository $tokenStorageRepository,
        private readonly ImportMappingRepository $importMappingRepository,
        private readonly GoogleOAuthService $oauthService,
        private readonly HttpClientInterface $httpClient,
        private readonly ContactImportService $contactImportService,
        private readonly EntitlementServiceInterface $entitlementService,
        private readonly EntityManagerInterface $entityManager,
        #[Autowire('%google_people_api_base_url%')]
        private readonly string $peopleApiBase,
    ) {
    }

    /**
     * Imports a single Google contact for the given user.
     *
     * This handler is idempotent via ImportMapping: if a contact with the same
     * Google resourceName has already been imported, the existing contact is
     * updated rather than duplicated. Message retries are therefore safe.
     */
    public function __invoke(ImportGoogleContactMessage $message): void
    {
        $user = $this->userRepository->find($message->userId);
        if (null === $user) {
            return;
        }

        // Idempotency guard: load the existing mapping up-front so it is visible
        // here rather than buried in saveContact(). If this message is re-delivered
        // (retry or duplicate dispatch), saveContact() will update the existing
        // contact instead of creating a second one.
        $existingMapping = $this->importMappingRepository->findOneBy([
            'type' => 'google',
            'externalId' => $message->resourceName,
            'user' => $user,
        ]);

        $tokenStorage = $this->tokenStorageRepository->findOneBy(['user' => $user, 'type' => 'google']);
        if (null === $tokenStorage) {
            // Cannot proceed without token
            return;
        }

        $accessToken = $this->getValidAccessToken($tokenStorage);

        try {
            $data = $this->fetchContact($message->resourceName, $accessToken);
        } catch (\Exception $e) {
            // Log error or retry based on exception type?
            // For now let it throw so Messenger can retry if needed (or fail)
            throw $e;
        }

        if ([] === $data) {
            return;
        }

        $contactDto = $this->mapToDto($data, $user, $message->addGoogleGroup, $accessToken);
        $this->saveContact($contactDto, $message->resourceName, $user, $existingMapping);
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

        $this->entityManager->flush();

        return (string) $tokenStorage->getAccessToken();
    }

    /**
     * @return array<mixed>
     */
    private function fetchContact(string $resourceName, string $accessToken): array
    {
        $response = $this->httpClient->request('GET', $this->peopleApiBase . $resourceName, [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
            ],
            'query' => [
                'personFields' => 'names,birthdays,emailAddresses,phoneNumbers,' .
                    'addresses,organizations,biographies,memberships,photos',
            ],
        ]);

        return $response->toArray();
    }

    /**
     * @param array<mixed> $data
     */
    private function mapToDto(array $data, User $user, bool $addGoogleGroup, string $accessToken): ContactImportDto
    {
        $names = [];
        if (isset($data['names'])) {
            foreach ($data['names'] as $nameParam) {
                if (isset($nameParam['givenName']) || isset($nameParam['familyName'])) {
                    $names[] = new ContactNameDto(
                        family: $nameParam['familyName'] ?? '',
                        given: $nameParam['givenName'] ?? '',
                    );
                }
            }
        }

        $dates = [];
        if (isset($data['birthdays'])) {
            foreach ($data['birthdays'] as $birthday) {
                if (isset($birthday['date'])) {
                    $dateParts = $birthday['date'];
                    if (isset($dateParts['year'], $dateParts['month'], $dateParts['day'])) {
                        try {
                            $date = new \DateTime(sprintf(
                                '%04d-%02d-%02d',
                                $dateParts['year'],
                                $dateParts['month'],
                                $dateParts['day'],
                            ));
                            $dates[] = new ContactDateDto($date, 'Birthday');
                        } catch (\Exception $e) {
                            // Ignore invalid dates
                        }
                    }
                }
            }
        }

        $emails = [];
        if (isset($data['emailAddresses'])) {
            foreach ($data['emailAddresses'] as $emailParam) {
                $emails[] = new ContactEmailDto(
                    value: $emailParam['value'] ?? '',
                    type: $emailParam['type'] ?? '',
                );
            }
        }

        $phones = [];
        if (isset($data['phoneNumbers'])) {
            foreach ($data['phoneNumbers'] as $phoneParam) {
                $phones[] = new ContactPhoneDto(
                    value: $phoneParam['value'] ?? '',
                    type: $phoneParam['type'] ?? '',
                );
            }
        }

        $addresses = [];
        if (isset($data['addresses'])) {
            foreach ($data['addresses'] as $addressParam) {
                $addresses[] = new ContactAddressDto(
                    street: $addressParam['streetAddress'] ?? '',
                    streetExtended: $addressParam['extendedAddress'] ?? '',
                    city: $addressParam['city'] ?? '',
                    region: $addressParam['region'] ?? '',
                    postalCode: $addressParam['postalCode'] ?? '',
                    country: $addressParam['country'] ?? '',
                    countryCode: $addressParam['countryCode'] ?? '',
                    type: $addressParam['type'] ?? '',
                );
            }
        }

        $organizations = [];
        if (isset($data['organizations'])) {
            foreach ($data['organizations'] as $orgParam) {
                $startDate = null;
                if (isset($orgParam['startDate'])) {
                    $sd = $orgParam['startDate'];
                    if (isset($sd['year'], $sd['month'], $sd['day'])) {
                        $startDate = new \DateTime(
                            sprintf('%04d-%02d-%02d', $sd['year'], $sd['month'], $sd['day']),
                        );
                    }
                }
                $endDate = null;
                if (isset($orgParam['endDate'])) {
                    $ed = $orgParam['endDate'];
                    if (isset($ed['year'], $ed['month'], $ed['day'])) {
                        $endDate = new \DateTime(
                            sprintf('%04d-%02d-%02d', $ed['year'], $ed['month'], $ed['day']),
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
                    endDate: $endDate,
                );
            }
        }

        $biographies = [];
        if (isset($data['biographies'])) {
            foreach ($data['biographies'] as $bioParam) {
                $biographies[] = new ContactBiographyDto(
                    value: $bioParam['value'] ?? '',
                    type: $bioParam['type'] ?? '',
                );
            }
        }

        $contactGroups = [];
        if (isset($data['memberships'])) {
            foreach ($data['memberships'] as $membership) {
                $groupResourceName = $membership['contactGroupMembership']['contactGroupResourceName'] ?? null;
                if (null !== $groupResourceName) {
                    $group = $this->resolveGroup($user, $groupResourceName, $accessToken);
                    if (null !== $group) {
                        $contactGroups[] = $group;
                    }
                }
            }
        }

        $avatarContent = null;
        $avatarMimeType = null;
        if (isset($data['photos'])) {
            foreach ($data['photos'] as $photo) {
                // We prefer primary photo and ensure it's not the default placeholder
                if (true === ($photo['metadata']['primary'] ?? false) && true !== ($photo['default'] ?? false)) {
                    $url = $photo['url'] ?? null;
                    if (null !== $url) {
                        try {
                            $avatarResponse = $this->httpClient->request('GET', $url, [
                                'headers' => [
                                    'Authorization' => 'Bearer ' . $accessToken,
                                ],
                            ]);
                            if (200 === $avatarResponse->getStatusCode()) {
                                $avatarContent = $avatarResponse->getContent();
                                // Basic mime type detection or fallback
                                $userHeaders = $avatarResponse->getHeaders();
                                $contentType = $userHeaders['content-type'][0] ?? 'image/jpeg';
                                $avatarMimeType = $contentType;
                            }
                        } catch (\Exception $e) {
                            // Avatar download failure shouldn't stop contact import
                        }
                    }
                    break;
                }
            }
        }

        if ($addGoogleGroup) {
            $googleGroup = $this->entityManager->getRepository(Group::class)->findOneBy([
                'user' => $user,
                'name' => 'google',
            ]);

            if (null === $googleGroup) {
                // Should have been created by pre-warm, but strictly safe:
                $googleGroup = new Group();
                $googleGroup->setUser($user);
                $googleGroup->setName('google');
                $this->entityManager->persist($googleGroup);
                $this->entityManager->flush();
            }

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

        return new ContactImportDto(
            names: $names,
            dates: $dates,
            emails: $emails,
            phones: $phones,
            addresses: $addresses,
            organizations: $organizations,
            biographies: $biographies,
            groups: $contactGroups,
            avatarContent: $avatarContent,
            avatarMimeType: $avatarMimeType,
        );
    }

    private function resolveGroup(User $user, string $resourceName, string $accessToken): ?Group
    {
        $mapping = $this->importMappingRepository->findOneBy([
            'type' => 'google_group',
            'externalId' => $resourceName,
            'user' => $user,
        ]);

        if (null !== $mapping) {
            return $mapping->getGroup();
        }

        // Fallback: Fetch group from Google if not found
        try {
            $response = $this->httpClient->request('GET', $this->peopleApiBase . $resourceName, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
            ]);
            $groupData = $response->toArray();
            $name = $groupData['formattedName'] ?? $groupData['name'] ?? null;

            if (null === $name) {
                return null;
            }

            // Check if group exists by Name (maybe mapped differently or created manually?)
            $group = $this->entityManager->getRepository(Group::class)->findOneBy([
                'user' => $user,
                'name' => $name,
            ]);

            if (null === $group) {
                $group = new Group();
                $group->setUser($user);
                $group->setName($name);
                $this->entityManager->persist($group);
            }

            $mapping = new ImportMapping();
            $mapping->setType('google_group');
            $mapping->setExternalId($resourceName);
            $mapping->setUser($user);
            $mapping->setGroup($group);
            $this->entityManager->persist($mapping);
            $this->entityManager->flush();

            return $group;

        } catch (\Exception $e) {
            // Failed to fetch group or other error
            return null;
        }
    }

    private function saveContact(ContactImportDto $dto, string $resourceName, User $user, ?ImportMapping $mapping): void
    {
        $contact = null;
        if (null !== $mapping) {
            $contact = $mapping->getContact();
            if (null !== $contact) {
                try {
                    // Force initialization
                    /** @psalm-suppress UnusedMethodCall */
                    $contact->getUuid();
                    $this->contactImportService->update($contact, $dto);
                } catch (\Doctrine\ORM\EntityNotFoundException) {
                    $contact = null;
                }
            }
        }

        if (null === $contact) {
            // Secondary quota guard — covers race conditions with dispatch-time check.
            // NOTE: check-then-create is not atomic (known limitation, see PLAN_ENTITLEMENTS.md §Phase 2).
            if (EntitlementState::Allowed !== $this->entitlementService->checkQuota($user, 'contacts')) {
                // Quota exceeded — ack message silently without creating the contact
                return;
            }

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
            }
        }
    }
}
