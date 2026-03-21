<?php

declare(strict_types=1);

namespace Ari\EventSubscriber;

use Ari\Entity\User;
use Ari\Security\ApiKeyToken;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Applies per-user rate limiting to sensitive write endpoints for JWT-authenticated users.
 *
 * API-key requests are handled separately by ApiKeyRateLimitSubscriber.
 * This subscriber targets the three most abuse-prone operations:
 *   - Playbook activation  (contact_playbook_post)
 *   - Task completion      (contact_task_patch)
 *   - SMS backup upload    (api_sms_backup_import)
 */
final class JwtUserRateLimiterSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly LoggerInterface $logger,
        #[Autowire(service: 'limiter.playbook_activation')]
        private readonly RateLimiterFactory $playbookActivationLimiter,
        #[Autowire(service: 'limiter.task_completion')]
        private readonly RateLimiterFactory $taskCompletionLimiter,
        #[Autowire(service: 'limiter.sms_import')]
        private readonly RateLimiterFactory $smsImportLimiter,
    ) {
    }

    #[\Override]
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onRequest', -10], // after auth (same priority as ApiKeyRateLimitSubscriber)
        ];
    }

    public function onRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        // API-key requests have their own rate limiter; skip them here.
        $token = $this->tokenStorage->getToken();
        if ($token instanceof ApiKeyToken) {
            return;
        }

        // Only apply to authenticated JWT users.
        $user = $token?->getUser();
        if (!$user instanceof User) {
            return;
        }

        $route = $event->getRequest()->attributes->get('_route');
        if (!is_string($route)) {
            return;
        }

        if ('contact_playbook_post' === $route) {
            $limiterFactory = $this->playbookActivationLimiter;
        } elseif ('contact_task_patch' === $route) {
            $limiterFactory = $this->taskCompletionLimiter;
        } elseif ('api_sms_backup_import' === $route) {
            $limiterFactory = $this->smsImportLimiter;
        } else {
            return;
        }

        $userId = $user->getId();
        if (null === $userId) {
            // Should not happen: an authenticated User must always have a persisted ID.
            // Log as warning — indicates a broken authentication flow if seen in production.
            $this->logger->warning('jwt_rate_limiter: authenticated User has no ID, skipping rate limit', ['route' => $route]);

            return;
        }

        $limiter = $limiterFactory->create((string) $userId);
        $limit = $limiter->consume(1);

        if (!$limit->isAccepted()) {
            $retryAfterTs = $limit->getRetryAfter()->getTimestamp();
            $response = new JsonResponse(
                ['code' => 429, 'message' => 'Rate limit exceeded.'],
                Response::HTTP_TOO_MANY_REQUESTS,
            );
            $response->headers->set('X-RateLimit-Limit', (string) $limit->getLimit());
            $response->headers->set('X-RateLimit-Remaining', (string) max(0, $limit->getRemainingTokens()));
            $response->headers->set('X-RateLimit-Reset', (string) $retryAfterTs);
            // RFC 7231 §7.1.3 — Retry-After in seconds (relative delay, not absolute timestamp).
            $response->headers->set('Retry-After', (string) max(0, $retryAfterTs - time()));
            $event->setResponse($response);
        }
    }
}
