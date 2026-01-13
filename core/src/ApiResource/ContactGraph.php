<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Dto\ContactGraph\GraphLink;
use App\Dto\ContactGraph\GraphNode;
use App\State\ContactGraphProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'ContactGraph',
    operations: [
        new Get(
            uriTemplate: '/contact-graph',
            provider: ContactGraphProvider::class,
            normalizationContext: ['groups' => ['contact_graph:read']],
            security: "is_granted('ROLE_USER')",
            name: 'get_contact_graph',
        ),
    ],
)]
class ContactGraph
{
    public function __construct(
        /** @var \App\Dto\ContactGraph\GraphNode[] */
        #[Groups(['contact_graph:read'])]
        public array $nodes = [],
        /** @var \App\Dto\ContactGraph\GraphLink[] */
        #[Groups(['contact_graph:read'])]
        public array $links = [],
    ) {
    }
}
