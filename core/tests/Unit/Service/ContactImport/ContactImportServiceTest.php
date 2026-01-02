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
    /** @var EntityManagerInterface&MockObject */
    private EntityManagerInterface $entityManager;
    private ContactImportService $service;
    /** @var ContactDuplicateCheckerInterface&MockObject */
    private ContactDuplicateCheckerInterface $checker;

    #[\Override]
    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->checker = $this->createMock(ContactDuplicateCheckerInterface::class);
        $this->service = new ContactImportService(
            [$this->checker],
            $this->entityManager
        );
    }

    public function testImportCreatesContactWhenNoDuplicate(): void
    {
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

        $this->checker->expects(self::once())
            ->method('isDuplicate')
            ->with($dto, $user)
            ->willReturn(false);

        $this->entityManager->expects(self::once())->method('persist');
        $this->entityManager->expects(self::once())->method('flush');

        $contact = $this->service->import($dto, $user);

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
        $user = new User();
        $dto = new ContactImportDto();

        $this->checker->expects(self::once())
            ->method('isDuplicate')
            ->with($dto, $user)
            ->willReturn(true);

        $this->entityManager->expects(self::never())->method('persist');
        $this->entityManager->expects(self::never())->method('flush');

        $result = $this->service->import($dto, $user);

        self::assertNull($result);
    }
    public function testUpdateRecyclesEntities(): void
    {
        $contact = new Contact();
        $originalName = new ContactName();
        $originalName->setGiven('OldGiven');
        $originalName->setFamily('OldFamily');
        $contact->addContactName($originalName);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('NewFamily', 'NewGiven')],
        );

        $this->entityManager->expects(self::once())->method('persist');
        $this->entityManager->expects(self::once())->method('flush');

        $this->service->update($contact, $dto);

        self::assertCount(1, $contact->getContactNames());
        $updatedName = $contact->getContactNames()->first();

        // Key assertion: The existing entity should be reused/updated, not replaced.
        self::assertSame($originalName, $updatedName, 'The existing entity should be reused/updated, not replaced.');
        self::assertEquals('NewGiven', $updatedName->getGiven());
        self::assertEquals('NewFamily', $updatedName->getFamily());
    }

    public function testUpdateDoesNothingIfMatch(): void
    {
        $contact = new Contact();
        $originalName = new ContactName();
        $originalName->setGiven('Given');
        $originalName->setFamily('Family');
        $contact->addContactName($originalName);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('Family', 'Given')],
        );

        $this->entityManager->expects(self::once())->method('persist');
        $this->entityManager->expects(self::once())->method('flush');

        $this->service->update($contact, $dto);

        self::assertCount(1, $contact->getContactNames());
        $currentName = $contact->getContactNames()->first();

        self::assertSame($originalName, $currentName);
        self::assertEquals('Given', $currentName->getGiven());
    }
}
