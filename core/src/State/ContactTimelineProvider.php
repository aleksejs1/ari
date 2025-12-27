<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\ContactTimeline;
use App\Entity\AuditLog;
use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\ContactName;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<ContactTimeline>
 */
class ContactTimelineProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $id = $uriVariables['id'] ?? null;
        if (null === $id) {
            throw new NotFoundHttpException('Contact not found');
        }

        $contact = $this->entityManager->getRepository(Contact::class)->find($id);

        if (null === $contact) {
            throw new NotFoundHttpException('Contact not found');
        }

        // Collect IDs of related entities
        $relatedEntities = [];
        $relatedEntities[] = [
            'type' => Contact::class,
            'id' => $contact->getId(),
        ];

        foreach ($contact->getContactNames() as $name) {
            $relatedEntities[] = [
                'type' => ContactName::class,
                'id' => $name->getId(),
            ];
        }

        foreach ($contact->getContactDates() as $date) {
            $relatedEntities[] = [
                'type' => ContactDate::class,
                'id' => $date->getId(),
            ];
        }

        $allLogs = [];
        $auditRepo = $this->entityManager->getRepository(AuditLog::class);
        foreach ($relatedEntities as $entityInfo) {
            $logs = $auditRepo->findBy([
                'entityType' => $entityInfo['type'],
                'entityId' => $entityInfo['id'],
            ]);
            foreach ($logs as $log) {
                $allLogs[] = $log;
            }
        }

        // Sort by createdAt DESC
        usort($allLogs, function (AuditLog $a, AuditLog $b) {
            return $b->getCreatedAt() <=> $a->getCreatedAt();
        });

        /* @var array<int, AuditLog> $allLogs */
        /** @psalm-suppress InvalidArgument */
        return new ContactTimeline(
            (int) $id,
            new ArrayCollection($allLogs)
        );
    }
}
