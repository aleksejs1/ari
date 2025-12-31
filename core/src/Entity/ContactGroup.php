<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\ContactGroupRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContactGroupRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_group:read']],
    denormalizationContext: ['groups' => ['contact_group:create', 'contact_group:update']],
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Post(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Put(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Patch(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Delete(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
class ContactGroup implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['contact:read', 'contact_group:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['contact_group:read', 'contact_group:create'])]
    #[ORM\ManyToOne(inversedBy: 'contactGroups')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    #[Groups(['contact:read', 'contact:create', 'contact_group:read', 'contact_group:create', 'contact_group:update'])]
    #[ORM\ManyToOne(inversedBy: 'contactGroups', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Group $groupResource = null;

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

    public function getGroupResource(): ?Group
    {
        return $this->groupResource;
    }

    public function setGroupResource(?Group $groupResource): static
    {
        $this->groupResource = $groupResource;

        return $this;
    }
}
