<?php

declare(strict_types=1);

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use Ari\State\ContactReciprocityProvider;

/**
 * Read-only DTO exposing the interaction reciprocity ratio for a contact.
 *
 * GET /api/contacts/{id}/reciprocity
 *   → { id, me, them, days }
 *
 * Security: ROLE_USER + TenantFilter (the provider returns 404 for contacts
 * that do not belong to the current user).
 */
#[ApiResource(
    shortName: 'ContactReciprocity',
    operations: [
        new Get(
            uriTemplate: '/contacts/{id}/reciprocity',
            security: "is_granted('ROLE_USER')",
            provider: ContactReciprocityProvider::class,
            name: 'get_contact_reciprocity',
        ),
    ],
)]
final class ContactReciprocity
{
    public function __construct(
        #[ApiProperty(identifier: true)]
        public readonly int $id,
        public readonly int $me,
        public readonly int $them,
        public readonly int $days,
    ) {
    }
}
