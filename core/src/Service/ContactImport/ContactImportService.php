<?php

namespace App\Service\ContactImport;

use App\Dto\ContactImportDto;
use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\ContactName;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\TaggedIterator;

class ContactImportService
{
    /**
     * @param iterable<ContactDuplicateCheckerInterface> $checkers
     */
    public function __construct(
        #[TaggedIterator('app.contact_duplicate_checker')]
        private readonly iterable $checkers,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function import(ContactImportDto $dto, User $user): ?Contact
    {
        foreach ($this->checkers as $checker) {
            if ($checker->isDuplicate($dto, $user)) {
                return null;
            }
        }

        $contact = new Contact();
        $contact->setUser($user);

        foreach ($dto->names as $nameDto) {
            $contactName = new ContactName();
            $contactName->setGiven($nameDto->given);
            $contactName->setFamily($nameDto->family);
            $contact->addContactName($contactName);
        }

        foreach ($dto->dates as $dateDto) {
            $contactDate = new ContactDate();
            $contactDate->setDate(
                $dateDto->date instanceof \DateTime ? $dateDto->date : \DateTime::createFromInterface($dateDto->date)
            );
            $contactDate->setText($dateDto->text);
            $contact->addContactDate($contactDate);
        }

        $this->entityManager->persist($contact);
        $this->entityManager->flush();

        return $contact;
    }
}
