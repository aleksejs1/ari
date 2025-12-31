<?php

namespace App\Tests\Unit\Entity;

use App\Entity\Contact;
use App\Entity\ContactGroup;
use App\Entity\Group;
use PHPUnit\Framework\TestCase;

class ContactGroupTest extends TestCase
{
    public function testContactAssociation(): void
    {
        $contact = new Contact();
        $contactGroup = new ContactGroup($contact);

        self::assertSame($contact, $contactGroup->getContact());
        self::assertSame($contact->getTenant(), $contactGroup->getTenant());

        $newContact = new Contact();
        $contactGroup->setContact($newContact);
        self::assertSame($newContact, $contactGroup->getContact());
    }

    public function testGroupResourceAssociation(): void
    {
        $contactGroup = new ContactGroup();
        $group = new Group();

        $contactGroup->setGroupResource($group);
        self::assertSame($group, $contactGroup->getGroupResource());
    }
}
