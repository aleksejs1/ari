<?php

declare(strict_types=1);

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use Ari\State\ContactDisplayOptionsProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'ContactDisplayOptions',
    operations: [
        new Get(
            uriTemplate: '/contacts/display-options',
            provider: ContactDisplayOptionsProvider::class,
            normalizationContext: ['groups' => ['contact_display_options:read']],
            security: "is_granted('ROLE_USER')",
            name: 'get_contact_display_options',
        ),
    ],
)]
final class ContactDisplayOptions
{
    /**
     * @param string[] $nameLocales
     * @param string[] $phoneTypes
     * @param string[] $emailTypes
     * @param string[] $dateTexts
     */
    public function __construct(
        #[ApiProperty(identifier: true)]
        public string $id = 'current',
        #[Groups(['contact_display_options:read'])]
        public array $nameLocales = [],
        #[Groups(['contact_display_options:read'])]
        public array $phoneTypes = [],
        #[Groups(['contact_display_options:read'])]
        public array $emailTypes = [],
        #[Groups(['contact_display_options:read'])]
        public array $dateTexts = [],
    ) {
    }
}
