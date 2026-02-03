<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\Entity\SystemSetting;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @implements ProviderInterface<SystemSetting>
 */
class SystemSettingProvider implements ProviderInterface
{
    private const DEFAULTS = [
        'community_plugins_enabled' => '0',
    ];

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {}

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $id = $uriVariables['id'] ?? null;
        if (!is_string($id)) {
            return null;
        }

        $setting = $this->entityManager->getRepository(SystemSetting::class)->find($id);

        if ($setting !== null) {
            return $setting;
        }

        if (array_key_exists($id, self::DEFAULTS)) {
            $setting = new SystemSetting();
            $setting->setId($id);
            $setting->setValue(self::DEFAULTS[$id]);
            // Persist the new entity so it is managed, preventing Proxy issues downstream
            $this->entityManager->persist($setting);
            return $setting;
        }

        return null;
    }
}
