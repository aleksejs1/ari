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
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;

#[AllowMockObjectsWithoutExpectations]
final class GoogleContactsServiceTest extends TestCase
{
    private GoogleContactsService $service;
    /** @var TokenStorageRepository&MockObject */
    private TokenStorageRepository $tokenStorageRepository;
    /** @var \App\Repository\ImportMappingRepository&MockObject */
    private \App\Repository\ImportMappingRepository $importMappingRepository;
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
        $this->importMappingRepository = $this->createMock(\App\Repository\ImportMappingRepository::class);
        $this->oauthService = $this->createMock(GoogleOAuthService::class);
        $this->httpClient = $this->createMock(HttpClientInterface::class);
        $this->contactImportService = $this->createMock(ContactImportService::class);
        $this->entityManager = $this->createMock(EntityManagerInterface::class);

        $this->service = new GoogleContactsService(
            $this->tokenStorageRepository,
            $this->importMappingRepository,
            $this->oauthService,
            $this->httpClient,
            $this->contactImportService,
            $this->entityManager
        );
    }

    public function testImportContactsCreatesNewContactsWhenNoMappingExists(): void
    {
        $user = new User();
        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('access_token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->tokenStorageRepository->expects(self::once())
            ->method('findOneBy')
            ->with(['user' => $user, 'type' => 'google'])
            ->willReturn($tokenStorage);

        $groupsResponse = $this->createMock(ResponseInterface::class);
        $groupsResponse->method('toArray')->willReturn([
            'contactGroups' => [
                ['resourceName' => 'contactGroups/g1', 'formattedName' => 'Group 1'],
            ],
        ]);

        $contactsResponse = $this->createMock(ResponseInterface::class);
        $contactsResponse->method('toArray')->willReturn([
            'connections' => [
                [
                    'resourceName' => 'people/c123',
                    'names' => [['givenName' => 'John', 'familyName' => 'Doe']],
                    'birthdays' => [['date' => ['year' => 1990, 'month' => 1, 'day' => 1]]],
                    'memberships' => [
                        ['contactGroupMembership' => ['contactGroupResourceName' => 'contactGroups/g1']],
                    ],
                ],
            ],
        ]);

        $this->httpClient->expects(self::exactly(2))
            ->method('request')
            ->willReturnCallback(function (string $method, string $url) use ($groupsResponse, $contactsResponse) {
                if (str_contains($url, 'contactGroups')) {
                    return $groupsResponse;
                }
                return $contactsResponse;
            });

        $this->importMappingRepository->expects(self::exactly(2))
            ->method('findOneBy')
            ->willReturnMap([
                [['type' => 'google_group', 'externalId' => 'contactGroups/g1', 'user' => $user], null],
                [['type' => 'google', 'externalId' => 'people/c123', 'user' => $user], null],
            ]);

        $contact = $this->createMock(\App\Entity\Contact::class);
        $this->contactImportService->expects(self::once())
            ->method('import')
            ->willReturn($contact);

        $this->entityManager->expects(self::exactly(3))
            ->method('persist')
            ->with(self::logicalOr(
                self::isInstanceOf(\App\Entity\Group::class),
                self::isInstanceOf(\App\Entity\ImportMapping::class)
            ));
        $this->entityManager->expects(self::exactly(2))->method('flush');

        $count = $this->service->importContacts($user);
        self::assertEquals(1, $count);
    }

    public function testImportContactsUpdatesExistingContactsWhenMappingExists(): void
    {
        $user = new User();
        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('access_token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->tokenStorageRepository->expects(self::once())
            ->method('findOneBy')
            ->with(['user' => $user, 'type' => 'google'])
            ->willReturn($tokenStorage);

        $groupsResponse = $this->createMock(ResponseInterface::class);
        $groupsResponse->method('toArray')->willReturn(['contactGroups' => []]);

        $contactsResponse = $this->createMock(ResponseInterface::class);
        $contactsResponse->method('toArray')->willReturn([
            'connections' => [
                [
                    'resourceName' => 'people/c123',
                    'names' => [['givenName' => 'John', 'familyName' => 'Updated']],
                ],
            ],
        ]);

        $this->httpClient->expects(self::exactly(2))
            ->method('request')
            ->willReturnCallback(function (string $method, string $url) use ($groupsResponse, $contactsResponse) {
                if (str_contains($url, 'contactGroups')) {
                    return $groupsResponse;
                }
                return $contactsResponse;
            });

        $contact = $this->createMock(\App\Entity\Contact::class);
        $mapping = $this->createMock(\App\Entity\ImportMapping::class);
        $mapping->method('getContact')->willReturn($contact);

        $this->importMappingRepository->expects(self::once())
            ->method('findOneBy')
            ->with(['type' => 'google', 'externalId' => 'people/c123', 'user' => $user])
            ->willReturn($mapping);

        $this->contactImportService->expects(self::once())
            ->method('update')
            ->with($contact, self::anything());

        $this->entityManager->expects(self::once())->method('flush'); // from importGroups

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

        $groupsResponse = $this->createMock(ResponseInterface::class);
        $groupsResponse->method('toArray')->willReturn(['contactGroups' => []]);

        $contactsResponse = $this->createMock(ResponseInterface::class);
        $contactsResponse->method('toArray')->willReturn(['connections' => []]);

        $this->httpClient->expects(self::exactly(2))
            ->method('request')
            ->willReturnCallback(function (string $method, string $url) use ($groupsResponse, $contactsResponse) {
                if (str_contains($url, 'contactGroups')) {
                    return $groupsResponse;
                }
                return $contactsResponse;
            });

        $this->entityManager->expects(self::exactly(2))->method('flush'); // 1 from refresh, 1 from importGroups

        $this->service->importContacts($user);

        self::assertEquals('new_access_token', $tokenStorage->getAccessToken());
    }
}
