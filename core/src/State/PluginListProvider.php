<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\PluginList;
use Ari\Entity\User;
use Ari\Kernel;
use Ari\Service\Marketplace\PluginMarketplaceService;
use Ari\Service\UserPluginService;
use Composer\Semver\Semver;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * @implements ProviderInterface<PluginList>
 */
final readonly class PluginListProvider implements ProviderInterface
{
    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        private string $projectDir,
        private Security $security,
        private UserPluginService $userPluginService,
        private PluginMarketplaceService $marketplaceService,
    ) {}

    /**
     * @param array<string, mixed> $uriVariables
     * @param array<string, mixed> $context
     */
    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): PluginList
    {
        // 1. Check global setting
        if (!$this->marketplaceService->isCommunityPluginsEnabled()) {
            return new PluginList();
        }

        // 2. Get User and Active Plugins
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return new PluginList();
        }

        // 3. Filter by UserPlugin
        // Implicitly filters by tenant via Find criteria when passing entity or if filter enabled.
        // UserPlugin has 'tenant' relation. Repository findBy relies on exact match.
        $activePlugins = $this->userPluginService->getActivePluginsForUser($user);
        $activePluginIds = array_map(fn($p) => $p->getPluginId(), $activePlugins);

        // Optimization: If no active plugins, return empty list
        if ($activePluginIds === []) {
            return new PluginList();
        }

        $pluginsDir = $this->projectDir . '/plugins';

        if (!is_dir($pluginsDir)) {
            return new PluginList();
        }

        $plugins = [];
        $iterator = new \DirectoryIterator($pluginsDir);

        foreach ($iterator as $fileInfo) {
            if ($fileInfo->isDot() || !$fileInfo->isDir()) {
                continue;
            }

            $pluginPath = $fileInfo->getPathname();
            $configPath = $pluginPath . '/plugin.json';

            if (!file_exists($configPath)) {
                continue;
            }

            $config = $this->loadPluginConfig($configPath);

            if ($config === null) {
                continue;
            }

            // Filter by user activation
            if (!in_array($config['name'], $activePluginIds, true)) {
                continue;
            }

            if (($config['frontend']['enabled'] ?? false) !== true) {
                continue;
            }

            if (isset($config['require']['ari/core'])) {
                $constraint = $config['require']['ari/core'];
                if (!Semver::satisfies(Kernel::VERSION, $constraint)) {
                    continue;
                }
            }

            $plugins[] = [
                'id' => $config['name'],
                'version' => $config['version'],
                'displayName' => $config['displayName'] ?? $config['name'],
                'description' => $config['description'] ?? '',
                'author' => $config['author'] ?? '',
                'enabled' => true,
                'url' => $this->resolvePluginUrl($config),
            ];
        }

        return new PluginList($plugins);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function loadPluginConfig(string $configPath): ?array
    {
        try {
            $contents = file_get_contents($configPath);
            if ($contents === false) {
                return null;
            }

            $config = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);

            if (!is_array($config)) {
                return null;
            }

            return $config;
        } catch (\JsonException) {
            return null;
        }
    }

    /**
     * @param array<string, mixed> $config
     */
    private function resolvePluginUrl(array $config): string
    {
        $devUrl = $config['frontend']['devUrl'] ?? null;
        if (is_string($devUrl) && $devUrl !== '') {
            return $devUrl;
        }

        $entry = $config['frontend']['entry'] ?? 'ui/dist/index.js';
        $pluginName = $config['name'];
        $fileName = basename($entry);

        return "/plugins/{$pluginName}/{$fileName}";
    }
}
