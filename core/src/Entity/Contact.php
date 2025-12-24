<?php

namespace App\Entity;

use App\Repository\ContactRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
class Contact
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, ContactName>
     */
    #[ORM\OneToMany(targetEntity: ContactName::class, mappedBy: 'contact', orphanRemoval: true)]
    private Collection $contactNames;

    #[ORM\ManyToOne(inversedBy: 'contacts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * @var Collection<int, ContactDate>
     */
    #[ORM\OneToMany(targetEntity: ContactDate::class, mappedBy: 'contact', orphanRemoval: true)]
    private Collection $contactDates;

    public function __construct(User $user)
    {
        $this->contactNames = new ArrayCollection();
        $this->user = $user;
        $this->contactDates = new ArrayCollection();
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
}
