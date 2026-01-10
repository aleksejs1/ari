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
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

#[ \PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations]
class GoogleContactsServiceTest extends TestCase
{
    private \PHPUnit\Framework\MockObject\MockObject&TokenStorageRepository $tokenStorageRepository;
    private \PHPUnit\Framework\MockObject\MockObject&ImportMappingRepository $importMappingRepository;
    private \PHPUnit\Framework\MockObject\MockObject&GoogleOAuthService $oauthService;
    private \PHPUnit\Framework\MockObject\MockObject&HttpClientInterface $httpClient;
    private \PHPUnit\Framework\MockObject\MockObject&ContactImportService $contactImportService;
    private \PHPUnit\Framework\MockObject\MockObject&EntityManagerInterface $entityManager;
    private GoogleContactsService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->tokenStorageRepository = $this->createMock(TokenStorageRepository::class);
        $this->importMappingRepository = $this->createMock(ImportMappingRepository::class);
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
            $this->entityManager,
        );
    }

    public function testImportContactsHandlesZombieContact(): void
    {
        $user = new User();
        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->tokenStorageRepository->method('findOneBy')->willReturn($tokenStorage);

        // Mock Google API Responses
        $responseGroups = $this->createMock(ResponseInterface::class);
        $responseGroups->method('toArray')->willReturn(['contactGroups' => []]);

        $responseContacts = $this->createMock(ResponseInterface::class);
        $responseContacts->method('toArray')->willReturn([
            'connections' => [
                [
                    'resourceName' => 'people/zombie',
                    'names' => [['givenName' => 'John']],
                ],
            ],
        ]);

        $this->httpClient->method('request')->willReturnOnConsecutiveCalls($responseGroups, $responseContacts);

        // Setup Zombie Mapping
        $mapping = $this->createMock(ImportMapping::class);
        $contact = $this->createMock(Contact::class);

        $mapping->method('getContact')->willReturn($contact);

        // This is what triggers the Zombie error
        $contact->method('getUuid')->willThrowException(new \Doctrine\ORM\EntityNotFoundException());

        $this->importMappingRepository->method('findOneBy')->willReturn($mapping);

        // Expectation: contactImportService->import (NEW) is called instead of update because original was zombie
        $this->contactImportService->expects($this->once())
            ->method('import')
            ->willReturn(new Contact());

        $this->service->importContacts($user);
    }

    public function testImportContactsCreatesGoogleGroup(): void
    {
        $user = new User();
        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->tokenStorageRepository->method('findOneBy')->willReturn($tokenStorage);

        $responseGroups = $this->createMock(ResponseInterface::class);
        $responseGroups->method('toArray')->willReturn(['contactGroups' => []]);

        $responseContacts = $this->createMock(ResponseInterface::class);
        $responseContacts->method('toArray')->willReturn([
            'connections' => [
                [
                    'resourceName' => 'people/123',
                    'names' => [['givenName' => 'John']],
                ],
            ],
        ]);

        $this->httpClient->method('request')->willReturnOnConsecutiveCalls($responseGroups, $responseContacts);

        $groupRepository = $this->createMock(\Doctrine\ORM\EntityRepository::class);
        $this->entityManager->method('getRepository')->willReturn($groupRepository);
        $groupRepository->method('findOneBy')->willReturn(null); // google group doesn't exist

        // Expectation: EntityManager->persist(googleGroup)
        $this->entityManager->expects($this->atLeastOnce())
            ->method('persist')
            ->with(self::callback(function ($obj) {
                return $obj instanceof \App\Entity\Group && 'google' === $obj->getName();
            }));

        $this->service->importContacts($user, true);
    }
}
