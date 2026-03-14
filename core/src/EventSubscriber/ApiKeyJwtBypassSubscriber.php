<?php

namespace Ari\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Moves Bearer ari_* tokens from Authorization to a private header before
 * Symfony's security firewall runs. This prevents the JWT authenticator
 * from attempting (and failing) to parse API key tokens, which would stop
 * the authenticator chain before ApiKeyAuthenticator can handle the request.
 *
 * The ApiKeyAuthenticator reads from the same private header.
 */
final class ApiKeyJwtBypassSubscriber implements EventSubscriberInterface
{
    public const API_KEY_PREFIX = 'ari_';
    public const BYPASS_HEADER = 'X-Ari-Api-Key-Token';

    #[\Override]
    public static function getSubscribedEvents(): array
    {
        return [
            // Priority 500 > security firewall priority (8) — runs first
            KernelEvents::REQUEST => ['onRequest', 500],
        ];
    }

    public function onRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $authHeader = $request->headers->get('Authorization', '');

        if (str_starts_with($authHeader, 'Bearer ' . self::API_KEY_PREFIX)) {
            // Move the API key token out of Authorization so JWT does not see it.
            // ApiKeyAuthenticator reads from BYPASS_HEADER.
            $request->headers->set(self::BYPASS_HEADER, $authHeader);
            $request->headers->remove('Authorization');
        }
    }
}
