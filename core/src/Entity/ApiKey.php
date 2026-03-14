<?php

namespace Ari\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Ari\Repository\ApiKeyRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Ari\State\ApiKeyProcessor;
use Ari\State\ApiKeyProvider;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['api_key:read']],
    denormalizationContext: ['groups' => ['api_key:write']],
    operations: [
        new GetCollection(
            uriTemplate: '/api_keys',
            provider: ApiKeyProvider::class,
        ),
        new Get(
            uriTemplate: '/api_keys/{id}',
            security: "is_granted('API_KEY_MANAGE', object)",
            provider: ApiKeyProvider::class,
        ),
        new Post(
            uriTemplate: '/api_keys',
            processor: ApiKeyProcessor::class,
            normalizationContext: ['groups' => ['api_key:read', 'api_key:create']],
        ),
        new Patch(
            uriTemplate: '/api_keys/{id}',
            security: "is_granted('API_KEY_MANAGE', object)",
            processor: ApiKeyProcessor::class,
            provider: ApiKeyProvider::class,
        ),
        new Delete(
            uriTemplate: '/api_keys/{id}',
            security: "is_granted('API_KEY_MANAGE', object)",
            processor: ApiKeyProcessor::class,
            provider: ApiKeyProvider::class,
        ),
    ],
)]
#[ORM\Entity(repositoryClass: ApiKeyRepository::class)]
#[ORM\Index(columns: ['tenant_id'], name: 'idx_api_key_tenant')]
#[ORM\Index(columns: ['secret_hash'], name: 'idx_api_key_secret_hash')]
class ApiKey implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[ApiProperty(identifier: true)]
    #[Groups(['api_key:read'])]
    #[ORM\Id]
    #[ORM\Column(length: 36)]
    private string $id;

    #[Groups(['api_key:read', 'api_key:write'])]
    #[Assert\NotBlank]
    #[Assert\Length(max: 100)]
    #[ORM\Column(length: 100)]
    private string $name;

    /**
     * @var list<string>
     */
    #[Groups(['api_key:read', 'api_key:write'])]
    #[ORM\Column(type: Types::JSON)]
    private array $scopes = ['*'];

    #[ORM\Column(length: 64)]
    private string $secretHash = '';

    #[Groups(['api_key:read'])]
    #[ORM\Column(length: 4)]
    private string $secretLastFour = '';

    #[Groups(['api_key:read'])]
    #[ORM\Column(nullable: true)]
    private ?\DateTime $lastUsedAt = null;

    #[Groups(['api_key:read'])]
    #[ORM\Column(length: 45, nullable: true)]
    private ?string $lastUsedIp = null;

    #[Groups(['api_key:read', 'api_key:write'])]
    #[ORM\Column(length: 50, nullable: true)]
    private ?string $appType = null;

    #[Groups(['api_key:read'])]
    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    private \DateTime $createdAt;

    /**
     * Transient — populated once on creation, never persisted.
     */
    #[Groups(['api_key:create'])]
    private ?string $token = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->id = $this->generateUuid();
    }

    private function generateUuid(): string
    {
        $bytes = random_bytes(16);
        $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
        $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return list<string>
     */
    public function getScopes(): array
    {
        return $this->scopes;
    }

    /**
     * @param list<string> $scopes
     */
    public function setScopes(array $scopes): static
    {
        $this->scopes = $scopes;

        return $this;
    }

    public function getSecretHash(): string
    {
        return $this->secretHash;
    }

    public function setSecretHash(string $secretHash): static
    {
        $this->secretHash = $secretHash;

        return $this;
    }

    public function getSecretLastFour(): string
    {
        return $this->secretLastFour;
    }

    public function setSecretLastFour(string $secretLastFour): static
    {
        $this->secretLastFour = $secretLastFour;

        return $this;
    }

    public function getLastUsedAt(): ?\DateTime
    {
        return $this->lastUsedAt;
    }

    public function setLastUsedAt(?\DateTime $lastUsedAt): static
    {
        $this->lastUsedAt = $lastUsedAt;

        return $this;
    }

    public function getLastUsedIp(): ?string
    {
        return $this->lastUsedIp;
    }

    public function setLastUsedIp(?string $lastUsedIp): static
    {
        $this->lastUsedIp = $lastUsedIp;

        return $this;
    }

    public function getAppType(): ?string
    {
        return $this->appType;
    }

    public function setAppType(?string $appType): static
    {
        $this->appType = $appType;

        return $this;
    }

    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(?string $token): static
    {
        $this->token = $token;

        return $this;
    }
}
