<?php

namespace App\Service\ContactImport\Checker;

use App\Dto\ContactImportDto;
use App\Entity\Contact;
use App\Entity\ContactName;
use App\Entity\User;
use App\Repository\ContactNameRepository;
use App\Service\ContactImport\ContactDuplicateCheckerInterface;

class NameDuplicateChecker implements ContactDuplicateCheckerInterface
{
    public function __construct(
        private readonly ContactNameRepository $contactNameRepository,
    ) {
    }

    #[\Override]
    public function isDuplicate(ContactImportDto $dto, User $user): bool
    {
        foreach ($dto->names as $nameDto) {
            $existingName = $this->contactNameRepository->findOneBy([
                'given' => $nameDto->given,
                'family' => $nameDto->family,
            ]);

            if (null === $existingName) {
                continue;
            }

            $contact = $existingName->getContact();
            if (null === $contact) {
                continue;
            }

            if ($contact->getUser() === $user) {
                return true;
            }
        }

        return false;
    }
}
