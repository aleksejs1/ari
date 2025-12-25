<?php

namespace App\Entity;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\ContactRepository;
use ApiPlatform\Metadata\GetCollection;
use App\State\UserOwnerProcessor;
use App\Security\OwnershipAwareInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact:read']],
    denormalizationContext: ['groups' => ['contact:create']],
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Put(security: "is_granted('CONTACT_EDIT', object)")]
#[Delete(security: "is_granted('CONTACT_EDIT', object)")]
#[Post(
    securityPostDenormalize: "is_granted('CONTACT_ADD', object)",
    processor: UserOwnerProcessor::class
)]
class Contact implements OwnershipAwareInterface
{
    #[Groups(['contact:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, ContactName>
     */
    #[Groups(['contact:read'])]
    #[ORM\OneToMany(targetEntity: ContactName::class, mappedBy: 'contact', orphanRemoval: true)]
    private Collection $contactNames;

    #[ORM\ManyToOne(inversedBy: 'contacts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * @var Collection<int, ContactDate>
     */
    #[Groups(['contact:read'])]
    #[ORM\OneToMany(targetEntity: ContactDate::class, mappedBy: 'contact', orphanRemoval: true)]
    private Collection $contactDates;

    public function __construct()
    {
        $this->contactNames = new ArrayCollection();
        $this->contactDates = new ArrayCollection();
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, ContactName>
     */
    public function getContactNames(): Collection
    {
        return $this->contactNames;
    }

    public function addContactName(ContactName $contactName): static
    {
        if (!$this->contactNames->contains($contactName)) {
            $this->contactNames->add($contactName);
            $contactName->setContact($this);
        }

        return $this;
    }

    public function removeContactName(ContactName $contactName): static
    {
        if ($this->contactNames->removeElement($contactName)) {
            // set the owning side to null (unless already changed)
            if ($contactName->getContact() === $this) {
                $contactName->setContact(null);
            }
        }

        return $this;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @return Collection<int, ContactDate>
     */
    public function getContactDates(): Collection
    {
        return $this->contactDates;
    }

    public function addContactDate(ContactDate $contactDate): static
    {
        if (!$this->contactDates->contains($contactDate)) {
            $this->contactDates->add($contactDate);
            $contactDate->setContact($this);
        }

        return $this;
    }

    public function removeContactDate(ContactDate $contactDate): static
    {
        if ($this->contactDates->removeElement($contactDate)) {
            // set the owning side to null (unless already changed)
            if ($contactDate->getContact() === $this) {
                $contactDate->setContact(null);
            }
        }

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->user;
    }
}
