<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\ContactGroup;
use Ari\Entity\ContactName;
use Ari\Entity\Group;
use Ari\Entity\User;
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
        if (!$doctrine instanceof \Doctrine\Bundle\DoctrineBundle\Registry) {
            throw new \RuntimeException('Doctrine service not found');
        }
        $em = $doctrine->getManager();
        if (!$em instanceof EntityManagerInterface) {
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

        $organization = new \Ari\Entity\ContactOrganization($contact);
        $organization->setName('Acme Corp');
        $organization->setTitle('CEO');
        $contact->addContactOrganization($organization);

        // Add Spouse Contact
        $spouse = new Contact();
        $spouse->setUser($user);
        $spouse->setUuid(Uuid::v7());
        $this->entityManager->persist($spouse);

        $relation = new \Ari\Entity\ContactRelation($contact);
        $relation->setPerson($spouse);
        $relation->setType('Spouse');
        $contact->addContactRelation($relation);

        $this->entityManager->persist($contact);
        $this->entityManager->flush();

        $contactUuidObj = $contact->getUuid();
        self::assertNotNull($contactUuidObj);
        $contactUuid = $contactUuidObj->toRfc4122();

        $spouseUuidObj = $spouse->getUuid();
        self::assertNotNull($spouseUuidObj);
        $spouseUuid = $spouseUuidObj->toRfc4122();

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

        // Debug: Dump content to see structure
        // echo "\nExported XML:\n" . $content . "\n";

        self::assertResponseIsSuccessful();
        self::assertNotEmpty($content, 'Exported content should not be empty');

        // 3. Clear DB (Delete created entities to simulate import into fresh state)
        // We can't easily delete just these due to constraints/other tests, but we can try removing them.
        // Or simpler: change UUIDs in the XML so they are imported as NEW entities.

        $newContactUuid = Uuid::v7()->toRfc4122();
        $newGroupUuid = Uuid::v7()->toRfc4122();
        $newSpouseUuid = Uuid::v7()->toRfc4122();

        $xmlContent = str_replace(
            [$contactUuid, $groupUuid, $spouseUuid],
            [$newContactUuid, $newGroupUuid, $newSpouseUuid],
            $content,
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

        // Check Organization
        $firstOrganization = $importedContact->getContactOrganizations()->first();
        self::assertInstanceOf(\Ari\Entity\ContactOrganization::class, $firstOrganization);
        self::assertEquals('Acme Corp', $firstOrganization->getName());
        self::assertEquals('CEO', $firstOrganization->getTitle());

        // Check Relation
        $relations = $importedContact->getContactRelations();
        self::assertGreaterThan(0, $relations->count(), 'Imported contact should have the relation');
        $firstRelation = $relations->first();
        self::assertInstanceOf(\Ari\Entity\ContactRelation::class, $firstRelation);
        self::assertEquals('Spouse', $firstRelation->getType());

        $relatedPerson = $firstRelation->getPerson();
        self::assertNotNull($relatedPerson);
        // The related person should be the IMPORTED version of the spouse (new UUID)
        // We know the new spouse UUID because we will calculate/set it or we can verify it exists
        // Actually, we replaced the spouse UUID too.

        $relatedPersonUuid = $relatedPerson->getUuid();
        self::assertNotNull($relatedPersonUuid);
        // We need to assert it matches the NEW spouse UUID
        self::assertEquals($newSpouseUuid, $relatedPersonUuid->toRfc4122());

        // Assert that we don't have duplicates.
        // Depending on import order, either Contact->Spouse or Spouse->Contact will be persisted, but not both.
        // So the sum of their outgoing physical relations matching each other should be 1.
        $contactRelationsCount = $importedContact->getContactRelationsCollection()->count();
        $spouseRelationsCount = $relatedPerson->getContactRelationsCollection()->count();

        self::assertEquals(
            1,
            $contactRelationsCount + $spouseRelationsCount,
            'There should be exactly 1 physical relation persisted between the two contacts to avoid duplicates',
        );
    }
}
