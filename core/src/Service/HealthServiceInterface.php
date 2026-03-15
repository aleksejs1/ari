<?php

namespace Ari\Service;

interface HealthServiceInterface
{
    /**
     * @return array{database: string, messenger_async: string, messenger_ai_async: string}
     */
    public function getStatus(): array;
}
