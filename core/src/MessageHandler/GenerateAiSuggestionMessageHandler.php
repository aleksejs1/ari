<?php

namespace Ari\MessageHandler;

use Ari\Entity\AiSuggestion;
use Ari\Message\GenerateAiSuggestionMessage;
use Ari\Repository\ContactNameRepository;
use Ari\Service\Ai\AiSuggestionService;
use Ari\Service\Ai\LlmClientInterface;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\AI\Platform\Exception\RateLimitExceededException;
use Symfony\AI\Platform\Exception\RuntimeException as AiRuntimeException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Exception\RecoverableMessageHandlingException;
use Symfony\Component\RateLimiter\RateLimiterFactory;

/**
 * Processes a GenerateAiSuggestionMessage:
 * 1. Loads ContactName, checks freshness via sourceHash
 * 2. Calls the LLM client
 * 3. Validates the response (locale whitelist)
 * 4. Cross-checks against existing names (avoids duplicate suggestions)
 * 5. Persists the AiSuggestion entity
 *
 * Retry strategy (ai_async transport):
 * - RateLimitExceededException / connection errors → RecoverableMessageHandlingException (exponential backoff)
 * - Invalid JSON / locale garbage → status:error (no retry)
 * - Duplicate (UniqueConstraintViolation) → silently ignored
 */
#[AsMessageHandler]
final class GenerateAiSuggestionMessageHandler
{
    public function __construct(
        private readonly ContactNameRepository $contactNameRepository,
        private readonly AiSuggestionService $aiSuggestionService,
        private readonly LlmClientInterface $llmClient,
        private readonly EntityManagerInterface $entityManager,
        private readonly RateLimiterFactory $aiRequestsLimiter,
        #[Autowire('%ai_context_locales%')]
        private readonly string $aiContextLocales,
    ) {
    }

