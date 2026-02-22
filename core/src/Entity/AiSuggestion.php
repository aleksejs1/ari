<?php

namespace Ari\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Ari\Controller\AiSuggestionBatchAction;
use Ari\Repository\AiSuggestionRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Ari\State\AiSuggestionProcessor;
use Ari\State\AiSuggestionProvider;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['ai_suggestion:read']],
    denormalizationContext: ['groups' => ['ai_suggestion:write']],
    operations: [
        new GetCollection(
            uriTemplate: '/ai_suggestions',
            provider: AiSuggestionProvider::class,
        ),
        new Patch(
            uriTemplate: '/ai_suggestions/{id}',
            securityPostDenormalize: "is_granted('AI_SUGGESTION_RESOLVE', object)",
            processor: AiSuggestionProcessor::class,
        ),
        new Post(
            uriTemplate: '/ai_suggestions/batch',
            controller: AiSuggestionBatchAction::class,
            read: false,
            write: false,
            name: 'ai_suggestions_batch',
        ),
    ],
)]
#[ORM\Entity(repositoryClass: AiSuggestionRepository::class)]
#[ORM\UniqueConstraint(
    name: 'uniq_ai_suggestion',
    columns: ['tenant_id', 'entity_type', 'entity_id', 'suggestion_type', 'source_hash'],
)]
#[ORM\Index(columns: ['tenant_id', 'status'], name: 'idx_ai_suggestion_tenant_status')]
#[ORM\Index(columns: ['tenant_id', 'entity_type', 'entity_id'], name: 'idx_ai_suggestion_entity')]
class AiSuggestion implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[ApiProperty(identifier: true)]
    #[Groups(['ai_suggestion:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /** Entity type, e.g. 'contact_name', 'contact_phone_number' (future) */
    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column(length: 64)]
    private string $entityType;

    /** ID of the related entity (e.g. ContactName.id) */
    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column]
    private int $entityId;

    /** Suggestion type, e.g. 'locale_alternative', 'phone_prefix' (future) */
    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column(length: 64)]
    private string $suggestionType;

    /**
     * Hash of the source value: md5(trim(given) . '|' . trim(family)).
     * Ties the suggestion to a specific state of the entity, not just its ID.
     * If the name changes, the hash changes and a new suggestion will be generated.
     */
    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column(length: 32)]
    private string $sourceHash;

    /**
     * Suggestion payload as JSON.
     * Example: {"locale":"lv","given":"Jānis","family":"Bērziņš","detectedLocale":"ru"}
     *
     * @var array<string, mixed>
     */
    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column(type: Types::JSON)]
    private array $payload = [];

    /** pending | accepted | dismissed | error | skipped */
    #[Groups(['ai_suggestion:read', 'ai_suggestion:write'])]
    #[ORM\Column(length: 16)]
    private string $status = 'pending';

    /** Provider used for the request, e.g. 'openai', 'anthropic' */
    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column(length: 32, nullable: true)]
    private ?string $providerUsed = null;

    /**
     * Model identifier (length: 255 — Ollama/HuggingFace model names can be long).
     * Example: "huggingface/meta-llama/Llama-3.2-3B-Instruct-GGUF:Q4_K_M"
     */
    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $modelUsed = null;

    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column(nullable: true)]
    private ?int $tokensPrompt = null;

    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column(nullable: true)]
    private ?int $tokensCompletion = null;

    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[Groups(['ai_suggestion:read'])]
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $resolvedAt = null;

    public function __construct(string $entityType, int $entityId, string $suggestionType, string $sourceHash)
    {
        $this->entityType = $entityType;
        $this->entityId = $entityId;
        $this->suggestionType = $suggestionType;
        $this->sourceHash = $sourceHash;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEntityType(): string
    {
        return $this->entityType;
    }

    public function getEntityId(): int
    {
        return $this->entityId;
    }

    public function getSuggestionType(): string
    {
        return $this->suggestionType;
    }

    public function getSourceHash(): string
    {
        return $this->sourceHash;
    }

    /**
     * @return array<string, mixed>
     */
    public function getPayload(): array
    {
        return $this->payload;
    }

    /**
     * @param array<string, mixed> $payload
     */
    public function setPayload(array $payload): static
    {
        $this->payload = $payload;

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

    public function getProviderUsed(): ?string
    {
        return $this->providerUsed;
    }

    public function setProviderUsed(?string $providerUsed): static
    {
        $this->providerUsed = $providerUsed;

        return $this;
    }

    public function getModelUsed(): ?string
    {
        return $this->modelUsed;
    }

    public function setModelUsed(?string $modelUsed): static
    {
        $this->modelUsed = $modelUsed;

        return $this;
    }

    public function getTokensPrompt(): ?int
    {
        return $this->tokensPrompt;
    }

    public function setTokensPrompt(?int $tokensPrompt): static
    {
        $this->tokensPrompt = $tokensPrompt;

        return $this;
    }

    public function getTokensCompletion(): ?int
    {
        return $this->tokensCompletion;
    }

    public function setTokensCompletion(?int $tokensCompletion): static
    {
        $this->tokensCompletion = $tokensCompletion;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getResolvedAt(): ?\DateTimeImmutable
    {
        return $this->resolvedAt;
    }

    public function setResolvedAt(?\DateTimeImmutable $resolvedAt): static
    {
        $this->resolvedAt = $resolvedAt;

        return $this;
    }
}
