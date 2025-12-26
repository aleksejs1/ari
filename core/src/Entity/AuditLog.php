<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\AuditLogRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AuditLogRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['audit:read']],
    security: "is_granted('ROLE_USER')"
)]
#[ApiFilter(SearchFilter::class, properties: ['entityType' => 'exact', 'entityId' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['createdAt' => 'DESC'])]
class AuditLog implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['audit:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['audit:read'])]
    #[ORM\ManyToOne(inversedBy: 'auditLogs')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[Groups(['audit:read'])]
    #[ORM\Column(length: 255)]
    private ?string $entityType = null;

    #[Groups(['audit:read'])]
    #[ORM\Column(nullable: true)]
    private ?int $entityId = null;

    #[Groups(['audit:read'])]
    #[ORM\Column(length: 255)]
    private ?string $action = null;

    /**
     * @var array<string, mixed>|null
     */
    #[Groups(['audit:read'])]
    #[ORM\Column(nullable: true)]
    private ?array $changes = null;

    /**
     * @var array<string, mixed>|null
     */
    #[Groups(['audit:read'])]
    #[ORM\Column(nullable: true)]
    private ?array $snapshotBefore = null;

    /**
     * @var array<string, mixed>|null
     */
    #[Groups(['audit:read'])]
    #[ORM\Column(nullable: true)]
    private ?array $snapshotAfter = null;

    #[Groups(['audit:read'])]
    #[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTime $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getEntityType(): ?string
    {
        return $this->entityType;
    }

    public function setEntityType(string $entityType): static
    {
        $this->entityType = $entityType;

        return $this;
    }

    public function getEntityId(): ?int
    {
        return $this->entityId;
    }

    public function setEntityId(?int $entityId): static
    {
        $this->entityId = $entityId;

        return $this;
    }

    public function getAction(): ?string
    {
        return $this->action;
    }

    public function setAction(string $action): static
    {
        $this->action = $action;

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getChanges(): ?array
    {
        return $this->changes;
    }

    /**
     * @param array<string, mixed>|null $changes
     */
    public function setChanges(?array $changes): static
    {
        $this->changes = $changes;

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getSnapshotBefore(): ?array
    {
        return $this->snapshotBefore;
    }

    /**
     * @param array<string, mixed>|null $snapshotBefore
     */
    public function setSnapshotBefore(?array $snapshotBefore): static
    {
        $this->snapshotBefore = $snapshotBefore;

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getSnapshotAfter(): ?array
    {
        return $this->snapshotAfter;
    }

    /**
     * @param array<string, mixed>|null $snapshotAfter
     */
    public function setSnapshotAfter(?array $snapshotAfter): static
    {
        $this->snapshotAfter = $snapshotAfter;

        return $this;
    }

    public function getCreatedAt(): ?\DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTime $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
