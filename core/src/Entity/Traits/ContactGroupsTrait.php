<?php

namespace App\Entity\Traits;

use App\Entity\ContactGroup;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait ContactGroupsTrait
{
    /**
     * @var Collection<int, ContactGroup>
     */
    #[Groups(['contact:read', 'contact:create', 'export'])]
    #[ORM\OneToMany(
        targetEntity: ContactGroup::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $contactGroups;

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
}
