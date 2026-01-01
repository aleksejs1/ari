<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\ContactRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact:read']],
    denormalizationContext: ['groups' => ['contact:create']]
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Put(
    security: "is_granted('CONTACT_EDIT', object)",
    processor: 'App\State\ContactProcessor'
)]
#[Patch(
    security: "is_granted('CONTACT_EDIT', object)",
    processor: 'App\State\ContactProcessor'
)]
#[Delete(security: "is_granted('CONTACT_EDIT', object)")]
#[Post(
    securityPostDenormalize: "is_granted('CONTACT_ADD', object)",
    processor: 'App\State\ContactProcessor'
)]
class Contact implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['contact:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, ContactName>
     */
    #[Groups(['contact:read', 'contact:create'])]
    #[ORM\OneToMany(
        targetEntity: ContactName::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $contactNames;

    #[ORM\ManyToOne(inversedBy: 'contacts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * @var Collection<int, ContactDate>
     */
    #[Groups(['contact:read', 'contact:create'])]
    #[ORM\OneToMany(
        targetEntity: ContactDate::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $contactDates;

    /**
     * @var Collection<int, ContactPhoneNumber>
     */
    #[Groups(['contact:read', 'contact:create'])]
    #[ORM\OneToMany(
        targetEntity: ContactPhoneNumber::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $phoneNumbers;

    /**
     * @var Collection<int, ContactEmailAdress>
     */
    #[Groups(['contact:read', 'contact:create'])]
    #[ORM\OneToMany(
        targetEntity: ContactEmailAdress::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $contactEmailAdresses;

    /**
     * @var Collection<int, ContactAddress>
     */
    /**
     * @var Collection<int, ContactAddress>
     */
    #[Groups(['contact:read', 'contact:create'])]
    #[ORM\OneToMany(
        targetEntity: ContactAddress::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $contactAddresses;

    /**
     * @var Collection<int, ContactGroup>
     */
    #[Groups(['contact:read', 'contact:create'])]
    #[ORM\OneToMany(
        targetEntity: ContactGroup::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $contactGroups;

    /**
     * @var Collection<int, ContactOrganization>
     */
    #[Groups(['contact:read', 'contact:create'])]
    #[ORM\OneToMany(
        targetEntity: ContactOrganization::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $contactOrganizations;

    public function __construct()
    {
        $this->contactNames = new ArrayCollection();
        $this->contactDates = new ArrayCollection();
        $this->phoneNumbers = new ArrayCollection();
        $this->contactEmailAdresses = new ArrayCollection();
        $this->contactAddresses = new ArrayCollection();
        $this->contactGroups = new ArrayCollection();
        $this->contactOrganizations = new ArrayCollection();
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        $this->setTenant($user);

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
            $contactName->setTenant($this->getTenant());
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
        if (null === $this->user) {
            throw new \LogicException('Contact must have a user.');
        }

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
            $contactDate->setTenant($this->getTenant());
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

    /**
     * @return Collection<int, ContactPhoneNumber>
     */
    public function getPhoneNumbers(): Collection
    {
        return $this->phoneNumbers;
    }

    public function addPhoneNumber(ContactPhoneNumber $phoneNumber): static
    {
        if (!$this->phoneNumbers->contains($phoneNumber)) {
            $this->phoneNumbers->add($phoneNumber);
            $phoneNumber->setContact($this);
            $phoneNumber->setTenant($this->getTenant());
        }

        return $this;
    }

    public function removePhoneNumber(ContactPhoneNumber $phoneNumber): static
    {
        if ($this->phoneNumbers->removeElement($phoneNumber)) {
            // set the owning side to null (unless already changed)
            if ($phoneNumber->getContact() === $this) {
                $phoneNumber->setContact(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ContactEmailAdress>
     */
    public function getContactEmailAdresses(): Collection
    {
        return $this->contactEmailAdresses;
    }

    public function addContactEmailAdress(ContactEmailAdress $contactEmailAdress): static
    {
        if (!$this->contactEmailAdresses->contains($contactEmailAdress)) {
            $this->contactEmailAdresses->add($contactEmailAdress);
            $contactEmailAdress->setContact($this);
            $contactEmailAdress->setTenant($this->getTenant());
        }

        return $this;
    }

    public function removeContactEmailAdress(ContactEmailAdress $contactEmailAdress): static
    {
        if ($this->contactEmailAdresses->removeElement($contactEmailAdress)) {
            // set the owning side to null (unless already changed)
            if ($contactEmailAdress->getContact() === $this) {
                $contactEmailAdress->setContact(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ContactAddress>
     */
    public function getContactAddresses(): Collection
    {
        return $this->contactAddresses;
    }

    public function addContactAddress(ContactAddress $contactAddress): static
    {
        if (!$this->contactAddresses->contains($contactAddress)) {
            $this->contactAddresses->add($contactAddress);
            $contactAddress->setContact($this);
            $contactAddress->setTenant($this->getTenant());
        }

        return $this;
    }

    public function removeContactAddress(ContactAddress $contactAddress): static
    {
        if ($this->contactAddresses->removeElement($contactAddress)) {
            // set the owning side to null (unless already changed)
            if ($contactAddress->getContact() === $this) {
                $contactAddress->setContact(null);
            }
        }

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
            $contactGroup->setContact($this);
        }

        return $this;
    }

    public function removeContactGroup(ContactGroup $contactGroup): static
    {
        if ($this->contactGroups->removeElement($contactGroup)) {
            // set the owning side to null (unless already changed)
            if ($contactGroup->getContact() === $this) {
                $contactGroup->setContact(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ContactOrganization>
     */
    public function getContactOrganizations(): Collection
    {
        return $this->contactOrganizations;
    }

    public function addContactOrganization(ContactOrganization $contactOrganization): static
    {
        if (!$this->contactOrganizations->contains($contactOrganization)) {
            $this->contactOrganizations->add($contactOrganization);
            $contactOrganization->setContact($this);
            $contactOrganization->setTenant($this->getTenant());
        }

        return $this;
    }

    public function removeContactOrganization(ContactOrganization $contactOrganization): static
    {
        if ($this->contactOrganizations->removeElement($contactOrganization)) {
            // set the owning side to null (unless already changed)
            if ($contactOrganization->getContact() === $this) {
                $contactOrganization->setContact(null);
            }
        }

        return $this;
    }
}
