<?php

namespace Ari\EventSubscriber;

use Ari\Security\ApiKeyToken;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\TerminateEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

final class ApiKeyUsageSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly TokenStorageInterface $tokenStorage,
        private readonly EntityManagerInterface $em,
    ) {
    }

    #[\Override]
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::TERMINATE => 'onTerminate',
        ];
    }

    public function onTerminate(TerminateEvent $event): void
    {
        $token = $this->tokenStorage->getToken();
        if (!$token instanceof ApiKeyToken) {
            return;
        }

        try {
            $this->em->getConnection()->executeStatement(
                'UPDATE api_key SET last_used_at = ?, last_used_ip = ? WHERE id = ?',
                [
                    (new \DateTime())->format('Y-m-d H:i:s'),
                    $event->getRequest()->getClientIp(),
                    $token->getApiKeyId(),
                ],
            );
        } catch (\Throwable) {
            // Non-critical — never fail the response
        }
    }
}
