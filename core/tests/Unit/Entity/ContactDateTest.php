<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Contact;
use Ari\Entity\ContactDate;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactDateTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $contact = new Contact();
        $contactDate = new ContactDate($contact);
        $date = new \DateTime('2023-01-01');

        $contactDate->setDate($date);
        $contactDate->setText('Birthday');

        self::assertEquals($date, $contactDate->getDate());
        self::assertSame('Birthday', $contactDate->getText());
    }

    public function testContactAssociation(): void
    {
        $contact = new Contact();
        $contactDate = new ContactDate($contact);

        self::assertSame($contact, $contactDate->getContact());

        $newContact = new Contact();
        $contactDate->setContact($newContact);
        self::assertSame($newContact, $contactDate->getContact());
    }

    public function testGetTenant(): void
    {
        $contact = new Contact();
        $user = new User();
        $contact->setUser($user);

        $contactDate = new ContactDate($contact);

        self::assertSame($user, $contactDate->getTenant());
    }
}
