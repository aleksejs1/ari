<?php

namespace Ari\Entity\Traits;

use Ari\Entity\ContactDate;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

trait ContactDatesTrait
{
    /**
     * @var Collection<int, ContactDate>
     */
    #[Groups(['contact:read', 'contact:create', 'export'])]
    #[ORM\OneToMany(
        targetEntity: ContactDate::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true,
    )]
    private Collection $contactDates;

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
}
