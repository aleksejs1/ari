<?php

namespace App\Entity\Traits;

use App\Entity\ContactEmailAdress;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait ContactEmailsTrait
{
    /**
     * @var Collection<int, ContactEmailAdress>
     */
    #[Groups(['contact:read', 'contact:create', 'export'])]
    #[ORM\OneToMany(
        targetEntity: ContactEmailAdress::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $contactEmailAdresses;

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
}
