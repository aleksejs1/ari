<?php

namespace App\Tests\Unit\Service\Google;

use App\Entity\User;
use App\Repository\TokenStorageRepository;
use App\Service\Google\GoogleConnectService;
use App\Service\Google\GoogleOAuthService;
use Doctrine\ORM\Configuration;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Filter\SQLFilter;
use Doctrine\ORM\Query\FilterCollection;
use PHPUnit\Framework\TestCase;

class GoogleConnectServiceTest extends TestCase
{
    /** @var GoogleOAuthService&\PHPUnit\Framework\MockObject\Stub */
    private GoogleOAuthService $oauthService;
    /** @var TokenStorageRepository&\PHPUnit\Framework\MockObject\Stub */
    private TokenStorageRepository $tokenStorageRepository;
    /** @var EntityManagerInterface&\PHPUnit\Framework\MockObject\Stub */
    private EntityManagerInterface $entityManager;
    private string $appSecret = 'test_secret';
    private GoogleConnectService $service;

    #[\Override]
    protected function setUp(): void
    {
        // Use createStub to avoid "PHPUnit Notice" about internal deprecations in createMock
        $this->oauthService = self::createStub(GoogleOAuthService::class);
        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->entityManager = self::createStub(EntityManagerInterface::class);

        $this->service = new GoogleConnectService(
            $this->oauthService,
            $this->tokenStorageRepository,
            $this->entityManager,
            $this->appSecret,
        );
    }

    public function testGenerateState(): void
    {
        $user = self::createStub(User::class);
        $user->method('getUuid')->willReturn('550e8400-e29b-41d4-a716-446655440000');

        $state = $this->service->generateState($user);

        self::assertStringStartsWith('550e8400-e29b-41d4-a716-446655440000.', $state);

        $parts = explode('.', $state);
        self::assertCount(2, $parts);

        $expectedSignature = hash_hmac('sha256', '550e8400-e29b-41d4-a716-446655440000', $this->appSecret);
        self::assertEquals($expectedSignature, $parts[1]);
    }

    public function testValidateStateSuccess(): void
    {
        $uuid = '550e8400-e29b-41d4-a716-446655440000';
        $signature = hash_hmac('sha256', $uuid, $this->appSecret);
        $state = $uuid . '.' . $signature;

        $validatedUuid = $this->service->validateState($state);

        self::assertEquals($uuid, $validatedUuid);
    }

    public function testValidateStateInvalidFormat(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid state format');

        $this->service->validateState('invalid-state');
    }

    public function testValidateStateInvalidSignature(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid state signature');

        $this->service->validateState('uuid.invalid-sig');
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function testConnectUser(): void
    {
        // Re-create as STUBS
        $this->oauthService = self::createStub(GoogleOAuthService::class);
        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->entityManager = self::createStub(EntityManagerInterface::class);

        $this->service = new GoogleConnectService(
            $this->oauthService,
            $this->tokenStorageRepository,
            $this->entityManager,
            $this->appSecret,
        );

        $code = 'auth_code';
        $uuid = '550e8400-e29b-41d4-a716-446655440000';
        $user = self::createStub(User::class);
        $user->method('getId')->willReturn(123);

        $userRepo = self::createStub(EntityRepository::class);
        $userRepo->method('findOneBy')->willReturn($user);

        $this->entityManager->method('getRepository')->with(User::class)->willReturn($userRepo);

        $config = self::createStub(Configuration::class);
        $this->entityManager->method('getConfiguration')->willReturn($config);
        $config->method('getFilterClassName')->with('tenant')->willReturn(TestSQLFilter::class);

        $filters = new FilterCollection($this->entityManager);
        $this->entityManager->method('getFilters')->willReturn($filters);

        // Spy Calls
        $oauthCalls = [];
        $this->oauthService->method('getAccessToken')->willReturnCallback(function () use (&$oauthCalls) {
            $oauthCalls[] = true;

            return [
                'access_token' => 'at',
                'refresh_token' => 'rt',
                'expires_in' => 3600,
            ];
        });

        $this->tokenStorageRepository->method('findOneBy')->willReturn(null);

        $persisted = [];
        $this->entityManager->method('persist')->willReturnCallback(function ($obj) use (&$persisted) {
            $persisted[] = $obj;
        });

        // flush ignored

        $this->service->connectUser($code, $uuid);

        self::assertTrue($filters->isEnabled('tenant'));
        $filter = $filters->getFilter('tenant');
        self::assertTrue($filter->hasParameter('currentTenant'));

        self::assertNotEmpty($oauthCalls);
        self::assertNotEmpty($persisted);
    }

    public function testConnectUserNotFound(): void
    {
        $userRepo = self::createStub(EntityRepository::class);
        $userRepo->method('findOneBy')->willReturn(null);
        $this->entityManager->method('getRepository')->willReturn($userRepo);

        $this->expectException(\InvalidArgumentException::class);
        $this->service->connectUser('code', 'non-existent-uuid');
    }
}

class TestSQLFilter extends SQLFilter
{
    #[\Override]
    public function addFilterConstraint(\Doctrine\ORM\Mapping\ClassMetadata $targetEntity, string $targetTableAlias): string
    {
        return '';
    }
}
