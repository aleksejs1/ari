<?php

namespace App\Dto\ContactGraph;

use Symfony\Component\Serializer\Annotation\Groups;

class GraphLink
{
    public function __construct(
        #[Groups(['contact_graph:read'])]
        public int $source,
        #[Groups(['contact_graph:read'])]
        public int $target,
    ) {
    }
}
