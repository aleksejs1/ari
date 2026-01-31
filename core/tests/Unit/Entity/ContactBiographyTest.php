<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Contact;
use Ari\Entity\ContactBiography;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactBiographyTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $biography = new ContactBiography();

        $biography->setType('Education');
        self::assertEquals('Education', $biography->getType());

        $biography->setValue('PhD in Physics');
        self::assertEquals('PhD in Physics', $biography->getValue());
    }

    public function testAssociationWithContact(): void
    {
        $contact = new Contact();
        $biography = new ContactBiography();

        $biography->setContact($contact);
        self::assertSame($contact, $biography->getContact());
    }

    public function testTenantIsInheritedFromContact(): void
    {
        $user = new User();
        $contact = new Contact();
        $contact->setTenant($user);

        $biography = new ContactBiography($contact);

        self::assertSame($contact, $biography->getContact());
        self::assertSame($user, $biography->getTenant());
    }
}
