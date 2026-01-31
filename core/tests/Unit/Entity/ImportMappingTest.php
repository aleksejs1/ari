<?php

namespace Ari\Tests\Unit\Entity;

use Ari\Entity\Contact;
use Ari\Entity\ImportMapping;
use Ari\Entity\User;
use PHPUnit\Framework\TestCase;

class ImportMappingTest extends TestCase
{
    public function testGettersAndSetters(): void
    {
        $mapping = new ImportMapping();
        $user = new User();
        $contact = new Contact();
        $type = 'google';
        $externalId = 'people/c123';

        $mapping->setUser($user);
        $mapping->setContact($contact);
        $mapping->setType($type);
        $mapping->setExternalId($externalId);

        self::assertSame($user, $mapping->getUser());
        self::assertSame($contact, $mapping->getContact());
        self::assertSame($type, $mapping->getType());
        self::assertSame($externalId, $mapping->getExternalId());
    }
}
