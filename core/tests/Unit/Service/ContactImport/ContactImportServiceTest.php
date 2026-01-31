<?php

namespace Ari\Tests\Unit\Service\ContactImport;

use Ari\Dto\ContactAddressDto;
use Ari\Dto\ContactBiographyDto;
use Ari\Dto\ContactDateDto;
use Ari\Dto\ContactEmailDto;
use Ari\Dto\ContactImportDto;
use Ari\Dto\ContactNameDto;
use Ari\Dto\ContactOrganizationDto;
use Ari\Dto\ContactPhoneDto;
use Ari\Entity\Contact;
use Ari\Entity\ContactAddress;
use Ari\Entity\ContactBiography;
use Ari\Entity\ContactDate;
use Ari\Entity\ContactEmailAdress;
use Ari\Entity\ContactGroup;
use Ari\Entity\ContactName;
use Ari\Entity\ContactOrganization;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\Group;
use Ari\Entity\User;
use Ari\Service\ContactImport\ContactDuplicateCheckerInterface;
use Ari\Service\ContactImport\ContactImportService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

final class ContactImportServiceTest extends TestCase
{
    public function testImportCreatesContactWhenNoDuplicate(): void
    {
        $persisted = [];
        $entityManager = self::createStub(EntityManagerInterface::class);
        $entityManager->method('persist')->willReturnCallback(function ($obj) use (&$persisted) {
            $persisted[] = $obj;
        });

        $checker = self::createStub(ContactDuplicateCheckerInterface::class);
        $checker->method('isDuplicate')->willReturn(false);

        $avatarManager = self::createStub(\Ari\Service\AvatarManager::class);

        $service = new ContactImportService(
            [$checker],
            $entityManager,
            $avatarManager,
        );

        $user = new User();
        $dto = new ContactImportDto(
            names: [new ContactNameDto('Doe', 'John')],
            dates: [new ContactDateDto(new \DateTime('2023-01-01'), 'Birthday')],
            emails: [new ContactEmailDto('test@example.com', 'home')],
            phones: [new ContactPhoneDto('1234567890', 'mobile')],
            addresses: [
                new ContactAddressDto(
                    '123 Main St',
                    'Apt 1',
                    'City',
                    'Region',
                    '12345',
                    'Country',
                    'US',
                    'home',
                ),
            ],
            organizations: [new ContactOrganizationDto('Org Name', 'Dept', 'Title', 'Desc', 'work')],
            biographies: [new ContactBiographyDto('Bio text', 'note')],
        );

        $contact = $service->import($dto, $user);

        self::assertNotNull($contact);
        self::assertSame($user, $contact->getUser());
        self::assertCount(1, $contact->getContactNames());
        self::assertCount(1, $contact->getContactDates());

        self::assertNotEmpty($persisted); // At least contact persisted

        $name = $contact->getContactNames()->first();
        self::assertInstanceOf(ContactName::class, $name);
        self::assertEquals('John', $name->getGiven());
        self::assertEquals('Doe', $name->getFamily());

        $date = $contact->getContactDates()->first();
        self::assertInstanceOf(ContactDate::class, $date);
        self::assertEquals('Birthday', $date->getText());

        self::assertCount(1, $contact->getContactEmailAdresses());
        $email = $contact->getContactEmailAdresses()->first();
        self::assertInstanceOf(ContactEmailAdress::class, $email);
        self::assertEquals('test@example.com', $email->getValue());
        self::assertEquals('home', $email->getType());

        self::assertCount(1, $contact->getPhoneNumbers());
        $phone = $contact->getPhoneNumbers()->first();
        self::assertInstanceOf(ContactPhoneNumber::class, $phone);
        self::assertEquals('1234567890', $phone->getValue());
        self::assertEquals('mobile', $phone->getType());

        self::assertCount(1, $contact->getContactAddresses());
        $address = $contact->getContactAddresses()->first();
        self::assertInstanceOf(ContactAddress::class, $address);
        self::assertEquals('123 Main St', $address->getStreet());
        self::assertEquals('home', $address->getType());

        self::assertCount(1, $contact->getContactOrganizations());
        $org = $contact->getContactOrganizations()->first();
        self::assertInstanceOf(ContactOrganization::class, $org);
        self::assertEquals('Org Name', $org->getName());
        self::assertEquals('work', $org->getType());

        self::assertCount(1, $contact->getContactBiographies());
        $bio = $contact->getContactBiographies()->first();
        self::assertInstanceOf(ContactBiography::class, $bio);
        self::assertEquals('Bio text', $bio->getValue());
        self::assertEquals('note', $bio->getType());
    }

