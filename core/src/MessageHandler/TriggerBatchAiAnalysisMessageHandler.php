<?php

namespace Ari\MessageHandler;

use Ari\Message\TriggerBatchAiAnalysisMessage;
use Ari\Repository\ContactNameRepository;
use Ari\Repository\UserRepository;
use Ari\Service\Ai\AiSuggestionService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\MessageBusInterface;

/**
 * Iterates ContactNames for a given tenant in batches of 500 and dispatches
 * GenerateAiSuggestionMessage for each eligible name.
 *
 * Uses continuation passing via self-dispatch: after processing a batch,
 * dispatches TriggerBatchAiAnalysisMessage(tenantId, offset + 500) if more remain.
 * This prevents PHP timeout and memory exhaustion for large datasets.
 *
 * Flow:
 * POST /api/ai_suggestions/batch
 *   → dispatch TriggerBatchAiAnalysisMessage(tenantId, offset=0)
 *       → process 500 names, dispatch GenerateAiSuggestionMessage × N
 *       → dispatch TriggerBatchAiAnalysisMessage(tenantId, offset=500)
 *           → process next 500 names...
 *           → ... until empty batch
 */
#[AsMessageHandler]
final class TriggerBatchAiAnalysisMessageHandler
{
    private const BATCH_SIZE = 500;

    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly ContactNameRepository $contactNameRepository,
        private readonly AiSuggestionService $aiSuggestionService,
        private readonly MessageBusInterface $messageBus,
    ) {
    }

    public function __invoke(TriggerBatchAiAnalysisMessage $message): void
    {
        $tenant = $this->userRepository->find($message->tenantId);
        if (null === $tenant) {
            return;
        }

        $batch = $this->contactNameRepository->findByTenantForBatch(
            $tenant,
            self::BATCH_SIZE,
            $message->offset,
        );

        foreach ($batch as $contactName) {
            $this->aiSuggestionService->maybeDispatch($contactName);
        }

        // If a full batch was returned, there may be more records — continue processing
        if (\count($batch) === self::BATCH_SIZE) {
            $this->messageBus->dispatch(
                new TriggerBatchAiAnalysisMessage($message->tenantId, $message->offset + self::BATCH_SIZE),
            );
        }
    }
}
