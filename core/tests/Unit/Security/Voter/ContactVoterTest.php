<?php

namespace App\Tests\Unit\Security\Voter;

use App\Entity\User;
use App\Security\TenantAwareInterface;
use App\Security\Voter\ContactVoter;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ContactVoterTest extends TestCase
{
    private ContactVoter $voter;

    #[\Override]
    protected function setUp(): void
    {
        $this->voter = new ContactVoter();
    }

    #[DataProvider('provideAttributes')]
    public function testSupports(string $attribute, bool $expected): void
    {
        $subject = self::createStub(TenantAwareInterface::class);
        $method = new \ReflectionMethod(ContactVoter::class, 'supports');

        self::assertSame($expected, $method->invoke($this->voter, $attribute, $subject));
    }

    /**
     * @return array<int, array{0: string, 1: bool}>
     */
    public static function provideAttributes(): array
    {
        return [
            [ContactVoter::VIEW, true],
            [ContactVoter::EDIT, true],
            [ContactVoter::ADD, true],
            ['OTHER', false],
        ];
    }

    public function testSupportsOnlyTenantAwareInterface(): void
    {
        $subject = new \stdClass();
        $method = new \ReflectionMethod(ContactVoter::class, 'supports');

        self::assertFalse($method->invoke($this->voter, ContactVoter::VIEW, $subject));
    }

    public function testVoteAccessGrantedForTenantOnView(): void
    {
        $user = self::createStub(User::class);
        $subject = self::createStub(TenantAwareInterface::class);
        $subject->method('getTenant')->willReturn($user);

        $token = self::createStub(TokenInterface::class);
        $token->method('getUser')->willReturn($user);

        self::assertSame(
            Voter::ACCESS_GRANTED,
            $this->voter->vote($token, $subject, [ContactVoter::VIEW])
        );
    }

    public function testVoteAccessDeniedForNonTenantOnView(): void
    {
        $user = self::createStub(User::class);
        $tenant = self::createStub(User::class);
        $subject = self::createStub(TenantAwareInterface::class);
        $subject->method('getTenant')->willReturn($tenant);

        $token = self::createStub(TokenInterface::class);
        $token->method('getUser')->willReturn($user);

        self::assertSame(
            Voter::ACCESS_DENIED,
            $this->voter->vote($token, $subject, [ContactVoter::VIEW])
        );
    }

    public function testVoteAccessGrantedForTenantOnEdit(): void
    {
        $user = self::createStub(User::class);
        $subject = self::createStub(TenantAwareInterface::class);
        $subject->method('getTenant')->willReturn($user);

        $token = self::createStub(TokenInterface::class);
        $token->method('getUser')->willReturn($user);

        self::assertSame(
            Voter::ACCESS_GRANTED,
            $this->voter->vote($token, $subject, [ContactVoter::EDIT])
        );
    }

    public function testVoteAccessDeniedForNonTenantOnEdit(): void
    {
        $user = self::createStub(User::class);
        $tenant = self::createStub(User::class);
        $subject = self::createStub(TenantAwareInterface::class);
        $subject->method('getTenant')->willReturn($tenant);

        $token = self::createStub(TokenInterface::class);
        $token->method('getUser')->willReturn($user);

        self::assertSame(
            Voter::ACCESS_DENIED,
            $this->voter->vote($token, $subject, [ContactVoter::EDIT])
        );
    }

    public function testVoteAccessGrantedForAdd(): void
    {
        $user = self::createStub(User::class);
        $subject = self::createStub(TenantAwareInterface::class);

        $token = self::createStub(TokenInterface::class);
        $token->method('getUser')->willReturn($user);

        self::assertSame(
            Voter::ACCESS_GRANTED,
            $this->voter->vote($token, $subject, [ContactVoter::ADD])
        );
    }

    public function testVoteAccessDeniedForNoUser(): void
    {
        $subject = self::createStub(TenantAwareInterface::class);
        $token = self::createStub(TokenInterface::class);
        $token->method('getUser')->willReturn(null);

        self::assertSame(
            Voter::ACCESS_DENIED,
            $this->voter->vote($token, $subject, [ContactVoter::VIEW])
        );
    }
}
