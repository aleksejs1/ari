<?php

namespace App\Dto\ContactGraph;

use Symfony\Component\Serializer\Annotation\Groups;

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
