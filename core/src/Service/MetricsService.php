<?php

namespace Ari\Service;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Doctrine\DBAL\Types\Types;

/**
 * Collects all Prometheus gauge/counter values from the database.
 *
 * Uses DBAL directly (not ORM) so the Doctrine TenantFilter is not applied.
 * This is intentional: metrics are admin-scope aggregates over all tenants.
 * Access is protected at the HTTP layer by the METRICS_SECRET header check in MetricsController.
 */
class MetricsService
{
    public function __construct(private readonly Connection $connection) {}

    /**
     * Pending (un-delivered) message counts per named queue.
     *
     * @return array<string, int>
     */
    public function getQueueDepths(): array
    {
        try {
            $rows = $this->connection->fetchAllAssociative(
                'SELECT queue_name, COUNT(*) AS cnt FROM messenger_messages WHERE delivered_at IS NULL GROUP BY queue_name',
            );
            $depths = [];
            foreach ($rows as $row) {
                $depths[(string) $row['queue_name']] = (int) $row['cnt'];
            }

            return $depths;
        } catch (Exception) {
            return [];
        }
    }

    /**
     * Current size of the Messenger dead-letter (failed) queue.
     */
    public function getFailedMessageCount(): int
    {
        try {
            $raw = $this->connection->fetchOne(
                "SELECT COUNT(*) FROM messenger_messages WHERE queue_name = 'failed' AND delivered_at IS NULL",
            );

            return $raw !== false ? (int) $raw : 0;
        } catch (Exception) {
            return 0;
        }
    }

    /**
     * AI suggestion counts grouped by status and provider.
     *
     * @return list<array{status: string, provider: string, count: int}>
     */
    public function getAiSuggestionStats(): array
    {
        try {
            $rows = $this->connection->fetchAllAssociative(
                "SELECT status, COALESCE(provider_used, 'none') AS provider, COUNT(*) AS cnt FROM ai_suggestion GROUP BY status, provider_used",
            );
            $stats = [];
            foreach ($rows as $row) {
                $stats[] = [
                    'status'   => (string) $row['status'],
                    'provider' => (string) $row['provider'],
                    'count'    => (int) $row['cnt'],
                ];
            }

            return $stats;
        } catch (Exception) {
            return [];
        }
    }

    /**
     * Notification delivery counts grouped by channel type and status.
     *
     * @return list<array{channel: string, result: string, count: int}>
     */
    public function getNotificationDeliveryStats(): array
    {
        try {
            $rows = $this->connection->fetchAllAssociative(
                'SELECT nc.type AS channel, nq.status AS result, COUNT(*) AS cnt '
                . 'FROM notification_queue nq '
                . 'JOIN notification_channel nc ON nq.channel_id = nc.id '
                . 'GROUP BY nc.type, nq.status',
            );
            $stats = [];
            foreach ($rows as $row) {
                $stats[] = [
                    'channel' => (string) $row['channel'],
                    'result'  => (string) $row['result'],
                    'count'   => (int) $row['cnt'],
                ];
            }

            return $stats;
        } catch (Exception) {
            return [];
        }
    }

    /**
     * Count of distinct tenants with at least one audit log entry in the last 24 hours.
     */
    public function getActiveTenantCount(): int
    {
        try {
            $since = new \DateTimeImmutable('-24 hours');
            $raw = $this->connection->fetchOne(
                'SELECT COUNT(DISTINCT tenant_id) FROM audit_log WHERE created_at > ?',
                [$since],
                [Types::DATETIME_IMMUTABLE],
            );

            return $raw !== false ? (int) $raw : 0;
        } catch (Exception) {
            return 0;
        }
    }

    /**
     * Count of tenants whose first audit log entry appeared in the last 24 hours
     * (proxy for new user registrations, since the `user` table has no created_at column).
     */
    public function getNewTenantCount(): int
    {
        try {
            $since = new \DateTimeImmutable('-24 hours');
            $raw = $this->connection->fetchOne(
                'SELECT COUNT(*) FROM (SELECT tenant_id FROM audit_log GROUP BY tenant_id HAVING MIN(created_at) > ?) AS new_tenants',
                [$since],
                [Types::DATETIME_IMMUTABLE],
            );

            return $raw !== false ? (int) $raw : 0;
        } catch (Exception) {
            return 0;
        }
    }

    /**
     * Cumulative count of LOGIN_FAILED audit log entries.
     * Returns 0 until login-failure tracking is wired to AuditLog.
     */
    public function getFailedLoginCount(): int
    {
        try {
            $raw = $this->connection->fetchOne(
                "SELECT COUNT(*) FROM audit_log WHERE action = 'LOGIN_FAILED'",
            );

            return $raw !== false ? (int) $raw : 0;
        } catch (Exception) {
            return 0;
        }
    }
}
