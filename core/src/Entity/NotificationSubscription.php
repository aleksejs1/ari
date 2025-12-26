<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\NotificationSubscriptionRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NotificationSubscriptionRepository::class)]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('NOTIFICATION_SUBSCRIPTION_VIEW', object)"),
        new GetCollection(),
        new Put(security: "is_granted('NOTIFICATION_SUBSCRIPTION_EDIT', object)"),
        new Patch(security: "is_granted('NOTIFICATION_SUBSCRIPTION_EDIT', object)"),
        new Delete(security: "is_granted('NOTIFICATION_SUBSCRIPTION_EDIT', object)"),
        new Post(securityPostDenormalize: "is_granted('NOTIFICATION_SUBSCRIPTION_ADD', object)"),
    ],
    normalizationContext: ['groups' => ['notification_subscription:read']],
    denormalizationContext: ['groups' => ['notification_subscription:write']],
    processor: 'App\State\UserOwnerProcessor'
)]
class NotificationSubscription implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['notification_subscription:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'notificationSubscriptions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[Groups(['notification_subscription:read', 'notification_subscription:write'])]
    #[ORM\ManyToOne(inversedBy: 'notificationSubscriptions')]
    private ?NotificationChannel $channel = null;

    #[Groups(['notification_subscription:read', 'notification_subscription:write'])]
    #[ORM\Column(length: 255)]
    private ?string $entityType = null;

    #[Groups(['notification_subscription:read', 'notification_subscription:write'])]
    #[ORM\Column]
    private ?int $entityId = null;

    #[Groups(['notification_subscription:read', 'notification_subscription:write'])]
    #[ORM\Column]
    private ?int $enabled = 1;

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
        $this->setTenant($user);

        return $this;
    }

    public function getChannel(): ?NotificationChannel
    {
        return $this->channel;
    }

    public function setChannel(?NotificationChannel $channel): static
    {
        $this->channel = $channel;

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

    public function setEntityId(int $entityId): static
    {
        $this->entityId = $entityId;

        return $this;
    }

    public function getEnabled(): ?int
    {
        return $this->enabled;
    }

    public function setEnabled(int $enabled): static
    {
        $this->enabled = $enabled;

        return $this;
    }
}
