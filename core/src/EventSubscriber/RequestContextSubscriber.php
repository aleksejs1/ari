<?php

namespace Ari\EventSubscriber;

use Monolog\LogRecord;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Uid\Uuid;

/**
 * Enriches every Monolog log record with per-request context:
 *   - request_id     UUID v4 generated on each main request
 *   - ip_truncated   client IP with last octet zeroed (GDPR)
 *   - tenant_id_hash HMAC-SHA256 of the authenticated user identifier, truncated
 *                    to 16 hex chars (only when LOG_TENANT_HASH_KEY is set)
 *
 * Registered as both an event subscriber (to capture request data) and a
 * Monolog processor (to inject the data into log records).
 */
class RequestContextSubscriber implements EventSubscriberInterface
{
    private string $requestId = '';
    private string $ipTruncated = '';

    /** Warn only once per process when LOG_TENANT_HASH_KEY is not configured. */
    private static bool $warned = false;

    public function __construct(
        private readonly Security $security,
        #[Autowire('%log_tenant_hash_key%')]
        private readonly string $logTenantHashKey,
        private readonly LoggerInterface $logger,
    ) {}

    #[\Override]
    public static function getSubscribedEvents(): array
    {
        return [
            // Priority 255: run before the firewall (priority 8) so request_id is
            // set early; tenant_id_hash is resolved lazily in __invoke().
            KernelEvents::REQUEST => ['onRequest', 255],
        ];
    }

    public function onRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $this->requestId = Uuid::v4()->toRfc4122();
        $this->ipTruncated = $this->truncateIp($event->getRequest()->getClientIp() ?? '');

        if ($this->logTenantHashKey === '' && !self::$warned) {
            self::$warned = true;
            $this->logger->warning(
                'LOG_TENANT_HASH_KEY is not set — tenant IDs will be omitted from structured log context. Set this variable to anonymise logs.',
            );
        }
    }

    /**
     * Monolog processor: called for every log record in tagged channels.
     * Adds request context to the `extra` field of each record.
     */
    public function __invoke(LogRecord $record): LogRecord
    {
        $extra = array_merge($record->extra, [
            'request_id' => $this->requestId,
            'ip_truncated' => $this->ipTruncated,
        ]);

        if ($this->logTenantHashKey !== '') {
            $user = $this->security->getUser();
            if ($user !== null) {
                $extra['tenant_id_hash'] = substr(
                    hash_hmac('sha256', $user->getUserIdentifier(), $this->logTenantHashKey),
                    0,
                    16,
                );
            }
        }

        return $record->with(extra: $extra);
    }

    private function truncateIp(string $ip): string
    {
        if (str_contains($ip, ':')) {
            // IPv6: not truncated (structure too complex for simple last-segment zero)
            return $ip;
        }
        $pos = strrpos($ip, '.');
        if ($pos === false) {
            return $ip;
        }

        return substr_replace($ip, '0', $pos + 1);
    }
}
