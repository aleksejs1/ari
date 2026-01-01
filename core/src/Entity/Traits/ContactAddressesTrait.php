<?php

namespace App\Entity\Traits;

use App\Entity\ContactAddress;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait ContactAddressesTrait
{
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
}
