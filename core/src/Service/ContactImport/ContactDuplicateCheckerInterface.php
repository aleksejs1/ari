<?php

namespace Ari\Service\ContactImport;

use Ari\Dto\ContactImportDto;
use Ari\Entity\User;

interface ContactDuplicateCheckerInterface
{
    public function isDuplicate(ContactImportDto $dto, User $user): bool;
}
