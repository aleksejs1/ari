<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Contact;
use Ari\Entity\ContactOrganization;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactOrganizationTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $contact = new Contact();
        $org = new ContactOrganization($contact);

        $org->setName('Acme Corp')
            ->setDepartment('Engineering')
            ->setTitle('Senior Developer')
            ->setStartDate(new \DateTime('2023-01-01'))
            ->setEndDate(new \DateTime('2023-12-31'))
            ->setJobDescription('Writes code')
            ->setType('Full-time');

        self::assertSame('Acme Corp', $org->getName());
        self::assertSame('Engineering', $org->getDepartment());
        self::assertSame('Senior Developer', $org->getTitle());
        self::assertEquals(new \DateTime('2023-01-01'), $org->getStartDate());
        self::assertEquals(new \DateTime('2023-12-31'), $org->getEndDate());
        self::assertSame('Writes code', $org->getJobDescription());
        self::assertSame('Full-time', $org->getType());
    }

    public function testContactAssociation(): void
    {
        $contact = new Contact();
        $org = new ContactOrganization($contact);

        self::assertSame($contact, $org->getContact());

        $newContact = new Contact();
        $org->setContact($newContact);
        self::assertSame($newContact, $org->getContact());
    }

    public function testGetTenant(): void
    {
        $contact = new Contact();
        $user = new User();
        $contact->setUser($user);

        $org = new ContactOrganization($contact);

        self::assertSame($user, $org->getTenant());
    }
}
