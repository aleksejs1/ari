<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Contact;
use Ari\Entity\ContactRelation;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactRelationTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $relation = new ContactRelation();

        $contact = new Contact();
        $person = new Contact();
        $type = 'Father';

        $relation->setContact($contact);
        $relation->setPerson($person);
        $relation->setType($type);

        self::assertSame($contact, $relation->getContact());
        self::assertSame($person, $relation->getPerson());
        self::assertSame($type, $relation->getType());
        self::assertNull($relation->getId()); // ID is null until persisted
    }

    public function testTenantPropagationInConstructor(): void
    {
        $user = new User();
        $contact = new Contact();
        $contact->setTenant($user);

        $relation = new ContactRelation($contact);

        self::assertSame($contact, $relation->getContact());
        self::assertSame($user, $relation->getTenant());
    }
}
