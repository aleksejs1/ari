<?php

namespace Ari\Entity\Traits;

use Ari\Entity\ContactBiography;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

trait ContactBiographiesTrait
{
    /**
     * @var Collection<int, ContactBiography>
     */
    #[Groups(['contact:read', 'contact:create', 'export'])]
    #[ORM\OneToMany(
        targetEntity: ContactBiography::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true,
    )]
    private Collection $contactBiographies;

    /**
     * @return Collection<int, ContactBiography>
     */
    public function getContactBiographies(): Collection
    {
        return $this->contactBiographies;
    }

    public function addContactBiography(ContactBiography $contactBiography): static
    {
        if (!$this->contactBiographies->contains($contactBiography)) {
            $this->contactBiographies->add($contactBiography);
            $contactBiography->setContact($this);
            $contactBiography->setTenant($this->getTenant());
        }

        return $this;
    }

    public function removeContactBiography(ContactBiography $contactBiography): static
    {
        if ($this->contactBiographies->removeElement($contactBiography)) {
            // set the owning side to null (unless already changed)
            if ($contactBiography->getContact() === $this) {
                $contactBiography->setContact(null);
            }
        }

        return $this;
    }
}
