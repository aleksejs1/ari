<?php

namespace Ari\ValueObject;

final readonly class ParsedRecord
{
    public const TYPE_SMS = 'sms';
    public const TYPE_CALL = 'call';

    public function __construct(
        /** 'sms' or 'call' */
        public string $type,
        /** Raw phone/address field from XML */
        public string $phoneNumber,
        /** Digits-only normalized phone for matching */
        public string $normalizedPhone,
        /** contact_name field from XML */
        public string $contactName,
        /** Timestamp of the record */
        public \DateTimeImmutable $date,
        /** 'incoming' | 'outgoing' | 'missed' | 'rejected' */
        public string $direction,
        /** Duration in seconds (calls only) */
        public ?int $durationSeconds = null,
    ) {
    }
}
