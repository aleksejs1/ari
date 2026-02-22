<?php

namespace Ari\Service\Ai;

interface LlmClientInterface
{
    public function isAvailable(): bool;

    /**
     * Suggest a locale alternative transliteration for the given name.
     *
     * @param array<string> $contextLocales ISO 639-1 codes of the user's active languages
     * @return array{detectedLocale: string, suggestedLocale: string, given: string, family: string, tokensPrompt?: int|null, tokensCompletion?: int|null, providerUsed?: string, modelUsed?: string}|null
     *         Returns null if transliteration is impossible, unnecessary, or the target language is not in the list.
     */
    public function suggestLocaleAlternative(?string $given, ?string $family, array $contextLocales): ?array;
}
