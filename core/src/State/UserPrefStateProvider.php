<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\Entity\User;
use Ari\Entity\UserPref;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<UserPref>
 */
class UserPrefStateProvider implements ProviderInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly Security $security,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $type = $uriVariables['type'] ?? null;
        if (!is_string($type) || '' === $type) {
            return null;
        }

        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return null;
        }

        $userPref = $this->entityManager->getRepository(UserPref::class)->findOneBy(['user' => $user, 'type' => $type]);

        if (null !== $userPref) {
            return $userPref;
        }

        // Logic for default values
        if (in_array($type, UserPref::ALLOWED_TYPES, true)) {
            $userPref = new UserPref();
            $userPref->setUser($user);
            $userPref->setType($type);
            $userPref->setValue(UserPref::DEFAULTS[$type]);

            // Set tenant if applicable, usually handled by listeners but for transient object we might need it?
            // If the user has a tenant, we might want to set it.
            // However, TenantAwareTrait implies database column.
            // If we just return transient object, it's fine for GET.
            // For PUT, the persister will handle saving.

            return $userPref;
        }

        throw new NotFoundHttpException('User pref type not found or not allowed.');
    }
}
