<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\ContactTimeline;
use App\Service\ContactTimelineService;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<ContactTimeline>
 */
class ContactTimelineProvider implements ProviderInterface
{
    public function __construct(
        private readonly ContactTimelineService $timelineService,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $id = $uriVariables['id'] ?? null;
        if (null === $id) {
            throw new NotFoundHttpException('Contact not found');
        }

        $logs = $this->timelineService->getTimeline($id);

        return new ContactTimeline(
            (int) $id,
            $logs,
        );
    }
}
