<?php

namespace Ari\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Ari\Repository\ContactInteractionRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContactInteractionRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_interaction:read']],
    denormalizationContext: ['groups' => ['contact_interaction:create', 'contact_interaction:update']],
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Post(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Put(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Patch(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Delete(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
class ContactInteraction implements TenantAwareInterface
{
    use TenantAwareTrait;

    public const INTERACTION_TYPES = ['call', 'meeting', 'message', 'email', 'social'];
    public const INITIATORS = ['me', 'them'];

    #[Groups(['contact:read', 'contact_interaction:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups([
        'contact:read', 'contact:create', 'contact_interaction:read', 'contact_interaction:create', 'contact_interaction:update', 'export',
    ])]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: self::INTERACTION_TYPES)]
    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[Groups([
        'contact:read', 'contact:create', 'contact_interaction:read', 'contact_interaction:create', 'contact_interaction:update', 'export',
    ])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[Groups([
        'contact:read', 'contact:create', 'contact_interaction:read', 'contact_interaction:create', 'contact_interaction:update', 'export',
    ])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $timestamp = null;

    /** Who initiated the interaction: 'me' or 'them'. Null means not recorded. */
    #[Groups([
        'contact:read', 'contact_interaction:read', 'contact_interaction:create', 'contact_interaction:update', 'export',
    ])]
    #[Assert\Choice(choices: self::INITIATORS)]
    #[ORM\Column(length: 10, nullable: true)]
    private ?string $initiator = null;

    /**
     * Free-form topic tags (e.g. ["fundraising", "design"]).
     *
     * @var list<string>|null
     */
    #[Groups([
        'contact:read', 'contact_interaction:read', 'contact_interaction:create', 'contact_interaction:update', 'export',
    ])]
    #[Assert\All([
        new Assert\Type('string'),
        new Assert\Length(max: 100),
    ])]
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $tags = null;

    /** Set automatically on first persist; not writable via API. */
    #[Groups(['contact:read', 'contact_interaction:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups(['contact_interaction:read', 'contact_interaction:create'])]
    #[ORM\ManyToOne(inversedBy: 'contactInteractions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    public function __construct(?Contact $contact = null)
    {
        if (null !== $contact) {
            $this->contact = $contact;
            $this->setTenant($contact->getTenant());
        }
    }

    #[ORM\PrePersist]
    public function initCreatedAt(): void
    {
        $this->createdAt ??= new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getTimestamp(): ?\DateTimeImmutable
    {
        return $this->timestamp;
    }

    public function setTimestamp(\DateTimeImmutable $timestamp): static
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    public function getInitiator(): ?string
    {
        return $this->initiator;
    }

    public function setInitiator(?string $initiator): static
    {
        $this->initiator = $initiator;

        return $this;
    }

    /** @return list<string>|null */
    public function getTags(): ?array
    {
        return $this->tags;
    }

    /** @param list<string>|null $tags */
    public function setTags(?array $tags): static
    {
        $this->tags = $tags;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
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
}
