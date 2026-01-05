<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\NotificationPolicyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NotificationPolicyRepository::class)]
#[ApiResource(
    operations: [
        new \ApiPlatform\Metadata\Post(
            uriTemplate: '/notification-policies',
            input: \App\Dto\NotificationPolicy\NotificationPolicyDto::class,
            processor: 'App\State\NotificationPolicyProcessor'
        ),
        new \ApiPlatform\Metadata\Get(
            uriTemplate: '/notification-policies/{id}'
        ),
        new \ApiPlatform\Metadata\GetCollection(
            uriTemplate: '/notification-policies'
        ),
        new \ApiPlatform\Metadata\Put(
            uriTemplate: '/notification-policies/{id}',
            input: \App\Dto\NotificationPolicy\NotificationPolicyDto::class,
            processor: 'App\State\NotificationPolicyProcessor'
        ),
        new \ApiPlatform\Metadata\Patch(
            uriTemplate: '/notification-policies/{id}',
            input: \App\Dto\NotificationPolicy\NotificationPolicyDto::class,
            processor: 'App\State\NotificationPolicyProcessor'
        ),
        new \ApiPlatform\Metadata\Delete(
            uriTemplate: '/notification-policies/{id}'
        )
    ],
    normalizationContext: ['groups' => ['notification_policy:read']],
    security: "is_granted('ROLE_USER')"
)]
class NotificationPolicy implements TenantAwareInterface
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

    #[ORM\ManyToOne(inversedBy: 'notificationPolicies')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['notification_policy:read'])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['notification_policy:read'])]
    private ?bool $isActive = null;

    /**
     * @var array<string, mixed>|null
     */
    #[ORM\Column(nullable: true)]
    #[Groups(['notification_policy:read'])]
    private ?array $uiSnapshot = null;

    /**
     * @var Collection<int, NotificationRule>
     */
    #[ORM\OneToMany(targetEntity: NotificationRule::class, mappedBy: 'policy', orphanRemoval: true)]
    #[Groups(['notification_policy:read'])]
    private Collection $notificationRules;

    public function __construct()
    {
        $this->notificationRules = new ArrayCollection();
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getUiSnapshot(): ?array
    {
        return $this->uiSnapshot;
    }

    /**
     * @param array<string, mixed>|null $uiSnapshot
     */
    public function setUiSnapshot(?array $uiSnapshot): static
    {
        $this->uiSnapshot = $uiSnapshot;

        return $this;
    }

    /**
     * @return Collection<int, NotificationRule>
     */
    public function getNotificationRules(): Collection
    {
        return $this->notificationRules;
    }

    public function addNotificationRule(NotificationRule $notificationRule): static
    {
        if (!$this->notificationRules->contains($notificationRule)) {
            $this->notificationRules->add($notificationRule);
            $notificationRule->setPolicy($this);
        }

        return $this;
    }

    public function removeNotificationRule(NotificationRule $notificationRule): static
    {
        if ($this->notificationRules->removeElement($notificationRule)) {
            // set the owning side to null (unless already changed)
            if ($notificationRule->getPolicy() === $this) {
                $notificationRule->setPolicy(null);
            }
        }

        return $this;
    }
}
