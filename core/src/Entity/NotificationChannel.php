<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\NotificationChannelRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NotificationChannelRepository::class)]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('NOTIFICATION_CHANNEL_VIEW', object)"),
        new GetCollection(),
        new Put(security: "is_granted('NOTIFICATION_CHANNEL_EDIT', object)"),
        new Patch(security: "is_granted('NOTIFICATION_CHANNEL_EDIT', object)"),
        new Delete(security: "is_granted('NOTIFICATION_CHANNEL_EDIT', object)"),
        new Post(securityPostDenormalize: "is_granted('NOTIFICATION_CHANNEL_ADD', object)"),
    ],
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['notification_channel:read']],
    denormalizationContext: ['groups' => ['notification_channel:write']],
    processor: 'App\State\UserOwnerProcessor'
)]
class NotificationChannel implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['notification_channel:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'notificationChannels')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[Groups(['notification_channel:read', 'notification_channel:write'])]
    #[ORM\Column(length: 255)]
    private ?string $type = null;

    /**
     * @var array<string, mixed>|null
     */
    #[Groups(['notification_channel:read', 'notification_channel:write'])]
    #[ORM\Column(nullable: true)]
    private ?array $config = null;

    #[Groups(['notification_channel:read'])]
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $verifiedAt = null;

    #[Groups(['notification_channel:read'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * @var Collection<int, NotificationSubscription>
     */
    #[ORM\OneToMany(targetEntity: NotificationSubscription::class, mappedBy: 'channel')]
    private Collection $notificationSubscriptions;

    /**
     * @var Collection<int, NotificationIntent>
     */
    #[ORM\OneToMany(targetEntity: NotificationIntent::class, mappedBy: 'channel', orphanRemoval: true)]
    private Collection $notificationIntents;

    public function __construct()
    {
        $this->notificationSubscriptions = new ArrayCollection();
        $this->notificationIntents = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
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
        $this->setTenant($user);

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getConfig(): ?array
    {
        return $this->config;
    }

    /**
     * @param array<string, mixed>|null $config
     */
    public function setConfig(?array $config): static
    {
        $this->config = $config;

        return $this;
    }

    public function getVerifiedAt(): ?\DateTimeImmutable
    {
        return $this->verifiedAt;
    }

    public function setVerifiedAt(?\DateTimeImmutable $verifiedAt): static
    {
        $this->verifiedAt = $verifiedAt;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection<int, NotificationSubscription>
     */
    public function getNotificationSubscriptions(): Collection
    {
        return $this->notificationSubscriptions;
    }

    public function addNotificationSubscription(NotificationSubscription $notificationSubscription): static
    {
        if (!$this->notificationSubscriptions->contains($notificationSubscription)) {
            $this->notificationSubscriptions->add($notificationSubscription);
            $notificationSubscription->setChannel($this);
        }

        return $this;
    }

    public function removeNotificationSubscription(NotificationSubscription $notificationSubscription): static
    {
        if ($this->notificationSubscriptions->removeElement($notificationSubscription)) {
            // set the owning side to null (unless already changed)
            if ($notificationSubscription->getChannel() === $this) {
                $notificationSubscription->setChannel(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, NotificationIntent>
     */
    public function getNotificationIntents(): Collection
    {
        return $this->notificationIntents;
    }

    public function addNotificationIntent(NotificationIntent $notificationIntent): static
    {
        if (!$this->notificationIntents->contains($notificationIntent)) {
            $this->notificationIntents->add($notificationIntent);
            $notificationIntent->setChannel($this);
        }

        return $this;
    }

    public function removeNotificationIntent(NotificationIntent $notificationIntent): static
    {
        if ($this->notificationIntents->removeElement($notificationIntent)) {
            // set the owning side to null (unless already changed)
            if ($notificationIntent->getChannel() === $this) {
                $notificationIntent->setChannel(null);
            }
        }

        return $this;
    }
}
