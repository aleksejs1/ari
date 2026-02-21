<?php

namespace Ari\Entity\Traits;

use Ari\Entity\ContactName;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

trait ContactNamesTrait
{
    /**
     * @var Collection<int, ContactName>
     */
    #[Groups(['contact:read', 'contact:create', 'export'])]
    #[ORM\OneToMany(
        targetEntity: ContactName::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true,
    )]
    private Collection $contactNames;

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
}
