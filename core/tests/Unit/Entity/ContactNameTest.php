<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Contact;
use App\Entity\ContactName;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactNameTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $contact = new Contact();
        $contactName = new ContactName($contact);

        $contactName->setFamily('Doe');
        $contactName->setGiven('John');

        self::assertSame('Doe', $contactName->getFamily());
        self::assertSame('John', $contactName->getGiven());
    }

    public function testContactAssociation(): void
    {
        $contact = new Contact();
        $contactName = new ContactName($contact);

        self::assertSame($contact, $contactName->getContact());

        $newContact = new Contact();
        $contactName->setContact($newContact);
        self::assertSame($newContact, $contactName->getContact());
    }

    public function testGetTenant(): void
    {
        $contact = new Contact();
        $user = new User();
        $contact->setUser($user);

        $contactName = new ContactName($contact);

        self::assertSame($user, $contactName->getTenant());
    }
}
