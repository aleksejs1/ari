<?php

namespace App\Tests\Unit\Doctrine;

use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Doctrine\CurrentUserExtension;
use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\ContactName;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;

class CurrentUserExtensionTest extends TestCase
{
    /** @var Security&\PHPUnit\Framework\MockObject\Stub */
    private Security $security;
    private CurrentUserExtension $extension;

    #[\Override]
    protected function setUp(): void
    {
        $this->security = self::createStub(Security::class);
        $this->extension = new CurrentUserExtension($this->security);
    }

    public function testApplyToCollectionDoesNothingForUnsupportedResource(): void
    {
        $queryBuilder = self::createMock(QueryBuilder::class);
        $queryNameGenerator = self::createStub(QueryNameGeneratorInterface::class);

        $queryBuilder->expects(self::never())->method('getRootAliases');

        $this->extension->applyToCollection($queryBuilder, $queryNameGenerator, \stdClass::class);
    }

    public function testApplyToCollectionDoesNothingIfNoUser(): void
    {
        $queryBuilder = self::createMock(QueryBuilder::class);
        $queryNameGenerator = self::createStub(QueryNameGeneratorInterface::class);

        $this->security->method('getUser')->willReturn(null);
        $queryBuilder->expects(self::never())->method('getRootAliases');

        $this->extension->applyToCollection($queryBuilder, $queryNameGenerator, Contact::class);
    }

    public function testApplyToCollectionFiltersContact(): void
    {
        $queryBuilder = self::createMock(QueryBuilder::class);
        $queryNameGenerator = self::createStub(QueryNameGeneratorInterface::class);
        $user = self::createStub(User::class);

        $this->security->method('getUser')->willReturn($user);
        $queryBuilder->method('getRootAliases')->willReturn(['o']);

        $queryBuilder->expects(self::once())
            ->method('andWhere')
            ->with('o.user = :current_user')
            ->willReturn($queryBuilder);

        $queryBuilder->expects(self::once())
            ->method('setParameter')
            ->with('current_user', $user)
            ->willReturn($queryBuilder);

        $this->extension->applyToCollection($queryBuilder, $queryNameGenerator, Contact::class);
    }

    public function testApplyToCollectionFiltersContactName(): void
    {
        $queryBuilder = self::createMock(QueryBuilder::class);
        $queryNameGenerator = self::createStub(QueryNameGeneratorInterface::class);
        $user = self::createStub(User::class);

        $this->security->method('getUser')->willReturn($user);
        $queryBuilder->method('getRootAliases')->willReturn(['o']);

        $queryBuilder->expects(self::once())
            ->method('join')
            ->with('o.contact', 'c')
            ->willReturn($queryBuilder);

        $queryBuilder->expects(self::once())
            ->method('andWhere')
            ->with('c.user = :current_user')
            ->willReturn($queryBuilder);

        $queryBuilder->expects(self::once())
            ->method('setParameter')
            ->with('current_user', $user)
            ->willReturn($queryBuilder);

        $this->extension->applyToCollection($queryBuilder, $queryNameGenerator, ContactName::class);
    }

    public function testApplyToCollectionFiltersContactDate(): void
    {
        $queryBuilder = self::createMock(QueryBuilder::class);
        $queryNameGenerator = self::createStub(QueryNameGeneratorInterface::class);
        $user = self::createStub(User::class);

        $this->security->method('getUser')->willReturn($user);
        $queryBuilder->method('getRootAliases')->willReturn(['o']);

        $queryBuilder->expects(self::once())
            ->method('join')
            ->with('o.contact', 'c')
            ->willReturn($queryBuilder);

        $queryBuilder->expects(self::once())
            ->method('andWhere')
            ->with('c.user = :current_user')
            ->willReturn($queryBuilder);

        $queryBuilder->expects(self::once())
            ->method('setParameter')
            ->with('current_user', $user)
            ->willReturn($queryBuilder);

        $this->extension->applyToCollection($queryBuilder, $queryNameGenerator, ContactDate::class);
    }
}
