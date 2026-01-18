<?php

namespace App\Service;

use App\Entity\AuditLog;
use App\Entity\Contact;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;

class ContactTimelineService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @return Collection<int, AuditLog>
     */
    public function getTimeline(int|string $contactId): Collection
    {
        $contactId = (string) $contactId;
        $auditRepo = $this->entityManager->getRepository(AuditLog::class);

        // Fetch logs for the Contact itself
        $contactLogs = $auditRepo->findBy([
            'entityType' => Contact::class,
            'entityId' => $contactId,
        ]);

        // Fetch logs for child entities via owner fields
        $childLogs = $auditRepo->findBy([
            'ownerEntityType' => Contact::class,
            'ownerEntityId' => $contactId,
        ]);

        $allLogs = array_merge($contactLogs, $childLogs);

        // Sort by createdAt DESC
        usort($allLogs, function (AuditLog $a, AuditLog $b) {
            $dateComparison = $b->getCreatedAt() <=> $a->getCreatedAt();

            if (0 === $dateComparison) {
                // If dates are equal, Contact entity type should come last
                $aIsContact = Contact::class === $a->getEntityType() && 'INSERT' === $a->getAction();
                $bIsContact = Contact::class === $b->getEntityType() && 'INSERT' === $b->getAction();

                if ($aIsContact && !$bIsContact) {
                    return 1; // $a comes after $b
                }
                if (!$aIsContact && $bIsContact) {
                    return -1; // $b comes after $a
                }
            }

            return $dateComparison;
        });

        /** @var Collection<int, AuditLog> $collection */
        $collection = new ArrayCollection($allLogs);

        return $collection;
    }
}
