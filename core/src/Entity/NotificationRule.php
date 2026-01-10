<?php

namespace App\Entity;

use App\Repository\NotificationRuleRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NotificationRuleRepository::class)]
class NotificationRule implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $tenant = null;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['notification_policy:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'notificationRules')]
    #[ORM\JoinColumn(nullable: false)]
    private ?NotificationPolicy $policy = null;

    #[ORM\ManyToOne(inversedBy: 'notificationRules')]
    #[Groups(['notification_policy:read'])]
    private ?NotificationChannel $channel = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['notification_policy:read'])]
    private ?string $targetType = null;

    #[ORM\ManyToOne]
    #[Groups(['notification_policy:read'])]
    private ?Group $contactGroup = null;

    #[ORM\ManyToOne]
    #[Groups(['notification_policy:read'])]
    private ?Contact $contact = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['notification_policy:read'])]
    private ?string $eventType = null;

    #[ORM\Column]
    #[Groups(['notification_policy:read'])]
    private ?int $offsetDays = null;

    #[ORM\Column(length: 5, nullable: true)]
    #[Groups(['notification_policy:read'])]
    private ?string $offsetTime = null;

    /**
     * @var Collection<int, NotificationQueue>
     */
    #[ORM\OneToMany(targetEntity: NotificationQueue::class, mappedBy: 'rule')]
    private Collection $notificationQueues;

    public function __construct()
    {
        $this->notificationQueues = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPolicy(): ?NotificationPolicy
    {
        return $this->policy;
    }

    public function setPolicy(?NotificationPolicy $policy): static
    {
        $this->policy = $policy;

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

    public function getTargetType(): ?string
    {
        return $this->targetType;
    }

    public function setTargetType(?string $targetType): static
    {
        $this->targetType = $targetType;

        return $this;
    }

    public function getContactGroup(): ?Group
    {
        return $this->contactGroup;
    }

    public function setContactGroup(?Group $contactGroup): static
    {
        $this->contactGroup = $contactGroup;

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

    public function getEventType(): ?string
    {
        return $this->eventType;
    }

    public function setEventType(?string $eventType): static
    {
        $this->eventType = $eventType;

        return $this;
    }

    public function getOffsetDays(): ?int
    {
        return $this->offsetDays;
    }

    public function setOffsetDays(int $offsetDays): static
    {
        $this->offsetDays = $offsetDays;

        return $this;
    }

    public function getOffsetTime(): ?string
    {
        return $this->offsetTime;
    }

    public function setOffsetTime(?string $offsetTime): static
    {
        $this->offsetTime = $offsetTime;

        return $this;
    }

    /**
     * @return Collection<int, NotificationQueue>
     */
    public function getNotificationQueues(): Collection
    {
        return $this->notificationQueues;
    }

    public function addNotificationQueue(NotificationQueue $notificationQueue): static
    {
        if (!$this->notificationQueues->contains($notificationQueue)) {
            $this->notificationQueues->add($notificationQueue);
            $notificationQueue->setRule($this);
        }

        return $this;
    }

    public function removeNotificationQueue(NotificationQueue $notificationQueue): static
    {
        if ($this->notificationQueues->removeElement($notificationQueue)) {
            // set the owning side to null (unless already changed)
            if ($notificationQueue->getRule() === $this) {
                $notificationQueue->setRule(null);
            }
        }

        return $this;
    }
}
