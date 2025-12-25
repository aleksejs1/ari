<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\ContactNameRepository;
use App\Security\OwnershipAwareInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContactNameRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_name:read']],
    denormalizationContext: ['groups' => ['contact_name:create', 'contact_name:update']],
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Post(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Put(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Delete(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
class ContactName implements OwnershipAwareInterface
{
    #[Groups(['contact:read', 'contact_name:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['contact:read', 'contact_name:read', 'contact_name:create', 'contact_name:update'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $family = null;

    #[Groups(['contact:read', 'contact_name:read', 'contact_name:create', 'contact_name:update'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $given = null;

    #[Groups(['contact_name:read', 'contact_name:create'])]
    #[ORM\ManyToOne(inversedBy: 'contactNames')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFamily(): ?string
    {
        return $this->family;
    }

    public function setFamily(?string $family): static
    {
        $this->family = $family;

        return $this;
    }

    public function getGiven(): ?string
    {
        return $this->given;
    }

    public function setGiven(?string $given): static
    {
        $this->given = $given;

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

    public function getOwner(): ?User
    {
        if (null === $this->contact) {
            throw new \LogicException('ContactName must belong to a Contact.');
        }

        return $this->contact->getOwner();
    }
}
