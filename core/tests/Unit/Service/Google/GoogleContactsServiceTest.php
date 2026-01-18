<?php

namespace App\Tests\Unit\Service\Google;

use App\Entity\Contact;
use App\Entity\ImportMapping;
use App\Entity\TokenStorage;
use App\Entity\User;
use App\Repository\ImportMappingRepository;
use App\Repository\TokenStorageRepository;
use App\Service\ContactImport\ContactImportService;
use App\Service\Google\GoogleContactsService;
use App\Service\Google\GoogleOAuthService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;
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
    /** @var ContactImportService&\PHPUnit\Framework\MockObject\Stub */
    private ContactImportService $contactImportService;
    /** @var EntityManagerInterface&\PHPUnit\Framework\MockObject\Stub */
    private EntityManagerInterface $entityManager;
    private GoogleContactsService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->importMappingRepository = self::createStub(ImportMappingRepository::class);
        $this->oauthService = self::createStub(GoogleOAuthService::class);
        $this->httpClient = new MockHttpClient();
        $this->contactImportService = self::createStub(ContactImportService::class);
        $this->entityManager = self::createStub(EntityManagerInterface::class);

        $this->service = new GoogleContactsService(
            $this->tokenStorageRepository,
            $this->importMappingRepository,
            $this->oauthService,
            $this->httpClient,
            $this->contactImportService,
            $this->entityManager,
            70,
        );
    }

    public function testImportContactsHandlesZombieContact(): void
    {
        $user = new User();
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
                    'resourceName' => 'people/zombie',
                    'names' => [['givenName' => 'John']],
                ],
            ],
        ]));

        $this->httpClient = new MockHttpClient([$responseGroups, $responseContacts]);

        // Setup Zombie Mapping
        $mapping = self::createStub(ImportMapping::class);
        $contact = self::createStub(Contact::class);
        $mapping->method('getContact')->willReturn($contact);

        // This is what triggers the Zombie error
        $contact->method('getUuid')->willThrowException(new \Doctrine\ORM\EntityNotFoundException());

        $this->importMappingRepository = self::createStub(ImportMappingRepository::class);
        $this->importMappingRepository->method('findOneBy')->willReturn($mapping);

        // Expectation: use Mock (spy) object for service if we want to check `import` called
        // createStub allows method calls but doesn't track them for `expects`.
        // We can use a spy for ContactImportService?
        // Let's use createMock here for ContactImportService ONLY?
        // If createMock generates a notice, we fail.
        // Let's just create a Stub and assert it returns logic?
        // Or fail the test if logic flow isn't exercised?

        // This test verifies that EntityNotFoundException is CAUGHT and processed as "Import (New)".
        // If it wasn't caught, the test would crash.
        // So just running it without exception is passing?
        // But we want to ensure `import` IS called.

        $this->contactImportService = $this->createMock(ContactImportService::class);
        $this->contactImportService->expects($this->once())->method('import')->willReturn(new Contact());

        $this->recreateService();

        $this->service->importContacts($user);
    }

    public function testImportContactsCreatesGoogleGroup(): void
    {
        $user = new User();
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
                    'names' => [['givenName' => 'John']],
                ],
            ],
        ]));

        $this->httpClient = new MockHttpClient([$responseGroups, $responseContacts]);

        $groupRepository = self::createStub(\Doctrine\ORM\EntityRepository::class);

        $this->entityManager = self::createStub(EntityManagerInterface::class);
        $this->entityManager->method('getRepository')->willReturn($groupRepository);
        $groupRepository->method('findOneBy')->willReturn(null); // google group doesn't exist

        // Expectation: EntityManager->persist(googleGroup)
        // If we use createMock for EM, we risk notices.
        // But verifying persist is done.
        // Let's try createMock for EM only here.

        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->entityManager->method('getRepository')->willReturn($groupRepository);

        $this->entityManager->expects($this->atLeastOnce())
            ->method('persist')
            ->with(self::callback(function ($obj) {
                return $obj instanceof \App\Entity\Group && 'google' === $obj->getName();
            }));

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
            $this->contactImportService,
            $this->entityManager,
            70,
        );
    }
}
