<?php

namespace Ari\Service\Marketplace;

use Ari\Kernel;
use Ari\Repository\SystemSettingRepository;
use Composer\Semver\Semver;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Process\Process;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class PluginMarketplaceService
{
    private Filesystem $filesystem;

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly PluginValidatorService $validator,
        private readonly SystemSettingRepository $systemSettingRepository,
        #[Autowire('%plugin_registry_url%')]
        private readonly string $registryUrl,
        #[Autowire('%kernel.project_dir%')]
        private readonly string $projectDir,
    ) {
        $this->filesystem = new Filesystem();
    }

    public function isCommunityPluginsEnabled(): bool
    {
        return '1' === $this->systemSettingRepository->getValue('community_plugins_enabled');
    }

    /**
     * Fetch the plugin registry from GitHub Pages and enrich with local install info.
     *
     * @return array{plugins: list<array<string, mixed>>}
     */
    public function fetchRegistry(): array
    {
        $response = $this->httpClient->request('GET', $this->registryUrl);
        $registry = $response->toArray();

        $plugins = $registry['plugins'] ?? [];
        if (!is_array($plugins)) {
            return ['plugins' => []];
        }

        $enriched = [];
        foreach ($plugins as $plugin) {
            if (!is_array($plugin) || !isset($plugin['id'])) {
                continue;
            }

            $enriched[] = $this->enrichPluginData($plugin);
        }

        return ['plugins' => $enriched];
    }

    /**
     * Fetch the README.md content and latest version for a plugin from its GitHub repo.
     *
     * @return array{content: string, latestVersion: ?string}
     */
    public function fetchReadme(string $pluginId): array
    {
        $registry = $this->fetchRegistry();
        $plugin = $this->findPluginInRegistry($registry, $pluginId);

        $repo = $plugin['repo'] ?? null;
        if (!is_string($repo) || '' === $repo) {
            throw new \RuntimeException(sprintf('Plugin "%s" has no repo configured', $pluginId));
        }

        $url = sprintf('https://raw.githubusercontent.com/%s/HEAD/README.md', $repo);
        $response = $this->httpClient->request('GET', $url);
        $content = $response->getContent();

        $latestVersion = null;
        try {
            $release = $this->resolveLatestRelease($repo);
            $latestVersion = $release['version'];
        } catch (\Throwable) {
            // GitHub API failure — version info is non-critical
        }

        return [
            'content' => $content,
            'latestVersion' => $latestVersion,
        ];
    }

    /**
     * Resolve the latest release version and download URL for a plugin.
     *
     * @return array{version: string, downloadUrl: string}
     */
    public function resolveLatestRelease(string $repo): array
    {
        $url = sprintf('https://api.github.com/repos/%s/releases/latest', $repo);
        $response = $this->httpClient->request('GET', $url, [
            'headers' => [
                'Accept' => 'application/vnd.github.v3+json',
            ],
        ]);

        $release = $response->toArray();
        $version = ltrim((string) ($release['tag_name'] ?? ''), 'v');

        // Look for plugin.zip asset first
        $downloadUrl = null;
        $assets = $release['assets'] ?? [];
        if (is_array($assets)) {
            foreach ($assets as $asset) {
                if (is_array($asset) && ($asset['name'] ?? '') === 'plugin.zip') {
                    $downloadUrl = $asset['browser_download_url'] ?? null;
                    break;
                }
            }
        }

        // Fallback to zipball
        if (null === $downloadUrl) {
            $downloadUrl = $release['zipball_url'] ?? null;
        }

        if (!is_string($downloadUrl) || '' === $downloadUrl) {
            throw new \RuntimeException('No downloadable asset found in latest release');
        }

        return [
            'version' => $version,
            'downloadUrl' => $downloadUrl,
        ];
    }

    /**
     * Download a plugin archive to a temp file.
     */
    public function downloadPlugin(string $downloadUrl): string
    {
        $response = $this->httpClient->request('GET', $downloadUrl);
        $tempFile = $this->projectDir . '/var/tmp/plugin_' . bin2hex(random_bytes(8)) . '.zip';

        $this->filesystem->mkdir(dirname($tempFile));
        file_put_contents($tempFile, $response->getContent());

        return $tempFile;
    }

    /**
     * Install a plugin: download, validate, extract, migrate.
     *
     * @return array{success: true, version: string}
     *
     * @throws PluginValidationException
     * @throws \RuntimeException
     */
    public function installPlugin(string $pluginId): array
    {
        $registry = $this->fetchRegistry();
        $plugin = $this->findPluginInRegistry($registry, $pluginId);
        $repo = $this->getRepo($plugin, $pluginId);

        // Check if already installed
        if (null !== $this->findInstalledPluginDir($pluginId)) {
            throw new \RuntimeException(sprintf('Plugin "%s" is already installed', $pluginId));
        }

        $release = $this->resolveLatestRelease($repo);
        $zipPath = $this->downloadPlugin($release['downloadUrl']);

        try {
            $this->validator->validateArchive($zipPath);
            $extractedPath = $this->extractArchive($zipPath);

            try {
                // Load manifest to determine target directory name
                $manifest = $this->validator->loadManifest($extractedPath);

                // Determine target directory
                $targetDirName = $this->resolveTargetDirName($pluginId, $manifest);
                $pluginDir = $this->projectDir . '/plugins/' . $targetDirName;

                if (is_dir($pluginDir)) {
                    throw new \RuntimeException(sprintf('Target directory "%s" already exists', $targetDirName));
                }

                $this->validator->validate($extractedPath, $pluginId);
                $this->filesystem->rename($extractedPath, $pluginDir);
            } catch (\Throwable $e) {
                $this->filesystem->remove($extractedPath);
                throw $e;
            }
        } finally {
            $this->filesystem->remove($zipPath);
        }

        $this->runMigrations();
        $this->clearCache();

        return ['success' => true, 'version' => $release['version']];
    }

    /**
     * Update a plugin: download + validate new version first, then replace.
     *
     * @return array{success: true, version: string}
     *
     * @throws PluginValidationException
     * @throws \RuntimeException
     */
    public function updatePlugin(string $pluginId): array
    {
        $registry = $this->fetchRegistry();
        $plugin = $this->findPluginInRegistry($registry, $pluginId);
        $repo = $this->getRepo($plugin, $pluginId);

        $pluginDir = $this->findInstalledPluginDir($pluginId);
        if (null === $pluginDir) {
            throw new \RuntimeException(sprintf('Plugin "%s" is not installed', $pluginId));
        }

        $release = $this->resolveLatestRelease($repo);
        $zipPath = $this->downloadPlugin($release['downloadUrl']);

        try {
            $this->validator->validateArchive($zipPath);
            $extractedPath = $this->extractArchive($zipPath);

            try {
                // Validate new version BEFORE removing old
                $this->validator->validate($extractedPath, $pluginId);

                // Safe to replace
                $this->filesystem->remove($pluginDir);
                $this->filesystem->rename($extractedPath, $pluginDir);
            } catch (\Throwable $e) {
                $this->filesystem->remove($extractedPath);
                throw $e;
            }
        } finally {
            $this->filesystem->remove($zipPath);
        }

        $this->runMigrations();
        $this->clearCache();

        return ['success' => true, 'version' => $release['version']];
    }

    /**
     * Uninstall a plugin: remove its directory.
     *
     * @return array{success: true}
     */
    public function uninstallPlugin(string $pluginId): array
    {
        $pluginDir = $this->findInstalledPluginDir($pluginId);
        if (null === $pluginDir) {
            throw new \RuntimeException(sprintf('Plugin "%s" is not installed', $pluginId));
        }

        $this->filesystem->remove($pluginDir);
        $this->clearCache();

        return ['success' => true];
    }

    /**
     * Extract a zip archive, handling the common GitHub pattern of a single root directory.
     */
    private function extractArchive(string $zipPath): string
    {
        $zip = new \ZipArchive();
        $result = $zip->open($zipPath, \ZipArchive::RDONLY);
        if (true !== $result) {
            throw new \RuntimeException('Failed to open plugin archive');
        }

        $extractDir = $this->projectDir . '/var/tmp/plugin_extract_' . bin2hex(random_bytes(8));
        $this->filesystem->mkdir($extractDir);

        $zip->extractTo($extractDir);
        $zip->close();

        // GitHub zipball archives contain a single root directory (e.g. "owner-repo-sha/")
        // Detect and unwrap it
        $scanned = scandir($extractDir);
        $items = array_diff(false !== $scanned ? $scanned : [], ['.', '..']);
        if (1 === count($items)) {
            $singleDir = $extractDir . '/' . reset($items);
            if (is_dir($singleDir)) {
                $unwrapped = $extractDir . '_unwrapped';
                $this->filesystem->rename($singleDir, $unwrapped);
                $this->filesystem->remove($extractDir);

                return $unwrapped;
            }
        }

        return $extractDir;
    }

    /**
     * @param array<string, mixed> $pluginData
     *
     * @return array<string, mixed>
     */
    private function enrichPluginData(array $pluginData): array
    {
        $pluginId = $pluginData['id'];
        $pluginDir = $this->findInstalledPluginDir($pluginId);

        $installed = null !== $pluginDir;
        $installedVersion = null;

        if ($installed) {
            $manifestPath = $pluginDir . '/plugin.json';
            if (file_exists($manifestPath)) {
                try {
                    $manifest = $this->validator->loadManifest($pluginDir);
                    $installedVersion = $manifest['version'] ?? null;
                } catch (PluginValidationException) {
                    // Corrupted manifest — still show as installed
                }
            }
        }

        $compatible = true;
        $minCoreVersion = $pluginData['minCoreVersion'] ?? null;
        if (is_string($minCoreVersion) && '' !== $minCoreVersion) {
            $compatible = Semver::satisfies(Kernel::VERSION, '>=' . $minCoreVersion);
        }

        $pluginData['installed'] = $installed;
        $pluginData['installedVersion'] = $installedVersion;
        $pluginData['compatible'] = $compatible;

        // For installed plugins, resolve latest version from GitHub
        $pluginData['latestVersion'] = null;
        $pluginData['updateAvailable'] = false;

        if ($installed) {
            $repo = $pluginData['repo'] ?? null;
            if (is_string($repo) && '' !== $repo) {
                try {
                    $release = $this->resolveLatestRelease($repo);
                    $pluginData['latestVersion'] = $release['version'];
                    $pluginData['updateAvailable'] = null !== $installedVersion
                        && version_compare($release['version'], $installedVersion, '>');
                } catch (\Throwable) {
                    // GitHub API failure — skip version check
                }
            }
        }

        return $pluginData;
    }

    /**
     * @param array{plugins: list<array<string, mixed>>} $registry
     *
     * @return array<string, mixed>
     */
    private function findPluginInRegistry(array $registry, string $pluginId): array
    {
        foreach ($registry['plugins'] as $plugin) {
            if (($plugin['id'] ?? null) === $pluginId) {
                return $plugin;
            }
        }

        throw new \RuntimeException(sprintf('Plugin "%s" not found in registry', $pluginId));
    }

    /**
     * @param array<string, mixed> $plugin
     */
    private function getRepo(array $plugin, string $pluginId): string
    {
        $repo = $plugin['repo'] ?? null;
        if (!is_string($repo) || '' === $repo) {
            throw new \RuntimeException(sprintf('Plugin "%s" has no repo configured', $pluginId));
        }

        return $repo;
    }

    /**
     * @param array<string, mixed> $manifest
     */
    private function resolveTargetDirName(string $pluginId, array $manifest): string
    {
        // 1. Try to derive from Bundle Namespace
        $bundleClass = $manifest['backend']['bundle'] ?? null;
        if (is_string($bundleClass) && '' !== $bundleClass) {
            $parts = explode('\\', $bundleClass);
            // Expecting Plugins\GiftPlugin\GiftPlugin -> GiftPlugin
            if (count($parts) >= 2 && $parts[0] === 'Plugins') {
                return $parts[1];
            }
        }

        // 2. Fallback: PascalCase of Plugin ID (gift-plugin -> GiftPlugin)
        $cleanId = preg_replace('/[^a-zA-Z0-9_-]/', '', $pluginId) ?? '';
        return str_replace(' ', '', ucwords(str_replace(['-', '_'], ' ', $cleanId)));
    }

    /**
     * Get a list of all locally installed plugins.
     *
     * @return list<array<string, mixed>>
     */
    public function getInstalledPlugins(): array
    {
        $pluginsDir = $this->projectDir . '/plugins';
        if (!is_dir($pluginsDir)) {
            return [];
        }

        $scanned = scandir($pluginsDir);
        if ($scanned === false) {
            return [];
        }

        $installed = [];
        foreach ($scanned as $dir) {
            if (in_array($dir, ['.', '..'], true)) {
                continue;
            }

            $path = $pluginsDir . '/' . $dir;
            if (!is_dir($path)) {
                continue;
            }

            try {
                if (!file_exists($path . '/plugin.json')) {
                    continue;
                }

                $manifest = $this->validator->loadManifest($path);
                // Enrich with directory name just in case
                $manifest['directory'] = $dir;

                // Add default keys if missing
                $manifest['installed'] = true;
                $manifest['compatible'] = $this->checkCompatibility($manifest['minCoreVersion'] ?? null);

                $installed[] = $manifest;
            } catch (\Throwable) {
                // Ignore invalid plugins
                continue;
            }
        }

        return $installed;
    }

    private function checkCompatibility(?string $minCoreVersion): bool
    {
        if (is_string($minCoreVersion) && '' !== $minCoreVersion) {
            return Semver::satisfies(Kernel::VERSION, '>=' . $minCoreVersion);
        }
        return true;
    }

    public function findInstalledPluginDir(string $pluginId): ?string
    {
        $pluginsDir = $this->projectDir . '/plugins';
        if (!is_dir($pluginsDir)) {
            return null;
        }

        // Scan all directories in /plugins to find the one matching the ID in plugin.json
        $scanned = scandir($pluginsDir);
        if ($scanned === false) {
            return null;
        }

        foreach ($scanned as $dir) {
            if (in_array($dir, ['.', '..'], true)) {
                continue;
            }

            $path = $pluginsDir . '/' . $dir;
            if (!is_dir($path)) {
                continue;
            }

            try {
                // Optimization: simple check first? No, need to read json.
                if (!file_exists($path . '/plugin.json')) {
                    continue;
                }

                $manifest = $this->validator->loadManifest($path);
                if (($manifest['name'] ?? null) === $pluginId) {
                    return $path;
                }
            } catch (\Throwable) {
                // Ignore invalid plugins
                continue;
            }
        }

        return null;
    }

    private function runMigrations(): void
    {
        $process = new Process(
            ['php', 'bin/console', 'doctrine:migrations:migrate', '--no-interaction'],
            $this->projectDir,
        );
        $process->setTimeout(120);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \RuntimeException('Migration failed: ' . $process->getErrorOutput());
        }
    }

    private function clearCache(): void
    {
        $process = new Process(
            ['php', 'bin/console', 'cache:clear', '--no-interaction'],
            $this->projectDir,
        );
        $process->setTimeout(60);
        $process->run();

        // Cache clear failure is non-critical, don't throw
    }
}
