<?php

declare(strict_types=1);

namespace Ari\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use Ari\Repository\ContactTaskRepository;
use Ari\State\ContactTaskProcessor;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Ari\Entity\ContactPlaybook;
use Ari\Entity\TaskReflection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContactTaskRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\Index(columns: ['tenant_id', 'status', 'due_date'], name: 'idx_contact_task_tenant_status_due')]
#[ORM\Index(columns: ['contact_id'], name: 'idx_contact_task_contact')]
#[ORM\Index(columns: ['playbook_id'], name: 'idx_contact_task_playbook')]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_task:read']],
    denormalizationContext: ['groups' => ['contact_task:update']],
)]
#[GetCollection]
#[Get(security: "is_granted('TASK_VIEW', object)")]
#[Patch(
    security: "is_granted('TASK_EDIT', object)",
    processor: ContactTaskProcessor::class,
)]
#[ApiFilter(SearchFilter::class, properties: ['contact' => 'exact', 'status' => 'exact'])]
#[ApiFilter(DateFilter::class, properties: ['dueDate'])]
class ContactTask implements TenantAwareInterface
{
    use TenantAwareTrait;

    public const string STATUS_PENDING = 'pending';
    public const string STATUS_COMPLETED = 'completed';
    public const string STATUS_SNOOZED = 'snoozed';
    public const string STATUS_ARCHIVED = 'archived';
    public const string STATUS_AWAITING_REFLECTION = 'awaiting_reflection';
    /** Used for playbook-level pause (ContactPlaybookService::pause/resume). No direct API task transition. */
    public const string STATUS_PAUSED = 'paused';

    /** @var list<string> */
    public const array STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_COMPLETED,
        self::STATUS_SNOOZED,
        self::STATUS_ARCHIVED,
        self::STATUS_AWAITING_REFLECTION,
    ];

    /**
     * Allowed API-initiated status transitions: from → list of allowed targets.
     * Transitions not in this map are rejected with HTTP 422.
     *
     * @var array<string, list<string>>
     */
    public const array ALLOWED_TRANSITIONS = [
        self::STATUS_PENDING => [
            self::STATUS_COMPLETED,
            self::STATUS_SNOOZED,
            self::STATUS_ARCHIVED,
        ],
        self::STATUS_SNOOZED => [self::STATUS_PENDING],
        self::STATUS_AWAITING_REFLECTION => [self::STATUS_COMPLETED],
    ];

    public const string TYPE_CALL = 'call';
    public const string TYPE_VIDEO_CALL = 'video_call';
    public const string TYPE_VISIT = 'visit';
    public const string TYPE_TEXT_MESSAGE = 'text_message';
    public const string TYPE_DATE_NIGHT = 'date_night';
    public const string TYPE_SURPRISE = 'surprise';
    public const string TYPE_SHARED_ACTIVITY = 'shared_activity';
    public const string TYPE_SHARE_INSIGHT = 'share_insight';
    public const string TYPE_CHECKIN_QUESTION = 'checkin_question';
    public const string TYPE_RESTART_MESSAGE = 'restart_message';

    /** @var list<string> */
    public const array TYPES = [
        self::TYPE_CALL,
        self::TYPE_VIDEO_CALL,
        self::TYPE_VISIT,
        self::TYPE_TEXT_MESSAGE,
        self::TYPE_DATE_NIGHT,
        self::TYPE_SURPRISE,
        self::TYPE_SHARED_ACTIVITY,
        self::TYPE_SHARE_INSIGHT,
        self::TYPE_CHECKIN_QUESTION,
        self::TYPE_RESTART_MESSAGE,
    ];

    #[Groups(['contact_task:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Contact $contact = null;

    #[ORM\ManyToOne(targetEntity: ContactPlaybook::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?ContactPlaybook $playbook = null;

    #[Groups(['contact_task:read'])]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: self::TYPES)]
    #[ORM\Column(length: 50)]
    private ?string $type = null;

    /**
     * Identifies the recurring series this task belongs to within a playbook preset.
     * Equals the task type by default; used by ContactTaskGeneratorService to find
     * the most recent task per series when computing the next due date.
     */
    #[Groups(['contact_task:read'])]
    #[Assert\NotBlank]
    #[ORM\Column(length: 50)]
    private ?string $seriesKey = null;

    #[Groups(['contact_task:read'])]
    #[ORM\Column]
    private bool $isOffline = false;

    #[Groups(['contact_task:read'])]
    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $dueDate = null;

    #[Groups(['contact_task:read', 'contact_task:update'])]
    #[Assert\Choice(choices: self::STATUSES)]
    #[ORM\Column(length: 30)]
    private string $status = self::STATUS_PENDING;

    #[Groups(['contact_task:read', 'contact_task:update'])]
    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $snoozedUntil = null;

    #[Groups(['contact_task:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $reflectionDueAt = null;

    #[Groups(['contact_task:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $completedAt = null;

    #[Groups(['contact_task:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToOne(mappedBy: 'task', cascade: ['persist'], orphanRemoval: true, fetch: 'EAGER')]
    private ?TaskReflection $reflection = null;

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

    /** Exposed as a read-only field in the API response. */
    #[Groups(['contact_task:read'])]
    public function getContactId(): ?int
    {
        return $this->contact?->getId();
    }

    /** Exposed as a read-only field in the API response. */
    #[Groups(['contact_task:read'])]
    public function getContactDisplayName(): ?string
    {
        return $this->contact?->getDisplayName();
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

    public function getSeriesKey(): ?string
    {
        return $this->seriesKey;
    }

    public function setSeriesKey(string $seriesKey): static
    {
        $this->seriesKey = $seriesKey;

        return $this;
    }

    public function isOffline(): bool
    {
        return $this->isOffline;
    }

    public function setIsOffline(bool $isOffline): static
    {
        $this->isOffline = $isOffline;

        return $this;
    }

    public function getDueDate(): ?\DateTimeImmutable
    {
        return $this->dueDate;
    }

    public function setDueDate(?\DateTimeImmutable $dueDate): static
    {
        $this->dueDate = $dueDate;

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

    public function getSnoozedUntil(): ?\DateTimeImmutable
    {
        return $this->snoozedUntil;
    }

    public function setSnoozedUntil(?\DateTimeImmutable $snoozedUntil): static
    {
        $this->snoozedUntil = $snoozedUntil;

        return $this;
    }

    public function getReflectionDueAt(): ?\DateTimeImmutable
    {
        return $this->reflectionDueAt;
    }

    public function setReflectionDueAt(?\DateTimeImmutable $reflectionDueAt): static
    {
        $this->reflectionDueAt = $reflectionDueAt;

        return $this;
    }

    public function getCompletedAt(): ?\DateTimeImmutable
    {
        return $this->completedAt;
    }

    public function setCompletedAt(?\DateTimeImmutable $completedAt): static
    {
        $this->completedAt = $completedAt;

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

    /** Embedded in contact_task:read for the ReflectionModal. */
    #[Groups(['contact_task:read'])]
    public function getReflection(): ?TaskReflection
    {
        return $this->reflection;
    }

    public function setReflection(?TaskReflection $reflection): static
    {
        $this->reflection = $reflection;

        return $this;
    }

    public function getPlaybook(): ?ContactPlaybook
    {
        return $this->playbook;
    }

    public function setPlaybook(?ContactPlaybook $playbook): static
    {
        $this->playbook = $playbook;

        return $this;
    }
}
