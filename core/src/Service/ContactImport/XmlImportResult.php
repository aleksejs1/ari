<?php

namespace Ari\Service\ContactImport;

final class XmlImportResult
{
    /**
     * @param array<int, array{name: string, email: string}> $skippedContacts
     */
    public function __construct(
        public readonly int $imported,
        public readonly int $skipped,
        public readonly string $reason = '',
        public readonly array $skippedContacts = [],
    ) {
    }
}
