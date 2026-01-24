<?php

namespace Plugins\GiftPlugin\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\Config\FileLocator;

class GiftPluginExtension extends Extension implements PrependExtensionInterface
{
    public function load(array $configs, ContainerBuilder $container): void
    {
        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../../config'));
        $loader->load('services.yaml');
    }

    public function prepend(ContainerBuilder $container): void
    {
        // 1. Doctrine Configuration
        if ($container->hasExtension('doctrine')) {
            $container->prependExtensionConfig('doctrine', [
                'orm' => [
                    'mappings' => [
                        'GiftPlugin' => [
                            'is_bundle' => false,
                            'type' => 'attribute',
                            'dir' => __DIR__ . '/../Entity',
                            'prefix' => 'Plugins\GiftPlugin\Entity',
                            'alias' => 'GiftPlugin',
                        ],
                    ],
                ],
            ]);
        }

        // 2. API Platform Configuration
        if ($container->hasExtension('api_platform')) {
            $container->prependExtensionConfig('api_platform', [
                'mapping' => [
                    'paths' => [
                        '%kernel.project_dir%/src/Entity',
                        __DIR__ . '/../Entity',
                    ],
                ],
            ]);
        }
        // 3. Doctrine Migrations Configuration
        if ($container->hasExtension('doctrine_migrations')) {
            $container->prependExtensionConfig('doctrine_migrations', [
                'migrations_paths' => [
                    'Plugins\GiftPlugin\Migrations' => __DIR__ . '/../../migrations',
                ],
            ]);
        }
    }
}
