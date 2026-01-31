<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Contact;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactPhoneNumberTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $contact = new Contact();
        $phoneNumber = new ContactPhoneNumber($contact);

        $phoneNumber->setValue('+1234567890');
        $phoneNumber->setType('Mobile');

        self::assertSame('+1234567890', $phoneNumber->getValue());
        self::assertSame('Mobile', $phoneNumber->getType());
    }

    public function testContactAssociation(): void
    {
        $contact = new Contact();
        $phoneNumber = new ContactPhoneNumber($contact);

        self::assertSame($contact, $phoneNumber->getContact());

        $newContact = new Contact();
        $phoneNumber->setContact($newContact);
        self::assertSame($newContact, $phoneNumber->getContact());
    }

    public function testGetTenant(): void
    {
        $contact = new Contact();
        $user = new User();
        $contact->setUser($user);

        $phoneNumber = new ContactPhoneNumber($contact);

        self::assertSame($user, $phoneNumber->getTenant());
    }
}
