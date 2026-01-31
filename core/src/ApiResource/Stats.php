<?php

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use Ari\State\StatsProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'Stats',
    operations: [
        new Get(
            uriTemplate: '/stats',
            provider: StatsProvider::class,
            normalizationContext: ['groups' => ['stats:read']],
            security: "is_granted('ROLE_USER')",
            name: 'get_stats',
        ),
    ],
)]
final class Stats
{
    public function __construct(
        #[Groups(['stats:read'])]
        public int $totalContacts = 0,
        #[Groups(['stats:read'])]
        public int $totalAuditLogs = 0,
        #[Groups(['stats:read'])]
        public int $totalSentNotifications = 0,
    ) {
    }
}
