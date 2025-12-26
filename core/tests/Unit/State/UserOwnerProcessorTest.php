<?php

namespace App\Tests\Unit\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Security\TenantAwareInterface;
use App\State\UserOwnerProcessor;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

final class UserOwnerProcessorTest extends TestCase
{
    /** @var ProcessorInterface<mixed, mixed>&\PHPUnit\Framework\MockObject\MockObject */
    private ProcessorInterface $persistProcessor;

    /** @var ProcessorInterface<mixed, mixed>&\PHPUnit\Framework\MockObject\MockObject */
    private ProcessorInterface $removeProcessor;

    /** @var TokenStorageInterface&\PHPUnit\Framework\MockObject\MockObject */
    private TokenStorageInterface $tokenStorage;

    private UserOwnerProcessor $processor;

    #[\Override]
    protected function setUp(): void
    {
        $this->persistProcessor = self::createMock(ProcessorInterface::class);
        $this->removeProcessor = self::createMock(ProcessorInterface::class);
        $this->tokenStorage = self::createMock(TokenStorageInterface::class);
        $this->processor = new UserOwnerProcessor($this->persistProcessor, $this->removeProcessor, $this->tokenStorage);
    }

    public function testProcessDoesNothingIfNotTenantAware(): void
    {
        $data = new \stdClass();
        $operation = new \ApiPlatform\Metadata\Get();

        $this->persistProcessor->expects(self::once())
            ->method('process')
            ->with($data, $operation, [], [])
            ->willReturn($data);

        $this->tokenStorage->expects(self::never())->method('getToken');

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
    }

    public function testProcessDelegatesToDeleteProcessor(): void
    {
        $data = new \stdClass();
        $operation = new \ApiPlatform\Metadata\Delete();

        $this->removeProcessor->expects(self::once())
            ->method('process')
            ->with($data, $operation, [], [])
            ->willReturn($data);

        $this->persistProcessor->expects(self::never())->method('process');

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
    }

    public function testProcessDoesNothingIfTenantAlreadySet(): void
    {
        $user = self::createStub(User::class);
        $data = self::createStub(TenantAwareInterface::class);
        $data->method('getTenant')->willReturn($user);

        $operation = new \ApiPlatform\Metadata\Get();

        $this->persistProcessor->expects(self::once())
            ->method('process')
            ->with($data, $operation, [], [])
            ->willReturn($data);

        $this->tokenStorage->expects(self::never())->method('getToken');

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
    }

    public function testProcessSetsTenantIfTenantAwareAndNoTenant(): void
    {
        $user = self::createStub(User::class);
        $token = self::createStub(TokenInterface::class);
        $token->method('getUser')->willReturn($user);

        $data = new class () implements TenantAwareInterface {
            private ?User $tenant = null;

            #[\Override]
            public function getTenant(): ?User
            {
                return $this->tenant;
            }

            public function setTenant(User $tenant): void
            {
                $this->tenant = $tenant;
            }
        };

        $operation = new \ApiPlatform\Metadata\Get();
        $this->tokenStorage->expects(self::once())->method('getToken')->willReturn($token);

        $this->persistProcessor->expects(self::once())
            ->method('process')
            ->with($data, $operation, [], [])
            ->willReturn($data);

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
        self::assertSame($user, $data->getTenant());
    }

    public function testProcessDoesNotSetTenantIfNoAuthenticatedUser(): void
    {
        $data = new class () implements TenantAwareInterface {
            private ?User $tenant = null;

            #[\Override]
            public function getTenant(): ?User
            {
                return $this->tenant;
            }

            public function setTenant(User $tenant): void
            {
                $this->tenant = $tenant;
            }
        };

        $operation = new \ApiPlatform\Metadata\Get();
        $this->tokenStorage->expects(self::once())->method('getToken')->willReturn(null);

        $this->persistProcessor->expects(self::once())
            ->method('process')
            ->with($data, $operation, [], [])
            ->willReturn($data);

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
        self::assertNull($data->getTenant());
    }
}
