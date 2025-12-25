<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\ContactName;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactTest extends TestCase
{
    public function testUserAssociation(): void
    {
        $contact = new Contact();
        $user = new User();

        $contact->setUser($user);
        self::assertSame($user, $contact->getUser());
        self::assertSame($user, $contact->getOwner());
    }

    public function testContactNamesAssociation(): void
    {
        $contact = new Contact();
        $contactName = new ContactName($contact);

        $contact->addContactName($contactName);
        self::assertTrue($contact->getContactNames()->contains($contactName));
        self::assertSame($contact, $contactName->getContact());

        $contact->removeContactName($contactName);
        self::assertFalse($contact->getContactNames()->contains($contactName));
        self::assertNull($contactName->getContact());
    }

    public function testContactDatesAssociation(): void
    {
        $contact = new Contact();
        $contactDate = new ContactDate($contact);

        $contact->addContactDate($contactDate);
        self::assertTrue($contact->getContactDates()->contains($contactDate));
        self::assertSame($contact, $contactDate->getContact());

        $contact->removeContactDate($contactDate);
        self::assertFalse($contact->getContactDates()->contains($contactDate));
        self::assertNull($contactDate->getContact());
    }
}
