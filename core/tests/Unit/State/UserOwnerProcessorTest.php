<?php

namespace App\Tests\Unit\State;

use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Security\TenantAwareInterface;
use App\State\UserOwnerProcessor;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

#[AllowMockObjectsWithoutExpectations]
final class UserOwnerProcessorTest extends TestCase
{
    /** @var ProcessorInterface<mixed, mixed>&\PHPUnit\Framework\MockObject\Stub */
    private ProcessorInterface $persistProcessor;
    /** @var ProcessorInterface<mixed, mixed>&\PHPUnit\Framework\MockObject\Stub */
    private ProcessorInterface $removeProcessor;
    /** @var TokenStorageInterface&\PHPUnit\Framework\MockObject\Stub */
    private TokenStorageInterface $tokenStorage;
    private UserOwnerProcessor $processor;

    #[\Override]
    protected function setUp(): void
    {
        // Using createStub instead of createMock
        $this->persistProcessor = self::createStub(ProcessorInterface::class);
        $this->removeProcessor = self::createStub(ProcessorInterface::class);
        $this->tokenStorage = self::createStub(TokenStorageInterface::class);

        $this->processor = new UserOwnerProcessor($this->persistProcessor, $this->removeProcessor, $this->tokenStorage);
    }

    public function testProcessDoesNothingIfNotTenantAware(): void
    {
        $data = new \stdClass();
        $operation = new \ApiPlatform\Metadata\Get();

        // Spy logic
        $calls = [];
        $this->persistProcessor->method('process')->willReturnCallback(function ($d) use (&$calls, $data) {
            $calls[] = $d;

            return $data;
        });

        $this->tokenStorage->method('getToken')->willReturnCallback(function () {
            throw new \Exception('Should not be called');
        });

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
        self::assertCount(1, $calls);
    }

    public function testProcessDelegatesToDeleteProcessor(): void
    {
        $data = new \stdClass();
        $operation = new \ApiPlatform\Metadata\Delete();

        $calls = [];
        $this->removeProcessor->method('process')->willReturnCallback(function ($d) use (&$calls, $data) {
            $calls[] = $d;

            return $data;
        });

        $this->persistProcessor->method('process')->willReturnCallback(function () {
            throw new \Exception('Should not be called');
        });

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
        self::assertCount(1, $calls);
    }

    public function testProcessDoesNothingIfTenantAlreadySet(): void
    {
        $user = self::createStub(User::class);
        $data = self::createStub(TenantAwareInterface::class);
        $data->method('getTenant')->willReturn($user);

        $operation = new \ApiPlatform\Metadata\Get();

        $calls = [];
        $this->persistProcessor->method('process')->willReturnCallback(function ($d) use (&$calls, $data) {
            $calls[] = $d;

            return $data;
        });

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
        // Should not access token
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

            #[\Override]
            public function setTenant(?User $tenant): static
            {
                $this->tenant = $tenant;

                return $this;
            }
        };

        $operation = new \ApiPlatform\Metadata\Get();
        $this->tokenStorage->method('getToken')->willReturn($token);

        $calls = [];
        $this->persistProcessor->method('process')->willReturnCallback(function ($d) use (&$calls, $data) {
            $calls[] = $d;

            return $data;
        });

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
        self::assertSame($user, $data->getTenant());
        self::assertCount(1, $calls);
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

            #[\Override]
            public function setTenant(?User $tenant): static
            {
                $this->tenant = $tenant;

                return $this;
            }
        };

        $operation = new \ApiPlatform\Metadata\Get();
        $this->tokenStorage->method('getToken')->willReturn(null);

        $calls = [];
        $this->persistProcessor->method('process')->willReturnCallback(function ($d) use (&$calls, $data) {
            $calls[] = $d;

            return $data;
        });

        $result = $this->processor->process($data, $operation);
        self::assertSame($data, $result);
        self::assertNull($data->getTenant());
        self::assertCount(1, $calls);
    }
}
