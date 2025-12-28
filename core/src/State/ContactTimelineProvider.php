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



        $auditRepo = $this->entityManager->getRepository(AuditLog::class);

        // Fetch logs for the Contact itself
        $contactLogs = $auditRepo->findBy([
            'entityType' => Contact::class,
            'entityId' => $contact->getId(),
        ]);

        // Fetch logs for child entities via owner fields
        $childLogs = $auditRepo->findBy([
            'ownerEntityType' => Contact::class,
            'ownerEntityId' => $contact->getId(),
        ]);

        $allLogs = array_merge($contactLogs, $childLogs);

        // Sort by createdAt DESC
        usort($allLogs, function (AuditLog $a, AuditLog $b) {
            $dateComparison = $b->getCreatedAt() <=> $a->getCreatedAt();

            if (0 === $dateComparison) {
                // If dates are equal, Contact entity type should come last
                $aIsContact = $a->getEntityType() === Contact::class;
                $bIsContact = $b->getEntityType() === Contact::class;

                if ($aIsContact && !$bIsContact) {
                    return 1; // $a comes after $b
                }
                if (!$aIsContact && $bIsContact) {
                    return -1; // $b comes after $a
                }
            }

            return $dateComparison;
        });

        /* @var array<int, AuditLog> $allLogs */
        /** @psalm-suppress InvalidArgument */
        return new ContactTimeline(
            (int) $id,
            new ArrayCollection($allLogs)
        );
    }
}
