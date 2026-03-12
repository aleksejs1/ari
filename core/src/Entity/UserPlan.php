<?php

namespace Ari\Entity;

use Ari\Repository\UserPlanRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * Stores the subscription plan assigned to a user.
 * Not tenant-aware — it is a system-level record, not personal data.
 */
#[ORM\Entity(repositoryClass: UserPlanRepository::class)]
#[ORM\Table(name: 'user_plan')]
class UserPlan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private User $user;

    #[ORM\Column(length: 64)]
    private string $planId = 'self_hosted';

    // Future fields: stripeSubscriptionId, validUntil, etc.
    // NOTE: when validUntil is added, EntitlementService MUST check expiry before plan lookup.
    // An expired paid plan should fall back to 'free', not remain 'allowed'.

    public function __construct(User $user, string $planId = 'self_hosted')
    {
        $this->user = $user;
        $this->planId = $planId;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getPlanId(): string
    {
        return $this->planId;
    }

    public function setPlanId(string $planId): self
    {
        $this->planId = $planId;

        return $this;
    }
}
