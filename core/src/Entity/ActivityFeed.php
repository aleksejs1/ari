<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use App\Repository\ActivityFeedRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ActivityFeedRepository::class)]
#[ORM\Index(columns: ['user_id', 'is_read'], name: 'idx_activity_feed_user_unread')]
#[ORM\Index(columns: ['user_id', 'created_at'], name: 'idx_activity_feed_user_created')]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/activity-feed',
            order: ['createdAt' => 'DESC'],
            security: "is_granted('ROLE_USER')"
        ),
        new GetCollection(
            uriTemplate: '/activity-feed/unread-count',
            controller: 'App\Controller\Api\ActivityFeedController::getUnreadCount',
            security: "is_granted('ROLE_USER')",
            name: 'get_unread_count'
        ),
        new Patch(
            uriTemplate: '/activity-feed/read',
            controller: 'App\Controller\Api\ActivityFeedController::markAsRead',
            security: "is_granted('ROLE_USER')",
            name: 'mark_as_read'
        )
    ],
    normalizationContext: ['groups' => ['activity_feed:read']],
    denormalizationContext: ['groups' => ['activity_feed:write']]
)]
class ActivityFeed implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['activity_feed:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['activity_feed:read'])]
    private ?int $userId = null;

    #[ORM\Column(length: 50)]
    #[Groups(['activity_feed:read'])]
    private ?string $eventType = null;

    #[ORM\Column(length: 255)]
    #[Groups(['activity_feed:read'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['activity_feed:read'])]
    private ?string $message = null;

    #[ORM\Column]
    #[Groups(['activity_feed:read'])]
    private bool $isRead = false;

    /**
     * @var array<mixed>|null
     */
    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['activity_feed:read'])]
    private ?array $actionData = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['activity_feed:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['activity_feed:read'])]
    private ?\DateTimeInterface $expiresAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getEventType(): ?string
    {
        return $this->eventType;
    }

    public function setEventType(string $eventType): static
    {
        $this->eventType = $eventType;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function isRead(): bool
    {
        return $this->isRead;
    }

    public function setRead(bool $isRead): static
    {
        $this->isRead = $isRead;

        return $this;
    }

    /**
     * @return array<mixed>|null
     */
    public function getActionData(): ?array
    {
        return $this->actionData;
    }

    /**
     * @param array<mixed>|null $actionData
     */
    public function setActionData(?array $actionData): static
    {
        $this->actionData = $actionData;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getExpiresAt(): ?\DateTimeInterface
    {
        return $this->expiresAt;
    }

    public function setExpiresAt(?\DateTimeInterface $expiresAt): static
    {
        $this->expiresAt = $expiresAt;

        return $this;
    }
}
