<?php

namespace Ari\Entity;

use Ari\Repository\NotificationQueueRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NotificationQueueRepository::class)]
class NotificationQueue implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'notificationQueues')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?NotificationRule $rule = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Contact $contact = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?NotificationChannel $channel = null;

    #[ORM\Column(length: 20)]
    private ?string $status = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $scheduledAt = null;

    /**
     * @var array<mixed>
     */
    #[ORM\Column]
    private array $payload = [];

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $result = null;

    #[ORM\Column]
    private ?int $attempts = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRule(): ?NotificationRule
    {
        return $this->rule;
    }

    public function setRule(?NotificationRule $rule): static
    {
        $this->rule = $rule;

        return $this;
    }

    public function getContact(): ?Contact
    {
        return $this->contact;
    }

    public function setContact(?Contact $contact): static
    {
        $this->contact = $contact;

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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getScheduledAt(): ?\DateTimeImmutable
    {
        return $this->scheduledAt;
    }

    public function setScheduledAt(\DateTimeImmutable $scheduledAt): static
    {
        $this->scheduledAt = $scheduledAt;

        return $this;
    }

    /**
     * @return array<mixed>
     */
    public function getPayload(): array
    {
        return $this->payload;
    }

    /**
     * @param array<mixed> $payload
     */
    public function setPayload(array $payload): static
    {
        $this->payload = $payload;

        return $this;
    }

    public function getResult(): ?string
    {
        return $this->result;
    }

    public function setResult(?string $result): static
    {
        $this->result = $result;

        return $this;
    }

    public function getAttempts(): ?int
    {
        return $this->attempts;
    }

    public function setAttempts(int $attempts): static
    {
        $this->attempts = $attempts;

        return $this;
    }
}