    public function testImportReturnsNullWhenDuplicateExists(): void
    {
        $persisted = [];
        $entityManager = self::createStub(EntityManagerInterface::class);
        $entityManager->method('persist')->willReturnCallback(function ($obj) use (&$persisted) {
            $persisted[] = $obj;
        });

        $checker = self::createStub(ContactDuplicateCheckerInterface::class);
        $checker->method('isDuplicate')->willReturn(true);

        $avatarManager = self::createStub(\Ari\Service\AvatarManager::class);

        $service = new ContactImportService(
            [$checker],
            $entityManager,
            $avatarManager,
        );

        $user = new User();
        $dto = new ContactImportDto();

        $result = $service->import($dto, $user);

        self::assertNull($result);
        self::assertEmpty($persisted);
    }

    public function testUpdateRecyclesEntities(): void
    {
        $persisted = [];
        $entityManager = self::createStub(EntityManagerInterface::class);
        $entityManager->method('persist')->willReturnCallback(function ($obj) use (&$persisted) {
            $persisted[] = $obj;
        });

        $avatarManager = self::createStub(\Ari\Service\AvatarManager::class);

        $service = new ContactImportService(
            [],
            $entityManager,
            $avatarManager,
        );

        $contact = new Contact();
        $originalName = new ContactName();
        $originalName->setGiven('OldGiven');
        $originalName->setFamily('OldFamily');
        $contact->addContactName($originalName);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('NewFamily', 'NewGiven')],
        );

        $service->update($contact, $dto);

        self::assertCount(1, $contact->getContactNames());
        $updatedName = $contact->getContactNames()->first();

        self::assertSame($originalName, $updatedName, 'The existing entity should be reused/updated, not replaced.');
        self::assertEquals('NewGiven', $updatedName->getGiven());
        self::assertEquals('NewFamily', $updatedName->getFamily());
        self::assertNotEmpty($persisted);
    }

    public function testUpdateDoesNothingIfMatch(): void
    {
        $persisted = [];
        $entityManager = self::createStub(EntityManagerInterface::class);
        $entityManager->method('persist')->willReturnCallback(function ($obj) use (&$persisted) {
            $persisted[] = $obj;
        });

        $avatarManager = self::createStub(\Ari\Service\AvatarManager::class);

        $service = new ContactImportService(
            [],
            $entityManager,
            $avatarManager,
        );

        $contact = new Contact();
        $originalName = new ContactName();
        $originalName->setGiven('Given');
        $originalName->setFamily('Family');
        $contact->addContactName($originalName);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('Family', 'Given')],
        );

        $service->update($contact, $dto);

        self::assertCount(1, $contact->getContactNames());
        $currentName = $contact->getContactNames()->first();

        self::assertSame($originalName, $currentName);
        self::assertEquals('Given', $currentName->getGiven());
    }

    public function testImportSetsContactAndTenantOnNewEntities(): void
    {
        $persisted = [];
        $entityManager = self::createStub(EntityManagerInterface::class);
        $entityManager->method('persist')->willReturnCallback(function ($obj) use (&$persisted) {
            $persisted[] = $obj;
        });

        $avatarManager = self::createStub(\Ari\Service\AvatarManager::class);
        $service = new ContactImportService([], $entityManager, $avatarManager);

        $user = new User();
        $reflection = new \ReflectionProperty(User::class, 'id');
        $reflection->setValue($user, 12345);

        $contact = new Contact();
        $contact->setUser($user);

        $org = new ContactOrganizationDto(name: 'Paranormal Investigators');
        $bio = new ContactBiographyDto(value: 'Interested in psychic phenomena');
        $group = new Group();
        $group->setName('Test Group');

        $dto = new ContactImportDto(
            names: [new ContactNameDto('Vance', 'Eleanor')],
            dates: [new ContactDateDto(new \DateTime('2023-01-01'), 'Birthday')],
            emails: [new ContactEmailDto('eleanor@example.com', 'home')],
            phones: [new ContactPhoneDto('555-0199', 'home')],
            addresses: [new ContactAddressDto(street: '123 Hill House')],
            organizations: [$org],
            biographies: [$bio],
            groups: [$group],
        );

        $service->update($contact, $dto); // Original test logic was using update() simulating import

        $name = $contact->getContactNames()->first();
        self::assertInstanceOf(ContactName::class, $name);
        self::assertSame($user, $name->getTenant());

        $date = $contact->getContactDates()->first();
        self::assertInstanceOf(ContactDate::class, $date);
        self::assertSame($user, $date->getTenant());

        $email = $contact->getContactEmailAdresses()->first();
        self::assertInstanceOf(ContactEmailAdress::class, $email);
        self::assertSame($user, $email->getTenant());

        $phone = $contact->getPhoneNumbers()->first();
        self::assertInstanceOf(ContactPhoneNumber::class, $phone);
        self::assertSame($user, $phone->getTenant());

        $address = $contact->getContactAddresses()->first();
        self::assertInstanceOf(ContactAddress::class, $address);
        self::assertSame($user, $address->getTenant());

        $orgEntity = $contact->getContactOrganizations()->first();
        self::assertInstanceOf(ContactOrganization::class, $orgEntity);
        self::assertSame($user, $orgEntity->getTenant());

        $bioEntity = $contact->getContactBiographies()->first();
        self::assertInstanceOf(ContactBiography::class, $bioEntity);
        self::assertSame($user, $bioEntity->getTenant());

        $contactGroup = $contact->getContactGroups()->first();
        self::assertInstanceOf(ContactGroup::class, $contactGroup);
        self::assertSame($user, $contactGroup->getTenant());

        self::assertNotEmpty($persisted);
    }

    public function testMergeDoesNotDeleteMissingItems(): void
    {
        $entityManager = self::createStub(EntityManagerInterface::class);
        $avatarManager = self::createStub(\Ari\Service\AvatarManager::class);

        $service = new ContactImportService([], $entityManager, $avatarManager);

        $contact = new Contact();

        $name1 = new ContactName();
        $name1->setGiven('One');
        $contact->addContactName($name1);

        $name2 = new ContactName();
        $name2->setGiven('Two');
        $contact->addContactName($name2);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('Family', 'Three')], // Should recycle 'One' -> 'Three'
        );

        // Merge = true (default)
        $service->update($contact, $dto, true);

        self::assertCount(2, $contact->getContactNames(), 'Should have 2 names (1 recycled, 1 kept)');

        $names = $contact->getContactNames();
        // One of them should be 'Three' (recycled)
        // One of them should be 'Two' (kept)
        $givens = array_map(fn (ContactName $n) => $n->getGiven(), $names->toArray());
        self::assertContains('Three', $givens);
        self::assertContains('Two', $givens);
    }

    public function testSyncDeletesMissingItems(): void
    {
        $entityManager = self::createStub(EntityManagerInterface::class);
        $avatarManager = self::createStub(\Ari\Service\AvatarManager::class);

        $service = new ContactImportService([], $entityManager, $avatarManager);

        $contact = new Contact();

        $name1 = new ContactName();
        $name1->setGiven('One');
        $contact->addContactName($name1);

        $name2 = new ContactName();
        $name2->setGiven('Two');
        $contact->addContactName($name2);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('Family', 'Three')], // Should recycle 'One' -> 'Three'
        );

        // Merge = false (Sync mode)
        $service->update($contact, $dto, false);

        self::assertCount(1, $contact->getContactNames(), 'Should have 1 name (1 recycled, 1 deleted)');

        $name = $contact->getContactNames()->first();
        self::assertInstanceOf(ContactName::class, $name);
        self::assertEquals('Three', $name->getGiven());
    }
}
