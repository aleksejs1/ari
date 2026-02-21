<?php

namespace Ari\Dto\ContactGraph;

use Symfony\Component\Serializer\Attribute\Groups;

class GraphNode
{
    public function __construct(
        #[Groups(['contact_graph:read'])]
        public int $id,
        #[Groups(['contact_graph:read'])]
        public string $user,
    ) {
    }
}
