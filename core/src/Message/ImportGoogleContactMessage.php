<?php

namespace App\Message;

final readonly class ImportGoogleContactMessage
{
    public function __construct(
        public int $userId,
        public string $resourceName,
        public bool $addGoogleGroup = false,
    ) {
    }
}
