<?php

namespace Ari\Service\Ai;

use Ari\Entity\ContactName;
use Ari\Entity\User;
use Ari\Message\GenerateAiSuggestionMessage;
use Ari\Message\TriggerBatchAiAnalysisMessage;
use Ari\Repository\AiSuggestionRepository;
use Symfony\Component\Messenger\MessageBusInterface;

final class AiSuggestionService
{
    /** @var list<string> */
    private const ALLOWED_LOCALES = ['ru', 'lv', 'en', 'de', 'fr', 'lt', 'et', 'pl', 'uk'];

    public function __construct(
        private readonly LlmClientInterface $llmClient,
        private readonly AiSuggestionRepository $repository,
        private readonly MessageBusInterface $messageBus,
    ) {
    }

    /**
     * Check eligibility, dedup, and dispatch a GenerateAiSuggestionMessage if applicable.
     * Silently exits if AI is unavailable or the name does not qualify.
     */
    public function maybeDispatch(ContactName $contactName): void
    {
        if (!$this->llmClient->isAvailable()) {
            return;
        }

        $id = $contactName->getId();
        if (null === $id) {
            return;
        }

        $tenant = $contactName->getTenant();
        if (null === $tenant) {
            return;
        }

        if (!$this->isEligibleForSuggestion($contactName->getGiven(), $contactName->getFamily(), $contactName->getLocale())) {
            return;
        }

        $sourceHash = $this->computeSourceHash($contactName->getGiven(), $contactName->getFamily());

        $existing = $this->repository->findBySuggestionKey(
            $tenant,
            'contact_name',
            $id,
            'locale_alternative',
            $sourceHash,
        );

        if (null !== $existing) {
            return;
        }

        $this->messageBus->dispatch(new GenerateAiSuggestionMessage($id, $sourceHash));
    }

    /**
     * Returns pending suggestions for the given entity/tenant combination.
     * Called by AiSuggestionProvider (State layer cannot depend on Repository).
     *
     * @return list<\Ari\Entity\AiSuggestion>
     */
    public function findPendingByEntity(User $user, string $entityType, int $entityId): array
    {
        return $this->repository->findByEntityForTenant($user, $entityType, $entityId);
    }

    /**
     * Returns aggregated token/status stats for the given tenant.
     * Called by AiSuggestionStatsProvider (State layer cannot depend on Repository).
     *
     * @return array{pending: int, accepted: int, dismissed: int, error: int, skipped: int, tokensPrompt: int, tokensCompletion: int}
     */
    public function getStats(User $user): array
    {
        return $this->repository->getStatsByTenant($user);
    }

    /**
     * Dispatch TriggerBatchAiAnalysisMessage for the given tenant.
     * The handler iterates all ContactNames in batches and dispatches
     * GenerateAiSuggestionMessage for each eligible name.
     *
     * Returns immediately — actual work runs in the background (ai_async transport).
     */
    public function dispatchBatch(User $user): void
    {
        $id = $user->getId();
        if (null === $id) {
            return;
        }

        $this->messageBus->dispatch(new TriggerBatchAiAnalysisMessage($id));
    }

    /**
     * Guard clause: pre-filters names before dispatching to queue.
     * Prevents useless AI requests and avoids infinite loops when locale is already set.
     */
    public function isEligibleForSuggestion(?string $given, ?string $family, ?string $locale): bool
    {
        // Locale already set (manually or via a previous accepted suggestion) — AI not needed.
        // This also prevents an infinite loop: when 'accepted' creates a new ContactName with locale,
        // the subscriber would otherwise dispatch again for that new name.
        if (null !== $locale) {
            return false;
        }

        $combined = trim((string) $given . ' ' . (string) $family);

        if (mb_strlen($combined) < 3) {
            return false;
        }

        // Contains digits — unlikely to be a name
        if ((bool) preg_match('/\d/', $combined)) {
            return false;
        }

        // Contains special characters or emoji
        if ((bool) preg_match('/[^\p{L}\p{M}\s\-\'\.]/u', $combined)) {
            return false;
        }

        // Already contains both scripts — result would be unpredictable
        $hasCyrillic = (bool) preg_match('/\p{Cyrillic}/u', $combined);
        $hasLatin = (bool) preg_match('/\p{Latin}/u', $combined);
        if ($hasCyrillic && $hasLatin) {
            return false;
        }

        return true;
    }

    /**
     * Compute a stable hash for the name values.
     * Case-insensitive and whitespace-trimmed so that minor formatting changes
     * do not invalidate the deduplication record.
     *
     * Uses xxh128 (128-bit, 32 hex chars) instead of md5 — same output length,
     * no known collisions, not flagged by security scanners (M6).
     */
    public function computeSourceHash(?string $given, ?string $family): string
    {
        return hash('xxh128', mb_strtolower(trim((string) $given)) . '|' . mb_strtolower(trim((string) $family)));
    }

    /**
     * Validate that a locale string is a known ISO 639-1 code.
     * Rejects hallucinated values like "Russian", "ru-RU", "rus".
     */
    public function isValidLocale(?string $locale): bool
    {
        return null !== $locale && in_array($locale, self::ALLOWED_LOCALES, true);
    }
}
