<?php

declare(strict_types=1);

namespace Ari\Dto;

use Symfony\Component\Serializer\Attribute\Groups;

final class ContactDisplayOptionsDto
{
    /**
     * @param string[] $nameLocales
     * @param string[] $phoneTypes
     * @param string[] $emailTypes
     * @param string[] $dateTexts
     */
    public function __construct(
        #[Groups(['contact_display_options:read'])]
        public readonly array $nameLocales = [],
        #[Groups(['contact_display_options:read'])]
        public readonly array $phoneTypes = [],
        #[Groups(['contact_display_options:read'])]
        public readonly array $emailTypes = [],
        #[Groups(['contact_display_options:read'])]
        public readonly array $dateTexts = [],
    ) {
    }
}
