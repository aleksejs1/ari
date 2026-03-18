<?php

namespace Ari\Message;

/**
 * Dispatched by SmsBackupSubmitService after synchronous XML parsing.
 * Processed asynchronously by ImportSmsBackupMessageHandler.
 *
 * Parsed records are stored in the SmsBackupImportBatch entity (referenced by $batchId)
 * rather than inline, to keep message payloads small regardless of file size.
 */
final readonly class ImportSmsBackupMessage
{
    public function __construct(
        /** References the SmsBackupImportBatch row holding parsed records and import options. */
        public int $batchId,
        /** The tenant user ID — used to restore the Doctrine TenantFilter in the handler. */
        public int $tenantId,
    ) {
    }
}
