<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\ContactTimeline;
use App\Entity\AuditLog;
use App\Entity\Contact;
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

        $auditRepo = $this->entityManager->getRepository(AuditLog::class);

        // Fetch logs for the Contact itself
        $contactLogs = $auditRepo->findBy([
            'entityType' => Contact::class,
            'entityId' => $id,
        ]);

        // Fetch logs for child entities via owner fields
        $childLogs = $auditRepo->findBy([
            'ownerEntityType' => Contact::class,
            'ownerEntityId' => $id,
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

        // Ensure the array is indexed sequentially to avoid int<0, max> variance issues if possible,
        // though array_merge does this.
        // We explicitly tell Psalm that this is a Collection of AuditLogs with integer keys.

        /** @var ArrayCollection<int, AuditLog> $collection */
        $collection = new ArrayCollection($allLogs);

        return new ContactTimeline(
            (int) $id,
            $collection
        );
    }
}
