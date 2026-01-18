<?php

namespace App\Service\Google;

use App\Entity\ImportMapping;
use App\Entity\TokenStorage;
use App\Entity\User;
use App\Message\ImportGoogleContactMessage;
use App\Repository\ImportMappingRepository;
use App\Repository\TokenStorageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\MessageBusInterface;
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
        private readonly EntityManagerInterface $entityManager,
        private readonly MessageBusInterface $bus,
        private readonly int $importLimit,
    ) {
    }

    public function importContacts(User $user, bool $addGoogleGroup = false): int
    {
        $tokenStorage = $this->tokenStorageRepository->findOneBy(['user' => $user, 'type' => 'google']);

        if (null === $tokenStorage) {
            throw new \RuntimeException('No Google connection found for this user.');
        }

        $accessToken = $this->getValidAccessToken($tokenStorage);
        // Pre-warm groups synchronously
        $this->importGroups($user, $accessToken);

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

        $dispatchedCount = 0;
        $pageToken = null;

        do {
            // Optimized query: Only request metadata to get resourceName
            $query = [
                'personFields' => 'metadata',
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

                $this->bus->dispatch(new ImportGoogleContactMessage(
                    (int) $user->getId(),
                    $resourceName,
                    $addGoogleGroup,
                ));

                ++$dispatchedCount;

                if ($dispatchedCount >= $this->importLimit) {
                    break;
                }
            }

            $pageToken = $data['nextPageToken'] ?? null;
        } while ($pageToken && $dispatchedCount < $this->importLimit);

        return $dispatchedCount;
    }

    public function getValidAccessToken(TokenStorage $tokenStorage): string
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

    private function importGroups(User $user, string $accessToken): void
    {
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
            }

            $pageToken = $data['nextPageToken'] ?? null;
        } while ($pageToken);

        $this->entityManager->flush();
    }
}
