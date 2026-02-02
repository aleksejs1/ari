<?php

namespace Ari\Service;

use Ari\Entity\User;
use Ari\Entity\UserPlugin;
use Ari\Repository\UserPluginRepository;
use Doctrine\ORM\EntityManagerInterface;

class UserPluginService
{
    public function __construct(
        private readonly UserPluginRepository $userPluginRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {}

    /**
     * @return UserPlugin[]
     */
    public function getPluginsForUser(User $user): array
    {
        return $this->userPluginRepository->findBy(['tenant' => $user]);
    }

    /**
     * @return UserPlugin[]
     */
    public function getActivePluginsForUser(User $user): array
    {
        return $this->userPluginRepository->findBy(['tenant' => $user, 'enabled' => true]);
    }

    public function findUserPlugin(User $user, string $pluginId): ?UserPlugin
    {
        return $this->userPluginRepository->findOneBy(['tenant' => $user, 'pluginId' => $pluginId]);
    }

    public function activatePlugin(User $user, string $pluginId): void
    {
        $plugin = $this->findUserPlugin($user, $pluginId);

        if ($plugin === null) {
            $plugin = new UserPlugin();
            $plugin->setTenant($user);
            $plugin->setPluginId($pluginId);
            $this->entityManager->persist($plugin);
        }

        $plugin->setEnabled(true);
        $this->entityManager->flush();
    }

    public function deactivatePlugin(User $user, string $pluginId): void
    {
        $plugin = $this->findUserPlugin($user, $pluginId);

        if ($plugin !== null) {
            $plugin->setEnabled(false);
            $this->entityManager->flush();
        }
    }
}
