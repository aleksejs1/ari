<?php

namespace App\Tests\Unit\Service\Google;

use App\Entity\TokenStorage;
use App\Entity\User;
use App\Repository\TokenStorageRepository;
use App\Service\ContactImport\ContactImportService;
use App\Service\Google\GoogleContactsService;
use App\Service\Google\GoogleOAuthService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

final class GoogleContactsServiceTest extends TestCase
{
    private GoogleContactsService $service;
    /** @var TokenStorageRepository&MockObject */
    private TokenStorageRepository $tokenStorageRepository;
    /** @var GoogleOAuthService&MockObject */
    private GoogleOAuthService $oauthService;
    /** @var HttpClientInterface&MockObject */
    private HttpClientInterface $httpClient;
    /** @var ContactImportService&MockObject */
    private ContactImportService $contactImportService;
    /** @var EntityManagerInterface&MockObject */
    private EntityManagerInterface $entityManager;

    #[\Override]
    protected function setUp(): void
    {
        $this->tokenStorageRepository = $this->createMock(TokenStorageRepository::class);
        $this->oauthService = $this->createMock(GoogleOAuthService::class);
        $this->httpClient = $this->createMock(HttpClientInterface::class);
        $this->contactImportService = $this->createMock(ContactImportService::class);
        $this->entityManager = $this->createMock(EntityManagerInterface::class);

        $this->service = new GoogleContactsService(
            $this->tokenStorageRepository,
            $this->oauthService,
            $this->httpClient,
            $this->contactImportService,
            $this->entityManager
        );
    }

    public function testImportContactsImportsValidContacts(): void
    {
        $user = new User();
        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('access_token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->tokenStorageRepository->expects(self::once())
            ->method('findOneBy')
            ->with(['user' => $user, 'type' => 'google'])
            ->willReturn($tokenStorage);

        $response = $this->createMock(ResponseInterface::class);
        $response->method('toArray')->willReturn([
            'connections' => [
                [
                    'names' => [['givenName' => 'John', 'familyName' => 'Doe']],
                    'birthdays' => [['date' => ['year' => 1990, 'month' => 1, 'day' => 1]]],
                ],
            ],
        ]);

        $this->httpClient->expects(self::once())
            ->method('request')
            ->willReturn($response);

        $this->contactImportService->expects(self::once())
            ->method('import')
            ->willReturn($this->createMock(\App\Entity\Contact::class));

        $count = $this->service->importContacts($user);
        self::assertEquals(1, $count);
    }

    public function testImportContactsRefreshesTokenIfExpired(): void
    {
        $user = new User();
        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('expired_token');
        $tokenStorage->setRefreshToken('refresh_token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('-1 hour'));

        $this->tokenStorageRepository->expects(self::once())
            ->method('findOneBy')
            ->willReturn($tokenStorage);

        $this->oauthService->expects(self::once())
            ->method('refreshAccessToken')
            ->with('refresh_token')
            ->willReturn(['access_token' => 'new_access_token', 'expires_in' => 3600]);

        $this->entityManager->expects(self::once())->method('flush');

        $response = $this->createMock(ResponseInterface::class);
        $response->method('toArray')->willReturn(['connections' => []]);

        $this->httpClient->expects(self::once())
            ->method('request')
            // Verify new token is used
            ->with('GET', self::anything(), self::callback(function ($options) {
                return $options['headers']['Authorization'] === 'Bearer new_access_token';
            }))
            ->willReturn($response);

        $this->service->importContacts($user);

        self::assertEquals('new_access_token', $tokenStorage->getAccessToken());
    }
}
