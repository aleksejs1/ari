<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\NotificationIntentRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NotificationIntentRepository::class)]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('NOTIFICATION_INTENT_VIEW', object)"),
        new GetCollection(),
    ],
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['notification_intent:read']]
)]
class NotificationIntent implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['notification_intent:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['notification_intent:read'])]
    #[ORM\ManyToOne(inversedBy: 'notificationIntents')]
    #[ORM\JoinColumn(nullable: false)]
    private ?NotificationChannel $channel = null;

    /**
     * @var array<string, mixed>|null
     */
    #[Groups(['notification_intent:read'])]
    #[ORM\Column(nullable: true)]
    private ?array $payload = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getChannel(): ?NotificationChannel
    {
        return $this->channel;
    }

    public function setChannel(?NotificationChannel $channel): static
    {
        $this->channel = $channel;
        if (null !== $channel) {
            $this->setTenant($channel->getTenant());
        }

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getPayload(): ?array
    {
        return $this->payload;
    }

    /**
     * @param array<string, mixed>|null $payload
     */
    public function setPayload(?array $payload): static
    {
        $this->payload = $payload;

        return $this;
    }
}
