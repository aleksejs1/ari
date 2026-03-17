<?php

namespace Ari\Dto;

use Ari\Entity\Contact;
use Symfony\Component\Serializer\Attribute\Groups;

/**
 * DTO returned by GET /api/contacts/needs-attention.
 *
 * Wraps a Contact entity and adds two computed fields:
 * - lastInteractionAt — timestamp of the most recent interaction, or null if none
 * - overdueDays       — how many days past the cadence the contact is
 *
 * The normalization groups ['needs_attention:read', 'contact:read'] on the
 * endpoint cause API Platform to serialize both this DTO's own properties
 * (needs_attention:read) and all delegated Contact properties (contact:read)
 * via the proxied getters below.
 */
final class NeedsAttentionContactDto
{
    /** @see Contact for the contact:read group properties */
    public function __construct(
        public readonly Contact $contact,
        #[Groups(['needs_attention:read'])]
        public readonly ?\DateTimeImmutable $lastInteractionAt,
        #[Groups(['needs_attention:read'])]
        public readonly int $overdueDays,
    ) {
    }

    // ── Proxy all contact:read properties so the serializer finds them ────────
    // API Platform serializes the DTO object; it won't descend into $contact
    // automatically. We expose each contact:read property as a getter on this DTO
    // so that the serializer sees a flat object with all expected fields.

    #[Groups(['contact:read', 'export'])]
    public function getId(): ?int
    {
        return $this->contact->getId();
    }

    #[Groups(['contact:read', 'export'])]
    public function getUuid(): mixed
    {
        return $this->contact->getUuid();
    }

    #[Groups(['contact:read', 'contact_date:read', 'contact_name:read', 'contact_organization:read'])]
    public function getDisplayName(): string
    {
        return $this->contact->getDisplayName();
    }

    #[Groups(['contact:read', 'export'])]
    public function getCadenceDays(): ?int
    {
        return $this->contact->getCadenceDays();
    }

    #[Groups(['contact:read'])]
    public function getAvatar(): mixed
    {
        return $this->contact->getAvatar();
    }

    #[Groups(['contact:read', 'contact:create', 'export'])]
    public function getContactNames(): mixed
    {
        return $this->contact->getContactNames();
    }

    #[Groups(['contact:read', 'contact:create', 'export'])]
    public function getContactDates(): mixed
    {
        return $this->contact->getContactDates();
    }

    #[Groups(['contact:read', 'contact:create', 'export'])]
    public function getPhoneNumbers(): mixed
    {
        return $this->contact->getPhoneNumbers();
    }

    #[Groups(['contact:read', 'contact:create', 'export'])]
    public function getContactEmailAdresses(): mixed
    {
        return $this->contact->getContactEmailAdresses();
    }

    #[Groups(['contact:read', 'contact:create', 'export'])]
    public function getContactAddresses(): mixed
    {
        return $this->contact->getContactAddresses();
    }

    #[Groups(['contact:read', 'contact:create', 'export'])]
    public function getContactOrganizations(): mixed
    {
        return $this->contact->getContactOrganizations();
    }

    #[Groups(['contact:read', 'contact:create', 'export'])]
    public function getContactBiographies(): mixed
    {
        return $this->contact->getContactBiographies();
    }

    #[Groups(['contact:read', 'contact:create', 'export'])]
    public function getContactInteractions(): mixed
    {
        return $this->contact->getContactInteractions();
    }

    #[Groups(['contact:read', 'contact:create', 'export'])]
    public function getContactRelations(): mixed
    {
        return $this->contact->getContactRelations();
    }
}
