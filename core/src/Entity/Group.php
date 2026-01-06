<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\GroupRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: GroupRepository::class)]
#[ORM\Table(name: '`group`')]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['group:read']],
    denormalizationContext: ['groups' => ['group:create']]
)]
#[Get(security: "is_granted('GROUP_VIEW', object)")]
#[GetCollection]
#[Put(
    security: "is_granted('GROUP_EDIT', object)",
    processor: 'App\State\UserOwnerProcessor'
)]
#[Patch(
    security: "is_granted('GROUP_EDIT', object)",
    processor: 'App\State\UserOwnerProcessor'
)]
#[Delete(security: "is_granted('GROUP_EDIT', object)")]
#[Post(
    securityPostDenormalize: "is_granted('GROUP_ADD', object)",
    processor: 'App\State\UserOwnerProcessor'
)]
class Group implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['group:read', 'contact:read', 'contact_group:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['group:read', 'export'])]
    #[ORM\Column(type: 'uuid', unique: true)]
    private ?Uuid $uuid = null;

    #[ORM\ManyToOne(inversedBy: 'groups')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[Groups([
        'group:read',
        'group:create',
        'export',
        'contact:read',
        'contact_group:read',
        'contact:create',
        'contact_group:create',
    ])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, ContactGroup>
     */
    #[ORM\OneToMany(targetEntity: ContactGroup::class, mappedBy: 'groupResource')]
    private Collection $contactGroups;

    public function __construct()
    {
        $this->contactGroups = new ArrayCollection();
        $this->uuid = Uuid::v7();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?Uuid
    {
        return $this->uuid;
    }

    public function setUuid(Uuid $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        $this->setTenant($user);

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, ContactGroup>
     */
    public function getContactGroups(): Collection
    {
        return $this->contactGroups;
    }

    public function addContactGroup(ContactGroup $contactGroup): static
    {
        if (!$this->contactGroups->contains($contactGroup)) {
            $this->contactGroups->add($contactGroup);
            $contactGroup->setGroupResource($this);
        }

        return $this;
    }

    public function removeContactGroup(ContactGroup $contactGroup): static
    {
        if ($this->contactGroups->removeElement($contactGroup)) {
            // set the owning side to null (unless already changed)
            if ($contactGroup->getGroupResource() === $this) {
                $contactGroup->setGroupResource(null);
            }
        }

        return $this;
    }
}
