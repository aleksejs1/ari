<?php

namespace Ari\Service\Marketplace;

use Ari\Entity\User;
use Ari\Entity\UserPref;
use Ari\Kernel;
use Ari\Repository\UserPrefRepository;
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
        private readonly UserPrefRepository $userPrefRepository,
        #[Autowire('%plugin_registry_url%')]
        private readonly string $registryUrl,
        #[Autowire('%kernel.project_dir%')]
        private readonly string $projectDir,
    ) {
        $this->filesystem = new Filesystem();
    }

    public function isCommunityPluginsEnabled(User $user): bool
    {
        $pref = $this->userPrefRepository->findOneBy([
            'user' => $user,
            'type' => UserPref::TYPE_COMMUNITY_PLUGINS_ENABLED,
        ]);

        return null !== $pref && '1' === $pref->getValue();
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
     * Fetch the README.md content for a plugin from its GitHub repo.
     */
    public function fetchReadme(string $pluginId): string
    {
        $registry = $this->fetchRegistry();
        $plugin = $this->findPluginInRegistry($registry, $pluginId);

        $repo = $plugin['repo'] ?? null;
        if (!is_string($repo) || '' === $repo) {
            throw new \RuntimeException(sprintf('Plugin "%s" has no repo configured', $pluginId));
        }

        $url = sprintf('https://raw.githubusercontent.com/%s/HEAD/README.md', $repo);
        $response = $this->httpClient->request('GET', $url);

        return $response->getContent();
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

        $pluginDir = $this->getPluginDir($pluginId);
        if (is_dir($pluginDir)) {
            throw new \RuntimeException(sprintf('Plugin "%s" is already installed', $pluginId));
        }

        $release = $this->resolveLatestRelease($repo);
        $zipPath = $this->downloadPlugin($release['downloadUrl']);

        try {
            $this->validator->validateArchive($zipPath);
            $extractedPath = $this->extractArchive($zipPath);

            try {
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

        $pluginDir = $this->getPluginDir($pluginId);
        if (!is_dir($pluginDir)) {
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
        $pluginDir = $this->getPluginDir($pluginId);
        if (!is_dir($pluginDir)) {
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
        $pluginDir = $this->getPluginDir($pluginId);

        $installed = is_dir($pluginDir);
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

    private function getPluginDir(string $pluginId): string
    {
        // Sanitize plugin ID to prevent directory traversal
        $safe = preg_replace('/[^a-zA-Z0-9_-]/', '', $pluginId);
        if ('' === $safe || $safe !== $pluginId) {
            throw new \RuntimeException('Invalid plugin ID');
        }

        return $this->projectDir . '/plugins/' . $safe;
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
