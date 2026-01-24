<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

use Symfony\Component\HttpKernel\Bundle\BundleInterface;

use Composer\Semver\Semver;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public const VERSION = '0.1.0';
    public const CORE_PACKAGE_NAME = 'ari/core';

    #[\Override]
    public function registerBundles(): iterable
    {
        $contents = require $this->getProjectDir().'/config/bundles.php';
        foreach ($contents as $class => $envs) {
            if ($envs[$this->environment] ?? $envs['all'] ?? false) {
                $bundle = new $class();
                if ($bundle instanceof BundleInterface) {
                    yield $bundle;
                }
            }
        }

        $pluginsDir = $this->getProjectDir().'/plugins';
        if (!is_dir($pluginsDir)) {
            return;
        }

        // Drop-in Plugin Architecture: Scan plugins directory
        $iterator = new \DirectoryIterator($pluginsDir);
        foreach ($iterator as $fileInfo) {
            if ($fileInfo->isDot() || !$fileInfo->isDir()) {
                continue;
            }

            $pluginName = $fileInfo->getFilename();
            $pluginPath = $fileInfo->getPathname();

            // Version Constraint Check
            $composerJsonPath = $pluginPath . '/composer.json';
            if (file_exists($composerJsonPath)) {
                $composerData = json_decode((string) file_get_contents($composerJsonPath), true);
                if (is_array($composerData) && isset($composerData['require'][self::CORE_PACKAGE_NAME])) {
                    $constraint = $composerData['require'][self::CORE_PACKAGE_NAME];
                    if (!Semver::satisfies(self::VERSION, $constraint)) {
                        error_log(sprintf(
                            'Plugin "%s" requires %s "%s" but current version is "%s". Skipping load.',
                            $pluginName,
                            self::CORE_PACKAGE_NAME,
                            $constraint,
                            self::VERSION
                        ));
                        continue;
                    }
                }
            }

            $class = "Plugins\\{$pluginName}\\{$pluginName}";

            // Auto-register namespace using Composer ClassLoader
            // This avoids the need for "composer dump-autoload" for new plugins
            $loader = new \Composer\Autoload\ClassLoader();
            $loader->addPsr4("Plugins\\{$pluginName}\\", $pluginPath . '/src');
            $loader->register();

            if (class_exists($class)) {
                $plugin = new $class();
                if ($plugin instanceof BundleInterface) {
                    yield $plugin;
                }
            }
        }
    }
}

