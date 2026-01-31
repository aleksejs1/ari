<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Contact;
use Ari\Entity\ContactAddress;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactAddressTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $address = new ContactAddress();

        self::assertNull($address->getId());
        self::assertNull($address->getType());
        self::assertNull($address->getStreet());
        self::assertNull($address->getCity());
        self::assertNull($address->getCountry());

        $address->setType('Home');
        $address->setStreet('123 Main St');
        $address->setCity('New York');
        $address->setCountry('USA');

        self::assertSame('Home', $address->getType());
        self::assertSame('123 Main St', $address->getStreet());
        self::assertSame('New York', $address->getCity());
        self::assertSame('USA', $address->getCountry());
    }

    public function testContactAssociation(): void
    {
        $contact = new Contact();
        $address = new ContactAddress();

        $address->setContact($contact);
        self::assertSame($contact, $address->getContact());
    }

    public function testTenantInheritance(): void
    {
        $user = new User();
        $contact = new Contact();
        $contact->setUser($user);

        // Test constructor inheritance
        $address = new ContactAddress($contact);
        self::assertSame($user, $address->getTenant(), 'Tenant should be inherited from contact in constructor');

        // Test setter inheritance when added via Contact (simulated here, but logic is in
        // Contact::addContactAddress or Processor)
        // Since ContactAddress doesn't have logic in setContact to auto-set tenant, we rely on the
        // constructor or external setters.
    }
}
