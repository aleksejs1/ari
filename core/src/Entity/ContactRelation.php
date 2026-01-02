<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use App\Repository\ContactRelationRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;

#[ORM\Entity(repositoryClass: ContactRelationRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_relation:read']],
    denormalizationContext: ['groups' => ['contact_relation:create', 'contact_relation:update']],
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Post(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Put(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Patch(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Delete(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
class ContactRelation implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['contact:read', 'contact_relation:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['contact_relation:read', 'contact_relation:create'])]
    #[ApiProperty(readableLink: false)]
    #[ORM\ManyToOne(inversedBy: 'contactRelations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_relation:read',
        'contact_relation:create',
        'contact_relation:update'
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $type = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_relation:read',
        'contact_relation:create',
        'contact_relation:update'
    ])]
    #[SerializedName('relatedContact')]
    #[ApiProperty(readableLink: false)]
    #[ORM\ManyToOne(inversedBy: 'reverseContactRelations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $person = null;

    public function __construct(?Contact $contact = null)
    {
        if (null !== $contact) {
            $this->contact = $contact;
            $this->setTenant($contact->getTenant());
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): static
    {
        $this->id = $id;

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getPerson(): ?Contact
    {
        return $this->person;
    }

    public function setPerson(?Contact $person): static
    {
        $this->person = $person;

        return $this;
    }

    #[Groups(['contact:read', 'contact_relation:read'])]
    #[SerializedName('displayName')]
    public function getRelatedDisplayName(): string
    {
        return $this->person?->getDisplayName() ?? 'Unknown Contact';
    }
}
