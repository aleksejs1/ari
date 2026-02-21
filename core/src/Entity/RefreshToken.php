<?php

namespace Ari\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use Ari\Repository\RefreshTokenRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Doctrine\ORM\Mapping as ORM;
use Gesdinet\JWTRefreshTokenBundle\Model\AbstractRefreshToken as BaseRefreshToken;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: RefreshTokenRepository::class)]
#[ORM\Table(name: 'refresh_tokens')]
#[ApiResource(
    shortName: 'ActiveSession',
    operations: [
        new GetCollection(),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['active_session:read']],
    security: "is_granted('ROLE_USER')",
)]
class RefreshToken extends BaseRefreshToken implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    protected $id;

    #[ORM\Column(name: 'refresh_token', type: 'string', length: 128, unique: true)]
    protected $refreshToken;

    #[ORM\Column(type: 'string', length: 255)]
    protected $username;

    #[ORM\Column(type: 'datetime')]
    protected $valid;

    #[ORM\Column(length: 45, nullable: true)]
    #[Groups(['active_session:read'])]
    private ?string $ipAddress = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['active_session:read'])]
    private ?string $userAgent = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['active_session:read'])]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        // Base class might not have a constructor or it might be internal
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getIpAddress(): ?string
    {
        return $this->ipAddress;
    }

    public function setIpAddress(?string $ipAddress): static
    {
        $this->ipAddress = $ipAddress;

        return $this;
    }

    public function getUserAgent(): ?string
    {
        return $this->userAgent;
    }

    public function setUserAgent(?string $userAgent): static
    {
        $this->userAgent = $userAgent;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    #[Groups(['active_session:read'])]
    #[\Override]
    public function getId(): int|string|null
    {
        return parent::getId();
    }

    #[Groups(['active_session:read'])]
    #[\Override]
    public function getValid(): ?\DateTimeInterface
    {
        return parent::getValid();
    }
}
