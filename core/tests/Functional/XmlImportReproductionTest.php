<?php

namespace App\Tests\Functional;

use App\Entity\Contact;
use App\Entity\ContactGroup;
use App\Entity\Group;
use App\Entity\User;
use App\Entity\ContactName;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Uid\Uuid;

/**
 * @psalm-suppress InternalMethod
 */
class XmlImportReproductionTest extends AbstractApiTestCase
{
    private EntityManagerInterface $entityManager;

    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();
        $doctrine = self::getContainer()->get('doctrine');
        if (!$doctrine instanceof \Doctrine\Persistence\ManagerRegistry) {
            throw new \RuntimeException('Doctrine service not found');
        }
        $em = $doctrine->getManager();
        if (!$em instanceof \Doctrine\ORM\EntityManagerInterface) {
            throw new \RuntimeException('Entity Manager not found');
        }
        $this->entityManager = $em;
    }

    public function testExportThenImportCycle(): void
    {
        // 1. Setup Data
        /** @var User $user */
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $group = new Group();
        $group->setUser($user);
        $group->setName('Cycle Group');
        $group->setUuid(Uuid::v7());
        $this->entityManager->persist($group);

        $contact = new Contact();
        $contact->setUser($user);
        $contact->setUuid(Uuid::v7());

        $name = new ContactName($contact);
        $name->setGiven('Cycle');
        $name->setFamily('Tester');
        $contact->addContactName($name);

        $name2 = new ContactName($contact);
        $name2->setGiven('Cycle2');
        $name2->setFamily('Tester2');
        $contact->addContactName($name2);

        $contactGroup = new ContactGroup($contact);
        $contactGroup->setGroupResource($group);
        $contact->addContactGroup($contactGroup);

        // Add second group
        $group2 = new Group();
        $group2->setUser($user);
        $group2->setName('Cycle Group 2');
        $group2->setUuid(Uuid::v7());
        $this->entityManager->persist($group2);

        $contactGroup2 = new ContactGroup($contact);
        $contactGroup2->setGroupResource($group2);
        $contact->addContactGroup($contactGroup2);

        $this->entityManager->persist($contact);
        $this->entityManager->flush();

        $contactUuidObj = $contact->getUuid();
        self::assertNotNull($contactUuidObj);
        $contactUuid = $contactUuidObj->toRfc4122();

        $groupUuidObj = $group->getUuid();
        self::assertNotNull($groupUuidObj);
        $groupUuid = $groupUuidObj->toRfc4122();

        $group2UuidObj = $group2->getUuid();
        self::assertNotNull($group2UuidObj);
        // $group2Uuid = $group2UuidObj->toRfc4122(); // Unused

        // 2. Export
        $client = static::createClient();
        ob_start();
        $client->request('GET', '/api/contacts/export', [
            'auth_bearer' => $this->token,
        ]);
        $content = (string) ob_get_clean();

        if ('' === $content) {
            $response = $client->getKernelBrowser()->getResponse();
            if ($response instanceof StreamedResponse) {
                $reflection = new \ReflectionClass($response);
                $property = $reflection->getProperty('callback');
                $callback = $property->getValue($response);

                ob_start();
                if (is_callable($callback)) {
                    $callback();
                }
                $content = (string) ob_get_clean();
            }
        }

        self::assertResponseIsSuccessful();
        self::assertNotEmpty($content, 'Exported content should not be empty');

        // 3. Clear DB (Delete created entities to simulate import into fresh state)
        // We can't easily delete just these due to constraints/other tests, but we can try removing them.
        // Or simpler: change UUIDs in the XML so they are imported as NEW entities.

        $newContactUuid = Uuid::v7()->toRfc4122();
        $newGroupUuid = Uuid::v7()->toRfc4122();

        $xmlContent = str_replace(
            [$contactUuid, $groupUuid],
            [$newContactUuid, $newGroupUuid],
            $content
        );

        // 4. Import
        $client->request('POST', '/api/contacts/import-xml', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'application/xml'],
            'body' => $xmlContent,
        ]);

        $response = $client->getResponse();
        self::assertNotNull($response);
        self::assertEquals(204, $response->getStatusCode());

        // 5. Verify Import
        $this->entityManager->clear(); // Clear identity map

        $importedContact = $this->entityManager->getRepository(Contact::class)->findOneBy(['uuid' => $newContactUuid]);
        self::assertNotNull($importedContact, 'Imported contact should exist');

        $importedGroup = $this->entityManager->getRepository(Group::class)->findOneBy(['uuid' => $newGroupUuid]);
        self::assertNotNull($importedGroup, 'Imported group should exist');

        // Check Relationship
        $contactGroups = $importedContact->getContactGroups();
        self::assertGreaterThan(0, $contactGroups->count(), 'Imported contact should have the group link');

        $linkedGroupWrapper = $contactGroups->first();
        self::assertInstanceOf(ContactGroup::class, $linkedGroupWrapper);
        $linkedGroup = $linkedGroupWrapper->getGroupResource();
        self::assertNotNull($linkedGroup);
        $linkedGroupUuid = $linkedGroup->getUuid();
        self::assertNotNull($linkedGroupUuid);
        self::assertEquals($newGroupUuid, $linkedGroupUuid->toRfc4122());

        // Check Name
        $firstContactName = $importedContact->getContactNames()->first();
        self::assertInstanceOf(ContactName::class, $firstContactName);
        self::assertEquals('Cycle', $firstContactName->getGiven());
    }
}
