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
use App\Entity\ContactName;
use App\Entity\ContactOrganization;
use App\Entity\ContactPhoneNumber;
use App\Entity\User;
use App\Service\ContactImport\ContactDuplicateCheckerInterface;
use App\Service\ContactImport\ContactImportService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

final class ContactImportServiceTest extends TestCase
{
    public function testImportCreatesContactWhenNoDuplicate(): void
    {
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $checker = $this->createMock(ContactDuplicateCheckerInterface::class);
        $service = new ContactImportService(
            [$checker],
            $entityManager
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
                    'home'
                ),
            ],
            organizations: [new ContactOrganizationDto('Org Name', 'Dept', 'Title', 'Desc', 'work')],
            biographies: [new ContactBiographyDto('Bio text', 'note')]
        );

        $checker->expects(self::once())
            ->method('isDuplicate')
            ->with($dto, $user)
            ->willReturn(false);

        $entityManager->expects(self::once())->method('persist');
        $entityManager->expects(self::once())->method('flush');

        $contact = $service->import($dto, $user);

        self::assertNotNull($contact);
        self::assertSame($user, $contact->getUser());
        self::assertCount(1, $contact->getContactNames());
        self::assertCount(1, $contact->getContactDates());

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
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $checker = $this->createMock(ContactDuplicateCheckerInterface::class);
        $service = new ContactImportService(
            [$checker],
            $entityManager
        );

        $user = new User();
        $dto = new ContactImportDto();

        $checker->expects(self::once())
            ->method('isDuplicate')
            ->with($dto, $user)
            ->willReturn(true);

        $entityManager->expects(self::never())->method('persist');
        $entityManager->expects(self::never())->method('flush');

        $result = $service->import($dto, $user);

        self::assertNull($result);
    }

    public function testUpdateRecyclesEntities(): void
    {
        $entityManager = $this->createMock(EntityManagerInterface::class);
        // We pass an empty array of checkers because update() doesn't use them
        $service = new ContactImportService(
            [],
            $entityManager
        );

        $contact = new Contact();
        $originalName = new ContactName();
        $originalName->setGiven('OldGiven');
        $originalName->setFamily('OldFamily');
        $contact->addContactName($originalName);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('NewFamily', 'NewGiven')],
        );

        $entityManager->expects(self::once())->method('persist');
        $entityManager->expects(self::once())->method('flush');

        $service->update($contact, $dto);

        self::assertCount(1, $contact->getContactNames());
        $updatedName = $contact->getContactNames()->first();

        // Key assertion: The existing entity should be reused/updated, not replaced.
        self::assertSame($originalName, $updatedName, 'The existing entity should be reused/updated, not replaced.');
        self::assertEquals('NewGiven', $updatedName->getGiven());
        self::assertEquals('NewFamily', $updatedName->getFamily());
    }

    public function testUpdateDoesNothingIfMatch(): void
    {
        $entityManager = $this->createMock(EntityManagerInterface::class);
        // We pass an empty array of checkers because update() doesn't use them
        $service = new ContactImportService(
            [],
            $entityManager
        );

        $contact = new Contact();
        $originalName = new ContactName();
        $originalName->setGiven('Given');
        $originalName->setFamily('Family');
        $contact->addContactName($originalName);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('Family', 'Given')],
        );

        $entityManager->expects(self::once())->method('persist');
        $entityManager->expects(self::once())->method('flush');

        $service->update($contact, $dto);

        self::assertCount(1, $contact->getContactNames());
        $currentName = $contact->getContactNames()->first();

        self::assertSame($originalName, $currentName);
        self::assertEquals('Given', $currentName->getGiven());
    }

    public function testImportSetsContactAndTenantOnNewEntities(): void
    {
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $service = new ContactImportService([], $entityManager);

        $user = new User();
        // Set ID via reflection to simulate a persisted user
        $reflection = new \ReflectionProperty(User::class, 'id');
        $reflection->setValue($user, 12345);

        $contact = new Contact();
        $contact->setUser($user);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('Vance', 'Eleanor')],
            dates: [new ContactDateDto(new \DateTime('2023-01-01'), 'Birthday')],
            emails: [new ContactEmailDto('eleanor@example.com', 'home')],
            phones: [new ContactPhoneDto('555-0199', 'home')],
            addresses: [new ContactAddressDto(street: '123 Hill House')],
            organizations: [new ContactOrganizationDto(name: 'Paranormal Investigators')],
            biographies: [new ContactBiographyDto(value: 'Interested in psychic phenomena')]
        );

        $entityManager->expects(self::once())->method('persist');
        $entityManager->expects(self::once())->method('flush');

        $service->update($contact, $dto);

        $name = $contact->getContactNames()->first();
        self::assertInstanceOf(ContactName::class, $name);
        self::assertNotNull($name->getContact(), 'ContactName should have a contact set');
        self::assertSame($user, $name->getTenant(), 'ContactName should have the correct tenant');

        $date = $contact->getContactDates()->first();
        self::assertInstanceOf(ContactDate::class, $date);
        self::assertNotNull($date->getContact(), 'ContactDate should have a contact set');
        self::assertSame($user, $date->getTenant(), 'ContactDate should have the correct tenant');

        $email = $contact->getContactEmailAdresses()->first();
        self::assertInstanceOf(ContactEmailAdress::class, $email);
        self::assertNotNull($email->getContact(), 'ContactEmailAdress should have a contact set');
        self::assertSame($user, $email->getTenant(), 'ContactEmailAdress should have the correct tenant');

        $phone = $contact->getPhoneNumbers()->first();
        self::assertInstanceOf(ContactPhoneNumber::class, $phone);
        self::assertNotNull($phone->getContact(), 'ContactPhoneNumber should have a contact set');
        self::assertSame($user, $phone->getTenant(), 'ContactPhoneNumber should have the correct tenant');

        $address = $contact->getContactAddresses()->first();
        self::assertInstanceOf(ContactAddress::class, $address);
        self::assertNotNull($address->getContact(), 'ContactAddress should have a contact set');
        self::assertSame($user, $address->getTenant(), 'ContactAddress should have the correct tenant');

        $org = $contact->getContactOrganizations()->first();
        self::assertInstanceOf(ContactOrganization::class, $org);
        self::assertNotNull($org->getContact(), 'ContactOrganization should have a contact set');
        self::assertSame($user, $org->getTenant(), 'ContactOrganization should have the correct tenant');

        $bio = $contact->getContactBiographies()->first();
        self::assertInstanceOf(ContactBiography::class, $bio);
        self::assertNotNull($bio->getContact(), 'ContactBiography should have a contact set');
        self::assertSame($user, $bio->getTenant(), 'ContactBiography should have the correct tenant');
    }
}
