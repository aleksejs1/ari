<?php

namespace Ari\Service\ContactImport\Checker;

use Ari\Dto\ContactImportDto;
use Ari\Entity\User;
use Ari\Repository\ContactNameRepository;
use Ari\Service\ContactImport\ContactDuplicateCheckerInterface;

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
