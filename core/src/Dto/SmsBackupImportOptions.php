<?php

namespace Ari\Dto;

final readonly class SmsBackupImportOptions
{
    public function __construct(
        /** 'skip' | 'create' — what to do when the phone number has no matching contact */
        public string $unknownNumbers = 'skip',
        /** 'keep' | 'add' | 'replace' — what to do when XML contact name differs from stored name */
        public string $nameConflict = 'keep',
        /** Skip alphanumeric senders (service notifications, banks, etc.) */
        public bool $skipAlphanumeric = true,
        /** 'skip' | 'create' — what to do with duplicate interactions */
        public string $duplicateStrategy = 'skip',
    ) {
    }
}
