<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\ContactGraph;
use Ari\Dto\ContactGraph\GraphLink;
use Ari\Dto\ContactGraph\GraphNode;
use Ari\Entity\Contact;
use Ari\Entity\ContactRelation;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @implements ProviderInterface<ContactGraph>
 */
class ContactGraphProvider implements ProviderInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param array<string, mixed> $uriVariables
     * @param array<string, mixed> $context
     */
    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ContactGraph
    {
        $contactId = (int) ($context['filters']['contactId'] ?? 0);
        $level = (int) ($context['filters']['level'] ?? 1);
        $groupId = (int) ($context['filters']['groupId'] ?? 0);

        $contactRepository = $this->entityManager->getRepository(Contact::class);
        $relationRepository = $this->entityManager->getRepository(ContactRelation::class);

        if ($contactId > 0) {
            return $this->getGraphByLevel($contactId, $level);
        }

        if ($groupId > 0) {
            return $this->getGraphByGroup($groupId);
        }

        $contacts = $contactRepository->findAll();
        $relations = $relationRepository->findAll();

        return $this->buildGraph($contacts, $relations);
    }

    /**
     * @param Contact[] $contacts
     * @param ContactRelation[] $relations
     */
    private function buildGraph(array $contacts, array $relations): ContactGraph
    {
        $nodes = [];
        foreach ($contacts as $contact) {
            $nodes[] = new GraphNode(
                id: (int) $contact->getId(),
                user: $contact->getDisplayName(),
            );
        }

        $links = [];
        foreach ($relations as $relation) {
            $links[] = new GraphLink(
                source: (int) $relation->getContact()?->getId(),
                target: (int) $relation->getPerson()?->getId(),
            );
        }

        return new ContactGraph(nodes: $nodes, links: $links);
    }

    private function getGraphByLevel(int $contactId, int $level): ContactGraph
    {
        $contactRepository = $this->entityManager->getRepository(Contact::class);
        $relationRepository = $this->entityManager->getRepository(ContactRelation::class);

        $rootContact = $contactRepository->find($contactId);
        if (null === $rootContact) {
            return new ContactGraph();
        }

        $relevantContactIds = [$contactId];
        $traversedIds = [$contactId];

        for ($i = 0; $i < $level; ++$i) {
            $nextLevelIds = [];
            $relations = $relationRepository->createQueryBuilder('cr')
                ->where('cr.contact IN (:ids) OR cr.person IN (:ids)')
                ->setParameter('ids', $traversedIds)
                ->getQuery()
                ->getResult();

            foreach ($relations as $relation) {
                $c1 = (int) $relation->getContact()?->getId();
                $c2 = (int) $relation->getPerson()?->getId();
                if (!in_array($c1, $relevantContactIds, true)) {
                    $relevantContactIds[] = $c1;
                    $nextLevelIds[] = $c1;
                }
                if (!in_array($c2, $relevantContactIds, true)) {
                    $relevantContactIds[] = $c2;
                    $nextLevelIds[] = $c2;
                }
            }
            $traversedIds = $nextLevelIds;
            if ([] === $traversedIds) {
                break;
            }
        }

        $contacts = $contactRepository->createQueryBuilder('c')
            ->where('c.id IN (:ids)')
            ->setParameter('ids', $relevantContactIds)
            ->getQuery()
            ->getResult();

        $relations = $relationRepository->createQueryBuilder('cr')
            ->where('cr.contact IN (:ids) AND cr.person IN (:ids)')
            ->setParameter('ids', $relevantContactIds)
            ->getQuery()
            ->getResult();

        return $this->buildGraph($contacts, $relations);
    }

    private function getGraphByGroup(int $groupId): ContactGraph
    {
        $contactRepository = $this->entityManager->getRepository(Contact::class);
        $relationRepository = $this->entityManager->getRepository(ContactRelation::class);

        // Get members of the group
        $members = $contactRepository->createQueryBuilder('c')
            ->join('c.contactGroups', 'cg')
            ->where('cg.groupResource = :groupId')
            ->setParameter('groupId', $groupId)
            ->getQuery()
            ->getResult();

        $memberIds = array_map(fn (Contact $c) => (int) $c->getId(), $members);
        if ([] === $memberIds) {
            return new ContactGraph();
        }

        // Get all relations where at least one side is a member
        $relations = $relationRepository->createQueryBuilder('cr')
            ->where('cr.contact IN (:ids) OR cr.person IN (:ids)')
            ->setParameter('ids', $memberIds)
            ->getQuery()
            ->getResult();

        $relevantContactIds = $memberIds;
        foreach ($relations as $relation) {
            $c1 = (int) $relation->getContact()?->getId();
            $c2 = (int) $relation->getPerson()?->getId();
            if (!in_array($c1, $relevantContactIds, true)) {
                $relevantContactIds[] = $c1;
            }
            if (!in_array($c2, $relevantContactIds, true)) {
                $relevantContactIds[] = $c2;
            }
        }

        $contacts = $contactRepository->createQueryBuilder('c')
            ->where('c.id IN (:ids)')
            ->setParameter('ids', $relevantContactIds)
            ->getQuery()
            ->getResult();

        return $this->buildGraph($contacts, $relations);
    }
}
