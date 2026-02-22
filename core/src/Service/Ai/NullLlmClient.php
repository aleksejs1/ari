<?php

namespace Ari\Service\Ai;

/**
 * No-op implementation used when AI_API_KEY is empty.
 * The entire AI subsystem silently does nothing — no errors, no UI artifacts.
 */
final class NullLlmClient implements LlmClientInterface
{
    #[\Override]
    public function isAvailable(): bool
    {
        return false;
    }

    #[\Override]
    public function suggestLocaleAlternative(?string $given, ?string $family, array $contextLocales): ?array
    {
        return null;
    }
}
