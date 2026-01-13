<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\ContactGraph;
use App\Dto\ContactGraph\GraphLink;
use App\Dto\ContactGraph\GraphNode;
use App\Entity\Contact;
use App\Entity\ContactRelation;
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
        $contacts = $this->entityManager->getRepository(Contact::class)->findAll();
        $relations = $this->entityManager->getRepository(ContactRelation::class)->findAll();

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

        return new ContactGraph(
            nodes: $nodes,
            links: $links,
        );
    }
}
