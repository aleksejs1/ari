<?php

namespace Ari\Service\Marketplace;

use Ari\Kernel;
use Composer\Semver\Semver;

class PluginValidatorService
{
    public function __construct(
        private readonly int $maxArchiveSize,
    ) {}

    /**
     * Validate a plugin archive before installation.
     *
     * @throws PluginValidationException
     */
    public function validate(string $extractedPath, string $expectedPluginId): void
    {
        $this->validateManifestExists($extractedPath);

        $manifest = $this->loadManifest($extractedPath);

        $this->validateManifestFields($manifest);
        $this->validatePluginId($manifest, $expectedPluginId);
        $this->validateCoreCompatibility($manifest);
        $this->validateBackendBundle($extractedPath, $manifest);
        $this->validateFrontendEntry($extractedPath, $manifest);
    }

    /**
     * Validate a zip file before extraction.
     *
     * @throws PluginValidationException
     */
    public function validateArchive(string $zipPath): void
    {
        $size = filesize($zipPath);
        if (false === $size || $size > $this->maxArchiveSize) {
            throw new PluginValidationException(sprintf(
                'Plugin archive too large (max %d MB)',
                intdiv($this->maxArchiveSize, 1024 * 1024),
            ));
        }

        $zip = new \ZipArchive();
        $result = $zip->open($zipPath, \ZipArchive::RDONLY);
        if (true !== $result) {
            throw new PluginValidationException('Unable to open plugin archive');
        }

        try {
            for ($i = 0; $i < $zip->numFiles; ++$i) {
                $stat = $zip->statIndex($i);
                if (false === $stat) {
                    continue;
                }

                $name = $stat['name'];

                // Path traversal check
                /** @var string $normalized */
                $normalized = str_replace('\\', '/', $name);
                if (str_contains($normalized, '..')) {
                    throw new PluginValidationException('Archive contains path traversal');
                }

                if (str_starts_with($normalized, '/')) {
                    throw new PluginValidationException('Archive contains absolute paths');
                }
            }
        } finally {
            $zip->close();
        }
    }

    /**
     * @return array<string, mixed>
     *
     * @throws PluginValidationException
     */
    public function loadManifest(string $extractedPath): array
    {
        $manifestPath = $extractedPath . '/plugin.json';

        $contents = file_get_contents($manifestPath);
        if (false === $contents) {
            throw new PluginValidationException('Unable to read plugin manifest (plugin.json)');
        }

        try {
            $manifest = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new PluginValidationException('Invalid plugin manifest: malformed JSON');
        }

        if (!is_array($manifest)) {
            throw new PluginValidationException('Invalid plugin manifest: expected JSON object');
        }

        return $manifest;
    }

    private function validateManifestExists(string $extractedPath): void
    {
        if (!file_exists($extractedPath . '/plugin.json')) {
            throw new PluginValidationException('Missing plugin manifest (plugin.json)');
        }
    }

    /**
     * @param array<string, mixed> $manifest
     */
    private function validateManifestFields(array $manifest): void
    {
        if (!isset($manifest['name']) || !is_string($manifest['name']) || '' === $manifest['name']) {
            throw new PluginValidationException('Invalid plugin manifest: missing "name" field');
        }

        if (!isset($manifest['version']) || !is_string($manifest['version']) || '' === $manifest['version']) {
            throw new PluginValidationException('Invalid plugin manifest: missing "version" field');
        }
    }

    /**
     * @param array<string, mixed> $manifest
     */
    private function validatePluginId(array $manifest, string $expectedPluginId): void
    {
        if ($manifest['name'] !== $expectedPluginId) {
            throw new PluginValidationException(sprintf(
                'Plugin ID mismatch: expected "%s", got "%s"',
                $expectedPluginId,
                $manifest['name'],
            ));
        }
    }

    /**
     * @param array<string, mixed> $manifest
     */
    private function validateCoreCompatibility(array $manifest): void
    {
        $constraint = $manifest['require']['ari/core'] ?? null;
        if (null === $constraint) {
            return;
        }

        if (!is_string($constraint)) {
            throw new PluginValidationException('Invalid plugin manifest: "require.ari/core" must be a string');
        }

        if (!Semver::satisfies(Kernel::VERSION, $constraint)) {
            throw new PluginValidationException(sprintf(
                'Incompatible with current Ari version (requires %s, running %s)',
                $constraint,
                Kernel::VERSION,
            ));
        }
    }

    /**
     * @param array<string, mixed> $manifest
     */
    private function validateBackendBundle(string $extractedPath, array $manifest): void
    {
        $backendEnabled = $manifest['backend']['enabled'] ?? false;
        if (true !== $backendEnabled) {
            return;
        }

        $bundleClass = $manifest['backend']['bundle'] ?? null;
        if (!is_string($bundleClass) || '' === $bundleClass) {
            throw new PluginValidationException('Backend enabled but no bundle class specified');
        }

        // Derive expected file path from class name: Plugins\GiftPlugin\GiftPlugin → src/GiftPlugin.php
        $parts = explode('\\', $bundleClass);
        $className = end($parts);
        $bundlePath = $extractedPath . '/src/' . $className . '.php';

        if (!file_exists($bundlePath)) {
            throw new PluginValidationException(sprintf(
                'Backend bundle class not found at expected path: src/%s.php',
                $className,
            ));
        }
    }

    /**
     * @param array<string, mixed> $manifest
     */
    private function validateFrontendEntry(string $extractedPath, array $manifest): void
    {
        $frontendEnabled = $manifest['frontend']['enabled'] ?? false;
        if (true !== $frontendEnabled) {
            return;
        }

        $entry = $manifest['frontend']['entry'] ?? null;
        if (!is_string($entry) || '' === $entry) {
            throw new PluginValidationException('Frontend enabled but no entry file specified');
        }

        $entryPath = $extractedPath . '/' . $entry;
        if (!file_exists($entryPath)) {
            throw new PluginValidationException(sprintf(
                'Frontend entry file not found: %s',
                $entry,
            ));
        }
    }
}
