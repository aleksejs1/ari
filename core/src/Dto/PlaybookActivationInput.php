<?php

declare(strict_types=1);

namespace Ari\Dto;

use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Input DTO for POST /api/contacts/{contactId}/playbook.
 * Carries the preset, whyTags, and whyText for playbook activation.
 */
final class PlaybookActivationInput
{
    #[Groups(['contact_playbook:write'])]
    #[Assert\NotBlank]
    public string $preset = '';

    /** @var list<string>|null */
    #[Groups(['contact_playbook:write'])]
    public ?array $whyTags = null;

    #[Groups(['contact_playbook:write'])]
    public ?string $whyText = null;
}
