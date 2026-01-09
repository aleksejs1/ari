<?php

namespace App\Tests\Unit\Service\Google;

use App\Entity\Group;
use App\Entity\ImportMapping;
use App\Entity\TokenStorage;
use App\Entity\User;
use App\Repository\ImportMappingRepository;
use App\Repository\TokenStorageRepository;
use App\Service\ContactImport\ContactImportService;
use App\Service\Google\GoogleContactsService;
use App\Service\Google\GoogleOAuthService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

#[ \PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations]
class GoogleContactsGroupImportTest extends TestCase
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
            $this->entityManager
        );
    }

    public function testGroupImportReusesExistingGroupByName(): void
    {
        $user = new User();
        $tokenStorage = new TokenStorage();
        $tokenStorage->setAccessToken('token');
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->tokenStorageRepository->method('findOneBy')->willReturn($tokenStorage);

        $responseGroups = $this->createMock(ResponseInterface::class);
        $responseGroups->method('toArray')->willReturn([
            'contactGroups' => [
                [
                    'resourceName' => 'contactGroups/123',
                    'formattedName' => 'Existing Group',
                ],
            ],
        ]);

        $responseContacts = $this->createMock(ResponseInterface::class);
        $responseContacts->method('toArray')->willReturn(['connections' => []]);

        $this->httpClient->method('request')->willReturnOnConsecutiveCalls($responseGroups, $responseContacts);

        // No mapping exists yet
        $this->importMappingRepository->method('findOneBy')->willReturn(null);

        // But a group with the same name EXISTS in the database
        $existingGroup = new Group();
        $existingGroup->setName('Existing Group');
        $existingGroup->setUser($user);

        $groupRepository = $this->createMock(EntityRepository::class);
        $this->entityManager->method('getRepository')->willReturnMap([
            [Group::class, $groupRepository],
        ]);

        $groupRepository->method('findOneBy')
            ->with(['user' => $user, 'name' => 'Existing Group'])
            ->willReturn($existingGroup);

        // Expectation: A new ImportMapping is created linking to $existingGroup
        // AND NO new Group is persisted
        $this->entityManager->expects($this->once())
            ->method('persist')
            ->with(self::callback(function ($obj) use ($existingGroup) {
                return $obj instanceof ImportMapping && $obj->getGroup() === $existingGroup;
            }));

        $this->service->importContacts($user);
    }
}
