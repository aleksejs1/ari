<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\ContactEmailAdressRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContactEmailAdressRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_email_adress:read']],
    denormalizationContext: ['groups' => ['contact_email_adress:create', 'contact_email_adress:update']],
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Post(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Put(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Patch(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Delete(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
class ContactEmailAdress implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['contact:read', 'contact_email_adress:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['contact_email_adress:read', 'contact_email_adress:create'])]
    #[ORM\ManyToOne(inversedBy: 'contactEmailAdresses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_email_adress:read',
        'contact_email_adress:create',
        'contact_email_adress:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $value = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_email_adress:read',
        'contact_email_adress:create',
        'contact_email_adress:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $type = null;

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

    public function getContact(): ?Contact
    {
        return $this->contact;
    }

    public function setContact(?Contact $contact): static
    {
        $this->contact = $contact;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): static
    {
        $this->value = '' === $value ? null : $value;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = '' === $type ? null : $type;

        return $this;
    }
}
