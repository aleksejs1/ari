<?php

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Ari\State\LoginHistoryProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'LoginHistory',
    operations: [
        new GetCollection(
            uriTemplate: '/auth_history',
            provider: LoginHistoryProvider::class,
            normalizationContext: ['groups' => ['login_history:read']],
            security: "is_granted('ROLE_USER')",
            paginationItemsPerPage: 30,
            name: 'get_login_history',
        ),
    ],
)]
final class LoginHistory
{
    public function __construct(
        #[ApiProperty(identifier: true)]
        #[Groups(['login_history:read'])]
        public ?int $id = null,
        #[Groups(['login_history:read'])]
        public ?string $ipAddress = null,
        #[Groups(['login_history:read'])]
        public ?string $userAgent = null,
        #[Groups(['login_history:read'])]
        public ?\DateTimeInterface $createdAt = null,
    ) {
    }
}
