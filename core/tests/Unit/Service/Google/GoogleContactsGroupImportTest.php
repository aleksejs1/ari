<?php

namespace Ari\Tests\Unit\Service\Google;

use Ari\Entity\Group;
use Ari\Entity\ImportMapping;
use Ari\Entity\TokenStorage;
use Ari\Entity\User;
use Ari\Repository\ImportMappingRepository;
use Ari\Repository\TokenStorageRepository;
use Ari\Service\Entitlement\EntitlementServiceInterface;
use Ari\Service\Google\GoogleContactsService;
use Ari\Service\Google\GoogleOAuthService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[\PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations]
class GoogleContactsGroupImportTest extends TestCase
{
    private TokenStorageRepository $tokenStorageRepository;
    private ImportMappingRepository $importMappingRepository;
    private GoogleOAuthService $oauthService;
    private HttpClientInterface $httpClient;
    private EntityManagerInterface $entityManager;
    private MessageBusInterface $bus;
    private GoogleContactsService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->importMappingRepository = self::createStub(ImportMappingRepository::class);
        $this->oauthService = self::createStub(GoogleOAuthService::class);
        $this->httpClient = new MockHttpClient(); // No requests expected by default
        $this->entityManager = self::createStub(EntityManagerInterface::class);
        $this->bus = self::createStub(MessageBusInterface::class);
        $entitlementService = static::createStub(EntitlementServiceInterface::class);
        $entitlementService->method('remainingQuota')->willReturn(PHP_INT_MAX);

        $this->service = new GoogleContactsService(
            $this->tokenStorageRepository,
            $this->importMappingRepository,
            $this->oauthService,
            $this->httpClient,
            $this->entityManager,
            $this->bus,
            $entitlementService,
            70,
            'https://people.googleapis.com/v1/people/me/connections',
            'https://people.googleapis.com/v1/contactGroups',
        );
    }

    public function testGroupImportReusesExistingGroupByName(): void
    {
        $user = new User();
        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->tokenStorageRepository->method('findOneBy')->willReturn($tokenStorage);

        $responseGroups = new MockResponse((string) json_encode([
            'contactGroups' => [
                [
                    'resourceName' => 'contactGroups/123',
                    'formattedName' => 'Existing Group',
                ],
            ],
        ]));

        $responseContacts = new MockResponse((string) json_encode(['connections' => []]));

        $this->httpClient = new MockHttpClient([$responseGroups, $responseContacts]);

        // No mapping exists yet
        $this->importMappingRepository = self::createStub(ImportMappingRepository::class);
        $this->importMappingRepository->method('findOneBy')->willReturn(null);

        // But a group with the same name EXISTS in the database
        $existingGroup = new Group();
        $existingGroup->setName('Existing Group');
        $existingGroup->setUser($user);

        $groupRepository = self::createStub(EntityRepository::class);

        $this->entityManager = self::createStub(EntityManagerInterface::class);
        $this->entityManager->method('getRepository')->willReturnMap([
            [Group::class, $groupRepository],
        ]);

        $groupRepository->method('findOneBy')
            ->willReturn($existingGroup);

        // Expectation: A new ImportMapping is created linking to $existingGroup
        // AND NO new Group is persisted

        $persisted = [];
        $this->entityManager->method('persist')->willReturnCallback(function ($obj) use (&$persisted) {
            $persisted[] = $obj;
        });

        $this->recreateService();

        $this->service->importContacts($user);

        self::assertCount(1, $persisted);
        $obj = $persisted[0];
        self::assertInstanceOf(ImportMapping::class, $obj);
        self::assertSame($existingGroup, $obj->getGroup());
    }

    private function recreateService(): void
    {
        $entitlementService = static::createStub(EntitlementServiceInterface::class);
        $entitlementService->method('remainingQuota')->willReturn(PHP_INT_MAX);

        $this->service = new GoogleContactsService(
            $this->tokenStorageRepository,
            $this->importMappingRepository,
            $this->oauthService,
            $this->httpClient,
            $this->entityManager,
            $this->bus,
            $entitlementService,
            70,
            'https://people.googleapis.com/v1/people/me/connections',
            'https://people.googleapis.com/v1/contactGroups',
        );
    }
}
