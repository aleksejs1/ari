<?php

namespace App\Tests\Unit\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Security\OwnershipAwareInterface;
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

    public function testProcessDoesNothingIfNotOwnershipAware(): void
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

    public function testProcessDoesNothingIfOwnerAlreadySet(): void
    {
        $user = self::createStub(User::class);
        $data = self::createStub(OwnershipAwareInterface::class);
        $data->method('getOwner')->willReturn($user);

        $operation = self::createStub(Operation::class);

        $this->persistProcessor->expects(self::once())
            ->method('process')
            ->with($data, $operation, [], [])
            ->willReturn($data);

        $this->security->expects(self::never())->method('getUser');

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
    }

    public function testProcessSetsUserIfOwnershipAwareAndNoOwner(): void
    {
        $user = self::createStub(User::class);
        $data = new class () implements OwnershipAwareInterface {
            private ?User $user = null;

            #[\Override]
            public function getOwner(): ?User
            {
                return $this->user;
            }

            public function setUser(User $user): void
            {
                $this->user = $user;
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
        self::assertSame($user, $data->getOwner());
    }

    public function testProcessDoesNotSetUserIfNoAuthenticatedUser(): void
    {
        $data = new class () implements OwnershipAwareInterface {
            private ?User $user = null;

            #[\Override]
            public function getOwner(): ?User
            {
                return $this->user;
            }

            public function setUser(User $user): void
            {
                $this->user = $user;
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
        self::assertNull($data->getOwner());
    }
}
