<?php

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Parameter;
use Ari\Dto\ContactGraph\GraphLink;
use Ari\Dto\ContactGraph\GraphNode;
use Ari\State\ContactGraphProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'ContactGraph',
    normalizationContext: ['groups' => ['contact_graph:read']],
    operations: [
        new Get(
            uriTemplate: '/contact-graph',
            provider: ContactGraphProvider::class,
            security: "is_granted('ROLE_USER')",
            openapi: new Operation(
                parameters: [
                    new Parameter(
                        name: 'contactId',
                        in: 'query',
                        description: 'The ID of the contact to start the graph from.',
                        required: false,
                        schema: [
                            'type' => 'integer',
                        ],
                    ),
                    new Parameter(
                        name: 'level',
                        in: 'query',
                        description: 'Maximum distance from the root contact.',
                        required: false,
                        schema: [
                            'type' => 'integer',
                            'default' => 1,
                        ],
                    ),
                    new Parameter(
                        name: 'groupId',
                        in: 'query',
                        description: 'The ID of the group to filter contacts by.',
                        required: false,
                        schema: [
                            'type' => 'integer',
                        ],
                    ),
                ],
            ),
            name: 'get_contact_graph',
        ),
    ],
)]
class ContactGraph
{
    public function __construct(
        /** @var GraphNode[] */
        #[Groups(['contact_graph:read'])]
        public array $nodes = [],
        /** @var GraphLink[] */
        #[Groups(['contact_graph:read'])]
        public array $links = [],
    ) {
    }
}
