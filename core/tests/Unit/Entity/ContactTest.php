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
        self::assertSame($user, $contact->getTenant());
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

    public function testContactPhoneNumbersAssociation(): void
    {
        $contact = new Contact();
        $phoneNumber = new \App\Entity\ContactPhoneNumber($contact);

        $contact->addPhoneNumber($phoneNumber);
        self::assertTrue($contact->getPhoneNumbers()->contains($phoneNumber));
        self::assertSame($contact, $phoneNumber->getContact());

        $contact->removePhoneNumber($phoneNumber);
        self::assertFalse($contact->getPhoneNumbers()->contains($phoneNumber));
        self::assertNull($phoneNumber->getContact());
    }

    public function testContactEmailAdressesAssociation(): void
    {
        $contact = new Contact();
        $email = new \App\Entity\ContactEmailAdress($contact);

        $contact->addContactEmailAdress($email);
        self::assertTrue($contact->getContactEmailAdresses()->contains($email));
        self::assertSame($contact, $email->getContact());

        $contact->removeContactEmailAdress($email);
        self::assertFalse($contact->getContactEmailAdresses()->contains($email));
        self::assertNull($email->getContact());
    }

    public function testContactAddressAssociation(): void
    {
        $contact = new Contact();
        $address = new \App\Entity\ContactAddress($contact);

        $contact->addContactAddress($address);
        self::assertTrue($contact->getContactAddresses()->contains($address));
        self::assertSame($contact, $address->getContact());

        $contact->removeContactAddress($address);
        self::assertFalse($contact->getContactAddresses()->contains($address));
        self::assertNull($address->getContact());
    }

    public function testContactGroupsAssociation(): void
    {
        $contact = new Contact();
        $contactGroup = new \App\Entity\ContactGroup($contact);

        $contact->addContactGroup($contactGroup);
        self::assertTrue($contact->getContactGroups()->contains($contactGroup));
        self::assertSame($contact, $contactGroup->getContact());

        $contact->removeContactGroup($contactGroup);
        self::assertFalse($contact->getContactGroups()->contains($contactGroup));
        self::assertNull($contactGroup->getContact());
    }
}
