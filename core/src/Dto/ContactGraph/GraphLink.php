<?php

namespace Ari\Dto\ContactGraph;

use Symfony\Component\Serializer\Attribute\Groups;

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
