<?php

namespace Ari\Service\Ai\Provider;

use Ari\Service\Ai\LlmClientInterface;
use Symfony\AI\Platform\Exception\RateLimitExceededException;
use Symfony\AI\Platform\Exception\RuntimeException as AiRuntimeException;
use Symfony\AI\Platform\Message\Content\Text;
use Symfony\AI\Platform\Message\MessageBag;
use Symfony\AI\Platform\Message\SystemMessage;
use Symfony\AI\Platform\Message\UserMessage;
use Symfony\AI\Platform\PlatformInterface;
use Symfony\AI\Platform\TokenUsage\TokenUsage;

/**
 * LlmClient implementation backed by symfony/ai-bundle.
 *
 * Supports any platform that can be configured via ai.yaml:
 * OpenAI, Anthropic, Gemini, Mistral, Ollama, etc.
 *
 * Active when:
 * - At least one platform is configured in ai.yaml (PlatformInterface is available)
 * - AI_API_KEY is non-empty
 * - AI_MODEL is non-empty
 */
final class SymfonyAiBundleClient implements LlmClientInterface
{
    public function __construct(
        private readonly ?PlatformInterface $platform,
        private readonly string $apiKey,
        private readonly string $model,
        private readonly int $maxTokens,
        private readonly string $provider,
    ) {
    }

    #[\Override]
    public function isAvailable(): bool
    {
        return null !== $this->platform && '' !== $this->apiKey && '' !== $this->model;
    }

    /**
     * @param array<string> $contextLocales
     * @return array{detectedLocale: string, suggestedLocale: string, given: string, family: string, tokensPrompt?: int|null, tokensCompletion?: int|null, providerUsed?: string, modelUsed?: string}|null
     *
     * @throws RateLimitExceededException when the provider returns HTTP 429
     * @throws AiRuntimeException         on connection/authentication errors
     * @throws \RuntimeException          when the provider returns unparseable JSON
     */
    #[\Override]
    public function suggestLocaleAlternative(?string $given, ?string $family, array $contextLocales): ?array
    {
        if (null === $this->platform || '' === $this->model) {
            return null;
        }

        $messageBag = $this->buildMessageBag($given, $family, $contextLocales);

        $deferred = $this->platform->invoke(
            $this->model,
            $messageBag,
            [
                'temperature' => 0.0,
                'max_tokens' => $this->maxTokens,
            ],
        );

        $text = trim($deferred->asText());

        // Extract token usage (provider-dependent, may not always be available)
        $tokenUsage = $deferred->getMetadata()->get('token_usage');
        $tokensPrompt = $tokenUsage instanceof TokenUsage ? $tokenUsage->getPromptTokens() : null;
        $tokensCompletion = $tokenUsage instanceof TokenUsage ? $tokenUsage->getCompletionTokens() : null;

        // AI explicitly says no transliteration is possible
        if ('null' === strtolower($text)) {
            return null;
        }

        // Strip markdown code blocks if present (some models wrap in ```json ... ```)
        $text = (string) preg_replace('/^```(?:json)?\s*/i', '', $text);
        $text = (string) preg_replace('/\s*```$/', '', trim($text));

        $parsed = json_decode($text, true);
        if (!\is_array($parsed)) {
            throw new \RuntimeException(sprintf('AI returned unparseable response: %s', mb_substr($text, 0, 200)));
        }

        /** @var array{detectedLocale: string, suggestedLocale: string, given: string, family: string} $suggestion */
        $suggestion = $parsed;
        $suggestion['tokensPrompt'] = $tokensPrompt;
        $suggestion['tokensCompletion'] = $tokensCompletion;
        $suggestion['providerUsed'] = $this->provider;
        $suggestion['modelUsed'] = $this->model;

        return $suggestion;
    }

    /**
     * @param array<string> $contextLocales
     */
    private function buildMessageBag(?string $given, ?string $family, array $contextLocales): MessageBag
    {
        $contextLocalesStr = implode(', ', $contextLocales);

        $systemMessage = new SystemMessage(
            'You are a name transliteration assistant. ' .
            'Detect the script/language of a person\'s name and provide a transliteration ' .
            'into one of the specified target languages. ' .
            'Always respond with ONLY valid JSON or the word null — no explanation, no markdown.'
        );

        $prompt = sprintf(
            "Name: given=\"%s\", family=\"%s\"\n" .
            "Context: The user works with these languages: [%s].\n" .
            "Suggest transliteration into ONE of the alternative languages from this list only.\n" .
            "Do not suggest languages outside the list.\n\n" .
            "Return ONLY valid JSON (no explanation):\n" .
            "{\"detectedLocale\":\"ru\",\"suggestedLocale\":\"lv\",\"given\":\"Jānis\",\"family\":\"Bērziņš\"}\n\n" .
            "Rules:\n" .
            "- Use ONLY 2-letter ISO 639-1 codes (ru, lv, en, de...). Never \"Russian\", \"rus\", \"ru-RU\".\n" .
            "- If transliteration is impossible, unnecessary, or target language is not in the list — return null (not JSON, literally the word null).",
            addslashes((string) $given),
            addslashes((string) $family),
            $contextLocalesStr,
        );

        $userMessage = new UserMessage(new Text($prompt));

        return new MessageBag($systemMessage, $userMessage);
    }
}
