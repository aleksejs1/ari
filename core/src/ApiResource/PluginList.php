<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\PluginListProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'PluginList',
    operations: [
        new Get(
            uriTemplate: '/plugins',
            provider: PluginListProvider::class,
            normalizationContext: ['groups' => ['plugin:read']],
            security: "is_granted('ROLE_USER')",
            name: 'get_plugin_list',
        ),
    ],
)]
final class PluginList
{
    /**
     * @param array<array{id: string, version: string, displayName: string, description: string, author: string, enabled: bool, url: string}> $plugins
     */
    public function __construct(
        #[Groups(['plugin:read'])]
        public array $plugins = [],
    ) {
    }
}
