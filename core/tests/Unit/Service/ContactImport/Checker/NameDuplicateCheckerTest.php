<?php

namespace App\Tests\Unit\Service\ContactImport\Checker;

use App\Dto\ContactImportDto;
use App\Dto\ContactNameDto;
use App\Entity\Contact;
use App\Entity\ContactName;
use App\Entity\User;
use App\Repository\ContactNameRepository;
use App\Service\ContactImport\Checker\NameDuplicateChecker;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

final class NameDuplicateCheckerTest extends TestCase
{
    /** @var ContactNameRepository&MockObject */
    private ContactNameRepository $contactNameRepository;
    private NameDuplicateChecker $checker;

    #[\Override]
    protected function setUp(): void
    {
        $this->contactNameRepository = $this->createMock(ContactNameRepository::class);
        $this->checker = new NameDuplicateChecker($this->contactNameRepository);
    }

    public function testIsDuplicateReturnsTrueWhenDuplicateExistsForUser(): void
    {
        $user = new User();

        $contact = new Contact();
        $contact->setUser($user);

        $contactName = new ContactName();
        $contactName->setContact($contact);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('Doe', 'John')]
        );

        $this->contactNameRepository->expects(self::once())
            ->method('findOneBy')
            ->with(['given' => 'John', 'family' => 'Doe'])
            ->willReturn($contactName);

        self::assertTrue($this->checker->isDuplicate($dto, $user));
    }

    public function testIsDuplicateReturnsFalseWhenDuplicateExistsForOtherUser(): void
    {
        $user = new User();
        $otherUser = new User();

        $contact = new Contact();
        $contact->setUser($otherUser);

        $contactName = new ContactName();
        $contactName->setContact($contact);

        $dto = new ContactImportDto(
            names: [new ContactNameDto('Doe', 'John')]
        );

        $this->contactNameRepository->expects(self::once())
            ->method('findOneBy')
            ->with(['given' => 'John', 'family' => 'Doe'])
            ->willReturn($contactName);

        self::assertFalse($this->checker->isDuplicate($dto, $user));
    }

    public function testIsDuplicateReturnsFalseWhenNoDuplicateExists(): void
    {
        $user = new User();
        $dto = new ContactImportDto(
            names: [new ContactNameDto('Doe', 'John')]
        );

        $this->contactNameRepository->expects(self::once())
            ->method('findOneBy')
            ->with(['given' => 'John', 'family' => 'Doe'])
            ->willReturn(null);

        self::assertFalse($this->checker->isDuplicate($dto, $user));
    }
}
