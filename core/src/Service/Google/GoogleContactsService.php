<?php

namespace App\Service\Google;

use App\Dto\ContactDateDto;
use App\Dto\ContactImportDto;
use App\Dto\ContactNameDto;
use App\Entity\TokenStorage;
use App\Entity\User;
use App\Repository\TokenStorageRepository;
use App\Service\ContactImport\ContactImportService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GoogleContactsService
{
    private const PEOPLE_API_URL = 'https://people.googleapis.com/v1/people/me/connections';

    public function __construct(
        private readonly TokenStorageRepository $tokenStorageRepository,
        private readonly GoogleOAuthService $oauthService,
        private readonly HttpClientInterface $httpClient,
        private readonly ContactImportService $contactImportService,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function importContacts(User $user): int
    {
        $tokenStorage = $this->tokenStorageRepository->findOneBy(['user' => $user, 'type' => 'google']);

        if (null === $tokenStorage) {
            throw new \RuntimeException('No Google connection found for this user.');
        }

        $accessToken = $this->getValidAccessToken($tokenStorage);

        $response = $this->httpClient->request('GET', self::PEOPLE_API_URL, [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
            ],
            'query' => [
                'personFields' => 'names,birthdays',
                'pageSize' => 1000,
            ],
        ]);

        $data = $response->toArray();
        $importedCount = 0;

        if (!isset($data['connections']) || 0 === count($data['connections'])) {
            return 0;
        }

        foreach ($data['connections'] as $connection) {
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

            $dto = new ContactImportDto(
                names: $names,
                dates: $dates
            );

            if (null !== $this->contactImportService->import($dto, $user)) {
                ++$importedCount;
            }
        }

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
}
