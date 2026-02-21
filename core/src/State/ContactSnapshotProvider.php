<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\ContactSnapshot;
use Ari\Service\ContactSnapshotService;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<ContactSnapshot>
 */
class ContactSnapshotProvider implements ProviderInterface
{
    public function __construct(
        private readonly ContactSnapshotService $snapshotService,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $contactId = $uriVariables['contactId'] ?? null;
        $logId = $uriVariables['logId'] ?? null;

        if (null === $contactId || null === $logId) {
            throw new NotFoundHttpException('Contact or log not found');
        }

        $snapshot = $this->snapshotService->getSnapshotAtLog((int) $contactId, (int) $logId);

        if (null === $snapshot) {
            throw new NotFoundHttpException('Snapshot not found: log does not belong to this contact');
        }

        return new ContactSnapshot(
            id: sprintf('%s_%s', $contactId, $logId),
            contactId: (int) $contactId,
            logId: (int) $logId,
            snapshot: $snapshot,
        );
    }
}
