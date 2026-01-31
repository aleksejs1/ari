<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Contact;
use Ari\Entity\ContactInteraction;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class ContactInteractionTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $contact = new Contact();
        $interaction = new ContactInteraction($contact);

        $timestamp = new \DateTimeImmutable('2023-01-01 12:00:00');

        $interaction->setType('call');
        $interaction->setDescription('Meeting notes');
        $interaction->setTimestamp($timestamp);

        self::assertSame('call', $interaction->getType());
        self::assertSame('Meeting notes', $interaction->getDescription());
        self::assertSame($timestamp, $interaction->getTimestamp());
        self::assertNull($interaction->getId());
    }

    public function testContactAssociation(): void
    {
        $contact = new Contact();
        $interaction = new ContactInteraction($contact);

        self::assertSame($contact, $interaction->getContact());

        $newContact = new Contact();
        $interaction->setContact($newContact);
        self::assertSame($newContact, $interaction->getContact());
    }

    public function testGetTenant(): void
    {
        $contact = new Contact();
        $user = new User();
        $contact->setUser($user);

        $interaction = new ContactInteraction($contact);

        self::assertSame($user, $interaction->getTenant());
    }
}
