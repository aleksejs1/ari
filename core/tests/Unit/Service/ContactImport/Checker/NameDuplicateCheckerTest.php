<?php

namespace Ari\Tests\Unit\Service\ContactImport\Checker;

use Ari\Dto\ContactImportDto;
use Ari\Dto\ContactNameDto;
use Ari\Entity\Contact;
use Ari\Entity\ContactName;
use Ari\Entity\User;
use Ari\Repository\ContactNameRepository;
use Ari\Service\ContactImport\Checker\NameDuplicateChecker;
use PHPUnit\Framework\TestCase;

final class NameDuplicateCheckerTest extends TestCase
{
    /** @var ContactNameRepository&\PHPUnit\Framework\MockObject\Stub */
    private ContactNameRepository $contactNameRepository;
    private NameDuplicateChecker $checker;

    #[\Override]
    protected function setUp(): void
    {
        $this->contactNameRepository = self::createStub(ContactNameRepository::class);
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
            names: [new ContactNameDto('Doe', 'John')],
        );

        // Simulate behavior: findOneBy returns $contactName when criteria matches
        $this->contactNameRepository->method('findOneBy')
             ->willReturnMap([
                 [['given' => 'John', 'family' => 'Doe'], null, $contactName],
             ]);

        // Wait, willReturnMap takes array of [args..., return].
        // If args are ['given'=>'John'...].
        // createStub logic: if map matches args.
        // Array comparison might be strict?
        // Let's use callback to be safer?
        // Or just return $contactName. If logic calls findOneBy, it gets it.
        // It relies on $checker calling with correct criteria to get the result that makes isDuplicate return true.
        // If it sends wrong criteria, it might get same result if using simple willReturn.
        // Using willReturnMap adds a layer of "mocking" verif.

        $this->contactNameRepository = self::createStub(ContactNameRepository::class);
        $this->contactNameRepository->method('findOneBy')->willReturnCallback(function ($criteria) use ($contactName) {
            if ($criteria === ['given' => 'John', 'family' => 'Doe']) {
                return $contactName;
            }

            return null;
        });

        $this->checker = new NameDuplicateChecker($this->contactNameRepository);

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
            names: [new ContactNameDto('Doe', 'John')],
        );

        $this->contactNameRepository = self::createStub(ContactNameRepository::class);
        $this->contactNameRepository->method('findOneBy')->willReturnCallback(function ($criteria) use ($contactName) {
            if ($criteria === ['given' => 'John', 'family' => 'Doe']) {
                return $contactName;
            }

            return null;
        });

        $this->checker = new NameDuplicateChecker($this->contactNameRepository);

        self::assertFalse($this->checker->isDuplicate($dto, $user));
    }

    public function testIsDuplicateReturnsFalseWhenNoDuplicateExists(): void
    {
        $user = new User();
        $dto = new ContactImportDto(
            names: [new ContactNameDto('Doe', 'John')],
        );

        $this->contactNameRepository->method('findOneBy')->willReturn(null);

        self::assertFalse($this->checker->isDuplicate($dto, $user));
    }
}
