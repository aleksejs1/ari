<?php

namespace Ari\Message;

final readonly class TriggerBatchAiAnalysisMessage
{
    public function __construct(
        public int $tenantId,
        public int $offset = 0,
    ) {
    }
}
