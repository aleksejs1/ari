<?php

namespace App\Tests\Unit\Service\ContactImport;

use App\Dto\ContactAddressDto;
use App\Dto\ContactBiographyDto;
use App\Dto\ContactDateDto;
use App\Dto\ContactEmailDto;
use App\Dto\ContactImportDto;
use App\Dto\ContactNameDto;
use App\Dto\ContactOrganizationDto;
use App\Dto\ContactPhoneDto;
use App\Entity\Contact;
use App\Entity\ContactAddress;
use App\Entity\ContactBiography;
use App\Entity\ContactDate;
use App\Entity\ContactEmailAdress;
use App\Entity\ContactGroup;
use App\Entity\ContactName;
use App\Entity\ContactOrganization;
use App\Entity\ContactPhoneNumber;
use App\Entity\Group;
use App\Entity\User;
use App\Service\ContactImport\ContactDuplicateCheckerInterface;
use App\Service\ContactImport\ContactImportService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

final class ContactImportServiceTest extends TestCase
{
    public function testImportCreatesContactWhenNoDuplicate(): void
    {
        $persisted = [];
        $entityManager = self::createStub(EntityManagerInterface::class);
        $entityManager->method('persist')->willReturnCallback(function($obj) use (&$persisted) {
             $persisted[] = $obj;
        });
        
        $checker = self::createStub(ContactDuplicateCheckerInterface::class);
        $checker->method('isDuplicate')->willReturn(false);

        $service = new ContactImportService(
            [$checker],
            $entityManager,
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
        $entityManager->method('persist')->willReturnCallback(function($obj) use (&$persisted) {
             $persisted[] = $obj;
        });

        $checker = self::createStub(ContactDuplicateCheckerInterface::class);
        $checker->method('isDuplicate')->willReturn(true);

        $service = new ContactImportService(
            [$checker],
            $entityManager,
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
        $entityManager->method('persist')->willReturnCallback(function($obj) use (&$persisted) {
             $persisted[] = $obj;
        });

        $service = new ContactImportService(
            [],
            $entityManager,
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
        $entityManager->method('persist')->willReturnCallback(function($obj) use (&$persisted) {
             $persisted[] = $obj;
        });

        $service = new ContactImportService(
            [],
            $entityManager,
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
        $entityManager->method('persist')->willReturnCallback(function($obj) use (&$persisted) {
             $persisted[] = $obj;
        });

        $service = new ContactImportService([], $entityManager);

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
}
