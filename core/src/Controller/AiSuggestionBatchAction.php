<?php

namespace Ari\Controller;

use Ari\Entity\User;
use Ari\Service\Ai\AiSuggestionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;

/**
 * POST /api/ai_suggestions/batch
 *
 * Immediately returns 202 Accepted and delegates to AiSuggestionService::dispatchBatch(),
 * which dispatches TriggerBatchAiAnalysisMessage to the ai_async transport.
 * Actual work (iterating ContactNames, dispatching per-name messages) runs in the background.
 */
#[AsController]
final class AiSuggestionBatchAction extends AbstractController
{
    public function __construct(
        private readonly AiSuggestionService $aiSuggestionService,
    ) {
    }

    public function __invoke(): JsonResponse
    {
        $user = $this->getUser();
        \assert($user instanceof User);

        $this->aiSuggestionService->dispatchBatch($user);

        return new JsonResponse(null, JsonResponse::HTTP_ACCEPTED);
    }
}
