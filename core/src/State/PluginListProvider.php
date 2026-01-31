<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\PluginList;
use App\Kernel;
use Composer\Semver\Semver;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * @implements ProviderInterface<PluginList>
 */
final readonly class PluginListProvider implements ProviderInterface
{
    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        private string $projectDir,
    ) {
    }

    /**
     * @param array<string, mixed> $uriVariables
     * @param array<string, mixed> $context
     */
    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): PluginList
    {
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
