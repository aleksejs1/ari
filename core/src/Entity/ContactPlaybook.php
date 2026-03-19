<?php

declare(strict_types=1);

namespace Ari\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Ari\Repository\ContactPlaybookRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Ari\State\ContactPlaybookProcessor;
use Ari\State\ContactPlaybookProvider;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContactPlaybookRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\Index(columns: ['tenant_id', 'status'], name: 'idx_contact_playbook_tenant_status')]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_playbook:read']],
    denormalizationContext: ['groups' => ['contact_playbook:write']],
)]
#[Get(
    uriTemplate: '/contacts/{contactId}/playbook',
    uriVariables: [
        'contactId' => new Link(fromClass: Contact::class, toProperty: 'contact'),
    ],
    security: "is_granted('PLAYBOOK_VIEW', object)",
    provider: ContactPlaybookProvider::class,
    name: 'contact_playbook_get',
)]
#[Post(
    uriTemplate: '/contacts/{contactId}/playbook',
    uriVariables: [
        'contactId' => new Link(fromClass: Contact::class, toProperty: 'contact'),
    ],
    processor: ContactPlaybookProcessor::class,
    name: 'contact_playbook_post',
)]
#[Patch(
    uriTemplate: '/contacts/{contactId}/playbook',
    uriVariables: [
        'contactId' => new Link(fromClass: Contact::class, toProperty: 'contact'),
    ],
    security: "is_granted('PLAYBOOK_EDIT', object)",
    provider: ContactPlaybookProvider::class,
    processor: ContactPlaybookProcessor::class,
    name: 'contact_playbook_patch',
)]
#[Delete(
    uriTemplate: '/contacts/{contactId}/playbook',
    uriVariables: [
        'contactId' => new Link(fromClass: Contact::class, toProperty: 'contact'),
    ],
    security: "is_granted('PLAYBOOK_EDIT', object)",
    provider: ContactPlaybookProvider::class,
    processor: ContactPlaybookProcessor::class,
    name: 'contact_playbook_delete',
)]
class ContactPlaybook implements TenantAwareInterface
{
    use TenantAwareTrait;

    public const string STATUS_ACTIVE = 'active';
    public const string STATUS_PAUSED = 'paused';
    public const string STATUS_ARCHIVED = 'archived';

    public const array GOALS = ['maintain', 'deepen', 'reignite', 'rekindle', 'appreciate'];

    /** Every N-th completed task per series triggers a celebration screen. */
    public const int CELEBRATION_MILESTONE = 4;

    #[Groups(['contact_playbook:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Contact $contact = null;

    #[Groups(['contact_playbook:read', 'contact_playbook:write'])]
    #[Assert\NotBlank]
    #[Assert\Length(max: 60)]
    #[ORM\Column(length: 60)]
    private string $preset = '';

    #[Groups(['contact_playbook:read'])]
    #[ORM\Column(length: 20)]
    private string $goal = '';

    /**
     * @var list<string>|null
     */
    #[Groups(['contact_playbook:read', 'contact_playbook:write'])]
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $whyTags = null;

    #[Groups(['contact_playbook:read', 'contact_playbook:write'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $whyText = null;

    #[Groups(['contact_playbook:read', 'contact_playbook:write'])]
    #[Assert\Choice(choices: [self::STATUS_ACTIVE, self::STATUS_PAUSED, self::STATUS_ARCHIVED])]
    #[ORM\Column(length: 20)]
    private string $status = self::STATUS_ACTIVE;

    #[Groups(['contact_playbook:read', 'contact_playbook:write'])]
    #[ORM\Column]
    private bool $celebrationPending = false;

    #[Groups(['contact_playbook:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups(['contact_playbook:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\PrePersist]
    public function initTimestamps(): void
    {
        $now = new \DateTimeImmutable();
        $this->createdAt ??= $now;
        $this->updatedAt ??= $now;
    }

    #[ORM\PreUpdate]
    public function touchUpdatedAt(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContact(): ?Contact
    {
        return $this->contact;
    }

    public function setContact(Contact $contact): static
    {
        $this->contact = $contact;

        return $this;
    }

    #[Groups(['contact_playbook:read'])]
    public function getContactId(): ?int
    {
        return $this->contact?->getId();
    }

    public function getPreset(): string
    {
        return $this->preset;
    }

    public function setPreset(string $preset): static
    {
        $this->preset = $preset;

        return $this;
    }

    public function getGoal(): string
    {
        return $this->goal;
    }

    public function setGoal(string $goal): static
    {
        $this->goal = $goal;

        return $this;
    }

    /** @return list<string>|null */
    public function getWhyTags(): ?array
    {
        return $this->whyTags;
    }

    /** @param list<string>|null $whyTags */
    public function setWhyTags(?array $whyTags): static
    {
        $this->whyTags = $whyTags;

        return $this;
    }

    public function getWhyText(): ?string
    {
        return $this->whyText;
    }

    public function setWhyText(?string $whyText): static
    {
        $this->whyText = $whyText;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function isCelebrationPending(): bool
    {
        return $this->celebrationPending;
    }

    public function setCelebrationPending(bool $celebrationPending): static
    {
        $this->celebrationPending = $celebrationPending;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
}
