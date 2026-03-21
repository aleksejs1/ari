<?php

declare(strict_types=1);

namespace Ari\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use Ari\Entity\Trait\TimestampableTrait;
use Ari\Repository\TaskReflectionRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Ari\State\TaskReflectionProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TaskReflectionRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\UniqueConstraint(name: 'UNIQ_task_reflection_task', columns: ['task_id'])]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['task_reflection:read']],
    denormalizationContext: ['groups' => ['task_reflection:update']],
)]
#[Get(security: "is_granted('REFLECTION_EDIT', object)")]
#[Patch(
    security: "is_granted('REFLECTION_EDIT', object)",
    processor: TaskReflectionProcessor::class,
)]
class TaskReflection implements TenantAwareInterface
{
    use TenantAwareTrait;
    use TimestampableTrait;

    #[Groups(['contact_task:read', 'task_reflection:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'reflection')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?ContactTask $task = null;

    #[Groups(['contact_task:read', 'task_reflection:read'])]
    #[Assert\Length(max: 500)]
    #[ORM\Column(length: 500)]
    private string $question = '';

    #[Groups(['contact_task:read', 'task_reflection:read', 'task_reflection:update'])]
    #[Assert\Length(max: 10000)]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $answer = null;

    #[Groups(['contact_task:read', 'task_reflection:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $answeredAt = null;

    #[Groups(['task_reflection:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups(['task_reflection:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTask(): ?ContactTask
    {
        return $this->task;
    }

    public function setTask(ContactTask $task): static
    {
        $this->task = $task;

        return $this;
    }

    public function getQuestion(): string
    {
        return $this->question;
    }

    public function setQuestion(string $question): static
    {
        $this->question = $question;

        return $this;
    }

    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(?string $answer): static
    {
        $this->answer = $answer;

        return $this;
    }

    public function getAnsweredAt(): ?\DateTimeImmutable
    {
        return $this->answeredAt;
    }

    public function setAnsweredAt(?\DateTimeImmutable $answeredAt): static
    {
        $this->answeredAt = $answeredAt;

        return $this;
    }

}
