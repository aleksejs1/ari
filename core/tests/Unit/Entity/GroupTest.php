<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Group;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class GroupTest extends TestCase
{
    public function testUserAssociation(): void
    {
        $group = new Group();
        $user = new User();

        $group->setUser($user);
        self::assertSame($user, $group->getUser());
        self::assertSame($user, $group->getTenant());
    }

    public function testNameAccessors(): void
    {
        $group = new Group();
        $name = 'Test Group';

        $group->setName($name);
        self::assertSame($name, $group->getName());
    }
}
