<?php

namespace App\Tests\Unit\Service\Google;

use App\Entity\TokenStorage;
use App\Entity\User;
use App\Message\ImportGoogleContactMessage;
use App\Repository\ImportMappingRepository;
use App\Repository\TokenStorageRepository;
use App\Service\Google\GoogleContactsService;
use App\Service\Google\GoogleOAuthService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[ \PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations]
class GoogleContactsServiceTest extends TestCase
{
    /** @var TokenStorageRepository&\PHPUnit\Framework\MockObject\Stub */
    private TokenStorageRepository $tokenStorageRepository;
    /** @var ImportMappingRepository&\PHPUnit\Framework\MockObject\Stub */
    private ImportMappingRepository $importMappingRepository;
    /** @var GoogleOAuthService&\PHPUnit\Framework\MockObject\Stub */
    private GoogleOAuthService $oauthService;
    private HttpClientInterface $httpClient;
    /** @var EntityManagerInterface&\PHPUnit\Framework\MockObject\Stub */
    private EntityManagerInterface $entityManager;
    /** @var MessageBusInterface&\PHPUnit\Framework\MockObject\MockObject */
    private MessageBusInterface $bus;
    private GoogleContactsService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->importMappingRepository = self::createStub(ImportMappingRepository::class);
        $this->oauthService = self::createStub(GoogleOAuthService::class);
        $this->httpClient = new MockHttpClient();
        $this->entityManager = self::createStub(EntityManagerInterface::class);
        $this->bus = $this->createMock(MessageBusInterface::class);

        $this->service = new GoogleContactsService(
            $this->tokenStorageRepository,
            $this->importMappingRepository,
            $this->oauthService,
            $this->httpClient,
            $this->entityManager,
            $this->bus,
            70,
        );
    }

    public function testImportContactsDispatchesMessages(): void
    {
        $user = new User();
        $this->setUserId($user, 1);

        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->tokenStorageRepository->method('findOneBy')->willReturn($tokenStorage);

        // Mock Google API Responses
        $responseGroups = new MockResponse((string) json_encode(['contactGroups' => []]));
        $responseContacts = new MockResponse((string) json_encode([
            'connections' => [
                [
                    'resourceName' => 'people/123',
                ],
                [
                    'resourceName' => 'people/456',
                ],
            ],
        ]));

        $this->httpClient = new MockHttpClient([$responseGroups, $responseContacts]);

        $this->bus->expects(self::exactly(2))
            ->method('dispatch')
            ->with(self::callback(function ($message) {
                return $message instanceof ImportGoogleContactMessage;
            }))
            ->willReturn(new Envelope(new \stdClass()));

        $this->recreateService();

        $count = $this->service->importContacts($user);

        self::assertEquals(2, $count);
    }

    public function testImportContactsCreatesGoogleGroup(): void
    {
        $user = new User();
        $this->setUserId($user, 1);

        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->tokenStorageRepository->method('findOneBy')->willReturn($tokenStorage);

        $responseGroups = new MockResponse((string) json_encode(['contactGroups' => []]));

        $responseContacts = new MockResponse((string) json_encode([
            'connections' => [
                [
                    'resourceName' => 'people/123',
                ],
            ],
        ]));

        $this->httpClient = new MockHttpClient([$responseGroups, $responseContacts]);

        $groupRepository = self::createStub(\Doctrine\ORM\EntityRepository::class);

        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->entityManager->method('getRepository')->willReturn($groupRepository);
        $groupRepository->method('findOneBy')->willReturn(null); // google group doesn't exist

        $this->entityManager->expects(self::atLeastOnce())
            ->method('persist')
            ->with(self::callback(function ($obj) {
                // We expect Group persist AND potentially ImportMapping from group import if that was mocked to return date
                // But here we specifically care about the 'google' group creation
                return $obj instanceof \App\Entity\Group && 'google' === $obj->getName();
            }));

        $this->bus->expects(self::once())
             ->method('dispatch')
             ->willReturn(new Envelope(new \stdClass()));

        $this->recreateService();

        $this->service->importContacts($user, true);
    }

    private function recreateService(): void
    {
        $this->service = new GoogleContactsService(
            $this->tokenStorageRepository,
            $this->importMappingRepository,
            $this->oauthService,
            $this->httpClient,
            $this->entityManager,
            $this->bus,
            70,
        );
    }

    private function setUserId(User $user, int $id): void
    {
        $reflection = new \ReflectionClass($user);
        $property = $reflection->getProperty('id');
        $property->setValue($user, $id);
    }
}
