<?php

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use Ari\Controller\MarketplaceController;

#[ApiResource(
    shortName: 'Marketplace',
    operations: [
        new Get(
            uriTemplate: '/marketplace/registry',
            controller: MarketplaceController::class . '::registry',
            name: 'marketplace_registry',
            read: false,
        ),
        new Get(
            uriTemplate: '/marketplace/readme/{pluginId}',
            controller: MarketplaceController::class . '::readme',
            name: 'marketplace_readme',
            read: false,
        ),
        new Post(
            uriTemplate: '/marketplace/install',
            controller: MarketplaceController::class . '::install',
            name: 'marketplace_install',
            read: false,
            write: false,
        ),
        new Post(
            uriTemplate: '/marketplace/update',
            controller: MarketplaceController::class . '::update',
            name: 'marketplace_update',
            read: false,
            write: false,
        ),
        new Post(
            uriTemplate: '/marketplace/uninstall',
            controller: MarketplaceController::class . '::uninstall',
            name: 'marketplace_uninstall',
            read: false,
            write: false,
        ),
    ]
)]
class Marketplace
{
    // This DTO is just for API Platform definition
}
