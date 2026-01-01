<?php

namespace App\Entity\Traits;

use App\Entity\ContactOrganization;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait ContactOrganizationsTrait
{
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
