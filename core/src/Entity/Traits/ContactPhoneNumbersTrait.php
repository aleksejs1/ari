<?php

namespace App\Entity\Traits;

use App\Entity\ContactPhoneNumber;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait ContactPhoneNumbersTrait
{
    /**
     * @var Collection<int, ContactPhoneNumber>
     */
    #[Groups(['contact:read', 'contact:create'])]
    #[ORM\OneToMany(
        targetEntity: ContactPhoneNumber::class,
        mappedBy: 'contact',
        cascade: ['persist', 'remove'],
        orphanRemoval: true,
    )]
    private Collection $phoneNumbers;

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
}
