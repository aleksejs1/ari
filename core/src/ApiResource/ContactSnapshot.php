<?php

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use Ari\State\ContactSnapshotProvider;

#[ApiResource(
    shortName: 'ContactSnapshot',
    operations: [
        new Get(
            uriTemplate: '/contacts/{contactId}/snapshot/{logId}',
            provider: ContactSnapshotProvider::class,
            name: 'get_contact_snapshot',
        ),
    ],
    security: "is_granted('ROLE_USER')",
)]
class ContactSnapshot
{
    public function __construct(
        #[ApiProperty(identifier: true)]
        public string $id,
        public int $contactId,
        public int $logId,
        /**
         * @var array<string, mixed>
         */
        public array $snapshot,
    ) {
    }
}
