<?php

namespace Ari\EventListener;

use Ari\Entity\RefreshToken;
use Ari\Entity\User;
use Ari\Repository\UserRepository;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\HttpFoundation\RequestStack;

#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: RefreshToken::class)]
class RefreshTokenListener
{
    public function __construct(
        private RequestStack $requestStack,
        private UserRepository $userRepository,
    ) {
    }

    public function prePersist(RefreshToken $refreshToken, PrePersistEventArgs $event): void
    {
        $request = $this->requestStack->getCurrentRequest();
        if (null !== $request) {
            $refreshToken->setIpAddress($request->getClientIp());
            $refreshToken->setUserAgent($request->headers->get('User-Agent'));
        }

        if (null === $refreshToken->getTenant()) {
            $username = $refreshToken->getUsername();
            if (null !== $username && '' !== $username) {
                // In this app, getUserIdentifier() returns UUID.
                // So the refresh token 'username' field actually holds the UUID.
                $user = $this->userRepository->findOneBy(['uuid' => $username]);
                if ($user instanceof User) {
                    $refreshToken->setTenant($user);
                }
            }
        }
    }
}
