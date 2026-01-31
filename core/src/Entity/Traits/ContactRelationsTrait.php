<?php

namespace Ari\Entity\Traits;

use Ari\Entity\Contact;
// Assumed for gender check
use Ari\Entity\ContactRelation;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

trait ContactRelationsTrait
{
    /**
     * @var Collection<int, ContactRelation>
     */
    #[Groups(['contact:read', 'contact:create', 'export'])]
    #[ORM\OneToMany(
        targetEntity: ContactRelation::class,
        mappedBy: 'contact',
        orphanRemoval: true,
        cascade: ['persist'],
    )]
    private Collection $contactRelations;

    /**
     * @var Collection<int, ContactRelation>
     *                                       Note: This side is not persisted directly as a collection in
     *                                       ContactRelation usually unless mapped. We map it in ContactRelation
     *                                       as 'person' with inversedBy='reverseContactRelations' to make this work
     *                                       efficiently.
     */
    #[ORM\OneToMany(
        targetEntity: ContactRelation::class,
        mappedBy: 'person',
        orphanRemoval: true,
        cascade: ['persist'],
    )]
    private Collection $reverseContactRelations;

    /**
     * @return Collection<int, ContactRelation>
     */
    public function getContactRelations(): Collection
    {
        // Start with direct relations
        $allRelations = new ArrayCollection($this->contactRelations->toArray());

        // Add reverse relations with inverted type
        foreach ($this->reverseContactRelations as $reverseRelation) {
            $contact = $reverseRelation->getContact();
            if (null === $contact) {
                continue;
            }
            $invertedType = $this->invertRelationType(
                $reverseRelation->getType(),
                $contact,
            );

            // Create a virtual relation object for display
            $virtualRelation = new ContactRelation();
            // We set the ID to null or we could potentially set it to the original ID to allow tracking?
            // Better to leave ID null or not expose it if it confuses the frontend,
            // OR expose the original ID but be careful about updates.
            // For now, let's just create a representation.
            // Users usually update relations via the owner, so this virtual one is read-only.

            $virtualRelation->setContact($this); // The current contact is the "owner" in this view
            $virtualRelation->setPerson($reverseRelation->getContact()); // The other person is the original owner
            $virtualRelation->setType($invertedType);

            // We set the ID to the original ID to allow usage in IRI generation.
            $virtualRelation->setId($reverseRelation->getId());

            $allRelations->add($virtualRelation);
        }

        return $allRelations;
    }

    /**
     * @return Collection<int, ContactRelation>
     */
    public function getContactRelationsCollection(): Collection
    {
        return $this->contactRelations;
    }

    /**
     * @return Collection<int, ContactRelation>
     */
    public function getReverseContactRelationsCollection(): Collection
    {
        return $this->reverseContactRelations;
    }

    public function addContactRelation(ContactRelation $contactRelation): static
    {
        // 1. Self-reference check
        if ($contactRelation->getPerson() === $this) {
            return $this;
        }

        // 2. Duplicate check (same person and type)
        foreach ($this->contactRelations as $existing) {
            if (
                $existing->getPerson() === $contactRelation->getPerson()
                && $existing->getType() === $contactRelation->getType()
            ) {
                return $this;
            }
        }

        if (!$this->contactRelations->contains($contactRelation)) {
            $this->contactRelations->add($contactRelation);
            $contactRelation->setContact($this);
            $contactRelation->setTenant($this->getTenant());
        }

        return $this;
    }

    public function removeContactRelation(ContactRelation $contactRelation): static
    {
        if ($this->contactRelations->removeElement($contactRelation)) {
            // set the owning side to null (unless already changed)
            if ($contactRelation->getContact() === $this) {
                $contactRelation->setContact(null);
            }
        }

        return $this;
    }

    public function invertRelationType(?string $type, Contact $me): string
    {
        if (null === $type) {
            return 'Related';
        }

        $type = mb_strtolower($type);

        // Basic map
        $map = [
            'husband' => 'Wife',
            'wife' => 'Husband',
            'spouse' => 'Spouse',
            'brother' => 'Sibling', // Sibling fallback, refined below
            'sister' => 'Sibling',
            'sibling' => 'Sibling',
        ];

        // Parent/Child logic
        if (in_array($type, ['father', 'mother', 'parent'], true)) {
            return $this->getGenderedTerm($me, 'Son', 'Daughter', 'Child');
        }

        // Child/Parent logic
        if (in_array($type, ['son', 'daughter', 'child'], true)) {
            // If I am the parent, return Parent (or Father/Mother if we knew my gender)
            return $this->getGenderedTerm($me, 'Father', 'Mother', 'Parent');
        }

        if (isset($map[$type])) {
            // Refine Sibling
            if ('Sibling' === $map[$type]) {
                return $this->getGenderedTerm($me, 'Brother', 'Sister', 'Sibling');
            }
            // Refine Spouse
            if ('Spouse' === $map[$type]) { // If it was generic spouse, try to be specific? No, keep generic.
                return 'Spouse';
            }

            return $map[$type];
        }

        return 'Related (' . $type . ')';
    }

    private function getGenderedTerm(
        Contact $contact,
        string $maleTerm,
        string $femaleTerm,
        string $neutralTerm,
    ): string {
        // Try to find gender in biographies
        foreach ($contact->getContactBiographies() as $bio) {
            if ('gender' === mb_strtolower($bio->getType() ?? '')) {
                $val = mb_strtolower($bio->getValue() ?? '');
                if ('male' === $val || 'm' === $val) {
                    return $maleTerm;
                }
                if ('female' === $val || 'f' === $val) {
                    return $femaleTerm;
                }
            }
        }

        return $neutralTerm;
    }
}
