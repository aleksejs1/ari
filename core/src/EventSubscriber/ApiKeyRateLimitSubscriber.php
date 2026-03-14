<?php

namespace Ari\EventSubscriber;

use Ari\Security\ApiKeyToken;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

final class ApiKeyRateLimitSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        #[Autowire(service: 'limiter.api_key_requests')]
        private readonly RateLimiterFactory $limiterFactory,
    ) {
    }

    #[\Override]
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onRequest', -10],   // after auth (priority 8)
            KernelEvents::RESPONSE => ['onResponse', 0],
        ];
    }

    public function onRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $token = $this->tokenStorage->getToken();
        if (!$token instanceof ApiKeyToken) {
            return;
        }

        $limiter = $this->limiterFactory->create($token->getApiKeyId());
        $limit = $limiter->consume(1);

        // Store for response headers
        $event->getRequest()->attributes->set('_api_key_rate_limit', $limit);

        if (!$limit->isAccepted()) {
            $response = new JsonResponse(
                ['code' => 429, 'message' => 'API key rate limit exceeded.'],
                Response::HTTP_TOO_MANY_REQUESTS,
            );
            $this->addRateLimitHeaders($response, $limit);
            $event->setResponse($response);
        }
    }

    public function onResponse(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $limit = $event->getRequest()->attributes->get('_api_key_rate_limit');
        if (null === $limit) {
            return;
        }

        $this->addRateLimitHeaders($event->getResponse(), $limit);
    }

    private function addRateLimitHeaders(Response $response, \Symfony\Component\RateLimiter\RateLimit $limit): void
    {
        $response->headers->set('X-RateLimit-Limit', (string) $limit->getLimit());
        $response->headers->set('X-RateLimit-Remaining', (string) max(0, $limit->getRemainingTokens()));
        $response->headers->set('X-RateLimit-Reset', (string) $limit->getRetryAfter()->getTimestamp());
    }
}
