<?php

namespace Ari\Service;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;

class HealthService implements HealthServiceInterface
{
    private const int WARN_THRESHOLD = 500;
    private const int ERROR_THRESHOLD = 1000;

    public function __construct(private readonly Connection $connection) {}

    /**
     * @return array{database: string, messenger_async: string, messenger_ai_async: string}
     */
    #[\Override]
    public function getStatus(): array
    {
        return [
            'database' => $this->checkDatabase(),
            'messenger_async' => $this->checkQueue('default'),
            'messenger_ai_async' => $this->checkQueue('ai_async'),
        ];
    }

    private function checkDatabase(): string
    {
        try {
            $this->connection->executeQuery('SELECT 1');

            return 'ok';
        } catch (Exception) {
            return 'error';
        }
    }

    private function checkQueue(string $queueName): string
    {
        try {
            $raw = $this->connection->fetchOne(
                'SELECT COUNT(*) FROM messenger_messages WHERE queue_name = ? AND delivered_at IS NULL',
                [$queueName]
            );
            $count = $raw !== false ? (int) $raw : 0;

            if ($count >= self::ERROR_THRESHOLD) {
                return 'error';
            }
            if ($count >= self::WARN_THRESHOLD) {
                return 'warn';
            }

            return 'ok';
        } catch (Exception) {
            return 'error';
        }
    }
}