    public function __invoke(GenerateAiSuggestionMessage $message): void
    {
        // ── Step 1: Load ContactName ──────────────────────────────────────────
        $contactName = $this->contactNameRepository->find($message->contactNameId);
        if (null === $contactName) {
            // Entity deleted between dispatch and processing — nothing to do
            return;
        }

        $tenant = $contactName->getTenant();
        if (null === $tenant) {
            return;
        }

        // ── Step 2: Freshness check (race condition protection) ───────────────
        $currentHash = $this->aiSuggestionService->computeSourceHash(
            $contactName->getGiven(),
            $contactName->getFamily(),
        );
        if ($currentHash !== $message->sourceHash) {
            // Name changed since dispatch — discard; a new message will be dispatched
            return;
        }

        // ── Step 3: Rate limiter ──────────────────────────────────────────────
        $limiter = $this->aiRequestsLimiter->create('ai_global');
        if (!$limiter->consume(1)->isAccepted()) {
            throw new RecoverableMessageHandlingException('Internal AI rate limit exceeded — will retry');
        }

        // ── Step 4: Call LLM ──────────────────────────────────────────────────
        $contextLocales = array_filter(array_map('trim', explode(',', $this->aiContextLocales)), fn (string $s) => '' !== $s);
        try {
            $result = $this->llmClient->suggestLocaleAlternative(
                $contactName->getGiven(),
                $contactName->getFamily(),
                $contextLocales,
            );
        } catch (RateLimitExceededException $e) {
            throw new RecoverableMessageHandlingException('AI provider rate limit exceeded', 0, $e);
        } catch (AiRuntimeException $e) {
            // Connection, authentication, or other infrastructure errors — retry
            throw new RecoverableMessageHandlingException('AI request failed: '.$e->getMessage(), 0, $e);
        } catch (\Throwable $e) {
            // JSON parse errors, invalid response format — no retry
            $this->persistSuggestion($message, $tenant, 'error', [], null, null, null, null);

            return;
        }

        // ── Step 5: Null response = negative cache ────────────────────────────
        // Saves status:skipped so future /batch runs skip this name without calling AI again.
        // If the name changes later, the sourceHash changes and analysis runs again.
        if (null === $result) {
            $this->persistSuggestion($message, $tenant, 'skipped', [], null, null, null, null);

            return;
        }

        // ── Step 6: Validate locales from AI response ─────────────────────────
        $detectedLocale = isset($result['detectedLocale']) && \is_string($result['detectedLocale']) ? $result['detectedLocale'] : null;
        $suggestedLocale = isset($result['suggestedLocale']) && \is_string($result['suggestedLocale']) ? $result['suggestedLocale'] : null;

        if (!$this->aiSuggestionService->isValidLocale($detectedLocale)
            || !$this->aiSuggestionService->isValidLocale($suggestedLocale)) {
            // Garbage response (e.g., "Russian", "ru-RU") — save error, no retry
            $this->persistSuggestion($message, $tenant, 'error', $result, null, null, null, null);

            return;
        }

        // ── Step 7: Cross-check existing names ───────────────────────────────
        // Skip if the suggested name already exists. As a bonus, silently set
        // locale on existing names since the AI already spent tokens figuring it out.
        $contact = $contactName->getContact();
        if (null !== $contact) {
            $existingNames = $this->contactNameRepository->findBy(['contact' => $contact]);
            $suggestedGiven = isset($result['given']) && \is_string($result['given']) ? mb_strtolower(trim($result['given'])) : '';
            $suggestedFamily = isset($result['family']) && \is_string($result['family']) ? mb_strtolower(trim($result['family'])) : '';

            foreach ($existingNames as $existing) {
                $existingGiven = mb_strtolower(trim((string) $existing->getGiven()));
                $existingFamily = mb_strtolower(trim((string) $existing->getFamily()));

                if ($existingGiven === $suggestedGiven && $existingFamily === $suggestedFamily) {
                    // Suggested name already exists — enrich locales silently and skip
                    if (null === $existing->getLocale()) {
                        $existing->setLocale($suggestedLocale);
                    }
                    if (null === $contactName->getLocale()) {
                        $contactName->setLocale($detectedLocale);
                    }
                    $this->entityManager->flush();

                    return;
                }
            }
        }

        // ── Step 8: Persist suggestion ────────────────────────────────────────
        $payload = [
            'detectedLocale' => $detectedLocale,
            'suggestedLocale' => $suggestedLocale,
            'given' => $result['given'] ?? null,
            'family' => $result['family'] ?? null,
        ];

        $tokensPrompt = isset($result['tokensPrompt']) && \is_int($result['tokensPrompt']) ? $result['tokensPrompt'] : null;
        $tokensCompletion = isset($result['tokensCompletion']) && \is_int($result['tokensCompletion']) ? $result['tokensCompletion'] : null;
        $providerUsed = isset($result['providerUsed']) && \is_string($result['providerUsed']) ? $result['providerUsed'] : null;
        $modelUsed = isset($result['modelUsed']) && \is_string($result['modelUsed']) ? $result['modelUsed'] : null;

        $this->persistSuggestion(
            $message, $tenant, 'pending', $payload,
            $tokensPrompt, $tokensCompletion, $providerUsed, $modelUsed,
        );
    }

    /**
     * @param array<string, mixed> $payload
     */
    private function persistSuggestion(
        GenerateAiSuggestionMessage $message,
        \Ari\Entity\User $tenant,
        string $status,
        array $payload,
        ?int $tokensPrompt,
        ?int $tokensCompletion,
        ?string $providerUsed,
        ?string $modelUsed,
    ): void {
        $suggestion = new AiSuggestion(
            'contact_name',
            $message->contactNameId,
            'locale_alternative',
            $message->sourceHash,
        );
        $suggestion->setTenant($tenant);
        $suggestion->setStatus($status);
        $suggestion->setPayload($payload);
        $suggestion->setTokensPrompt($tokensPrompt);
        $suggestion->setTokensCompletion($tokensCompletion);
        $suggestion->setProviderUsed($providerUsed);
        $suggestion->setModelUsed($modelUsed);

        if (\in_array($status, ['accepted', 'dismissed', 'error', 'skipped'], true)) {
            $suggestion->setResolvedAt(new \DateTimeImmutable());
        }

        try {
            $this->entityManager->persist($suggestion);
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException) {
            // Another worker already saved this — ignore the duplicate
            $this->entityManager->clear();
        }
    }
}
