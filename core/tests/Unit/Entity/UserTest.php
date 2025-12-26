<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Contact;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function testGetterAndSetter(): void
    {
        $user = new User();
        $user->setUuid('test-uuid');
        $user->setPassword('password');

        self::assertSame('test-uuid', $user->getUuid());
        self::assertSame('test-uuid', $user->getUserIdentifier());
        self::assertSame('password', $user->getPassword());
    }

    public function testRoles(): void
    {
        $user = new User();
        self::assertSame(['ROLE_USER'], $user->getRoles());

        $user->setRoles(['ROLE_ADMIN']);
        self::assertSame(['ROLE_ADMIN', 'ROLE_USER'], $user->getRoles());
    }

    public function testContacts(): void
    {
        $user = new User();
        $contact = new Contact();

        $user->addContact($contact);
        self::assertTrue($user->getContacts()->contains($contact));
        self::assertSame($user, $contact->getUser());

        $user->removeContact($contact);
        self::assertFalse($user->getContacts()->contains($contact));
        self::assertNull($contact->getTenant());
    }
}
