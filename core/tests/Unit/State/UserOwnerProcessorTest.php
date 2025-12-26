<?php

namespace App\Tests\Unit\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Security\TenantAwareInterface;
use App\State\UserOwnerProcessor;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;

class UserOwnerProcessorTest extends TestCase
{
    /** @var ProcessorInterface<mixed, mixed>&\PHPUnit\Framework\MockObject\MockObject */
    private ProcessorInterface $persistProcessor;

    /** @var Security&\PHPUnit\Framework\MockObject\MockObject */
    private Security $security;

    private UserOwnerProcessor $processor;

    #[\Override]
    protected function setUp(): void
    {
        $this->persistProcessor = self::createMock(ProcessorInterface::class);
        $this->security = self::createMock(Security::class);
        $this->processor = new UserOwnerProcessor($this->persistProcessor, $this->security);
    }

    public function testProcessDoesNothingIfNotTenantAware(): void
    {
        $data = new \stdClass();
        $operation = self::createStub(Operation::class);

        $this->persistProcessor->expects(self::once())
            ->method('process')
            ->with($data, $operation, [], [])
            ->willReturn($data);

        $this->security->expects(self::never())->method('getUser');

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
    }

    public function testProcessDoesNothingIfTenantAlreadySet(): void
    {
        $user = self::createStub(User::class);
        $data = self::createStub(TenantAwareInterface::class);
        $data->method('getTenant')->willReturn($user);

        $operation = self::createStub(Operation::class);

        $this->persistProcessor->expects(self::once())
            ->method('process')
            ->with($data, $operation, [], [])
            ->willReturn($data);

        $this->security->expects(self::never())->method('getUser');

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
    }

    public function testProcessSetsTenantIfTenantAwareAndNoTenant(): void
    {
        $user = self::createStub(User::class);
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

        $operation = self::createStub(Operation::class);
        $this->security->expects(self::once())->method('getUser')->willReturn($user);

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

        $operation = self::createStub(Operation::class);
        $this->security->expects(self::once())->method('getUser')->willReturn(null);

        $this->persistProcessor->expects(self::once())
            ->method('process')
            ->with($data, $operation, [], [])
            ->willReturn($data);

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
        self::assertNull($data->getTenant());
    }
}
