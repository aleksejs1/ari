<?php

namespace Ari\Entity\Traits;

use Ari\Entity\ContactInteraction;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait ContactInteractionsTrait
{
    /**
     * @var Collection<int, ContactInteraction>
     */
    #[Groups(['contact:read', 'contact:create', 'export'])]
    #[ORM\OneToMany(
        targetEntity: ContactInteraction::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true,
    )]
    private Collection $contactInteractions;

    /**
     * @return Collection<int, ContactInteraction>
     */
    public function getContactInteractions(): Collection
    {
        return $this->contactInteractions;
    }

    public function addContactInteraction(ContactInteraction $contactInteraction): static
    {
        if (!$this->contactInteractions->contains($contactInteraction)) {
            $this->contactInteractions->add($contactInteraction);
            $contactInteraction->setContact($this);
            $contactInteraction->setTenant($this->getTenant());
        }

        return $this;
    }

    public function removeContactInteraction(ContactInteraction $contactInteraction): static
    {
        if ($this->contactInteractions->removeElement($contactInteraction)) {
            // set the owning side to null (unless already changed)
            if ($contactInteraction->getContact() === $this) {
                $contactInteraction->setContact(null);
            }
        }

        return $this;
    }
}
