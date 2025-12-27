<?php

namespace App\Tests\Unit\Service\ContactImport;

use App\Dto\ContactDateDto;
use App\Dto\ContactImportDto;
use App\Dto\ContactNameDto;
use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\ContactName;
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
            dates: [new ContactDateDto(new \DateTime('2023-01-01'), 'Birthday')]
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
}
