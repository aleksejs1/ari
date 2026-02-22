<?php

namespace Ari\Message;

final readonly class GenerateAiSuggestionMessage
{
    public function __construct(
        public int $contactNameId,
        public string $sourceHash,
    ) {
    }
}
