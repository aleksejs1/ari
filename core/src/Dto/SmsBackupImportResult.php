<?php

namespace Ari\Dto;

final readonly class SmsBackupImportResult
{
    public function __construct(
        public int $callsImported = 0,
        public int $smsThreadsImported = 0,
        public int $contactsCreated = 0,
        public int $recordsSkipped = 0,
    ) {
    }
}
