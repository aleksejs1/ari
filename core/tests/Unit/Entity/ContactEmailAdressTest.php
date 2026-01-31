<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Contact;
use Ari\Entity\ContactEmailAdress;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactEmailAdressTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $email = new ContactEmailAdress();

        self::assertNull($email->getId());
        self::assertNull($email->getValue());
        self::assertNull($email->getType());

        $email->setValue('test@example.com');
        $email->setType('Work');

        self::assertSame('test@example.com', $email->getValue());
        self::assertSame('Work', $email->getType());
    }

    public function testContactAssociation(): void
    {
        $contact = new Contact();
        $email = new ContactEmailAdress();

        $email->setContact($contact);
        self::assertSame($contact, $email->getContact());
    }

    public function testTenantInheritance(): void
    {
        $user = new User();
        $contact = new Contact();
        $contact->setUser($user);

        // Test constructor inheritance
        $email = new ContactEmailAdress($contact);
        self::assertSame($user, $email->getTenant(), 'Tenant should be inherited from contact in constructor');

        // Test setter inheritance when added via Contact (simulated here, but logic is in
        // Contact::addContactEmailAdress or Processor)
        // Since ContactEmailAdress doesn't have logic in setContact to auto-set tenant, we rely on the
        // constructor or external setters.
        // Let's verify the constructor works as expected.
    }
}
