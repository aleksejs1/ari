<?php

namespace App\Service\ContactImport;

use App\Dto\ContactImportDto;
use App\Entity\User;

interface ContactDuplicateCheckerInterface
{
    public function isDuplicate(ContactImportDto $dto, User $user): bool;
}
