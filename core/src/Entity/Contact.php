<?php

namespace Ari\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\OpenApi\Model\MediaType;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\RequestBody;
use Ari\Entity\Traits\ContactAddressesTrait;
use Ari\Entity\Traits\ContactBiographiesTrait;
use Ari\Entity\Traits\ContactDatesTrait;
use Ari\Entity\Traits\ContactEmailsTrait;
use Ari\Entity\Traits\ContactGroupsTrait;
use Ari\Entity\Traits\ContactInteractionsTrait;
use Ari\Entity\Traits\ContactNamesTrait;
use Ari\Entity\Traits\ContactOrganizationsTrait;
use Ari\Entity\Traits\ContactPhoneNumbersTrait;
use Ari\Entity\Traits\ContactRelationsTrait;
use Ari\Filter\ContactSearchFilter;
use Ari\Repository\ContactRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
#[ORM\UniqueConstraint(name: 'unique_contact_uuid_per_user', columns: ['uuid', 'user_id'])]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    // Default includes contact:detail so POST/PUT/PATCH responses include interactions.
    // The main GetCollection overrides this to contact:read only (no interactions in list).
    normalizationContext: ['groups' => ['contact:read', 'contact:detail']],
    denormalizationContext: ['groups' => ['contact:create']],
)]
#[Get(
    security: "is_granted('CONTACT_VIEW', object)",
    requirements: ['id' => '\d+'],
)]
#[Get(
    uriTemplate: '/contacts/{id}/similar',
    name: 'contact_similar',
    normalizationContext: ['groups' => ['contact:read']],
    provider: 'Ari\State\ContactSimilarProvider',
    requirements: ['id' => '\d+'],
)]
#[Get(
    uriTemplate: '/contacts/{id}/vcard',
    name: 'contact_vcard',
    controller: 'Ari\Controller\VCardExportAction',
    requirements: ['id' => '\d+'],
    security: "is_granted('CONTACT_VIEW', object)",
)]
#[GetCollection(
    uriTemplate: '/contacts/export',
    name: 'contact_export',
    controller: 'Ari\Controller\ExportContactsAction',
    normalizationContext: ['groups' => ['export']],
    security: "is_granted('ROLE_USER')",
    paginationEnabled: false,
)]
#[GetCollection(
    uriTemplate: '/contacts/needs-attention',
    name: 'contact_needs_attention',
    normalizationContext: ['groups' => ['needs_attention:read', 'contact:read']],
    provider: 'Ari\State\NeedsAttentionProvider',
    security: "is_granted('ROLE_USER')",
    paginationEnabled: true,
    paginationItemsPerPage: 20,
)]
#[GetCollection(normalizationContext: ['groups' => ['contact:read']])]
#[Put(
    security: "is_granted('CONTACT_EDIT', object)",
    processor: 'Ari\State\ContactProcessor',
    requirements: ['id' => '\d+'],
)]
#[Patch(
    security: "is_granted('CONTACT_EDIT', object)",
    processor: 'Ari\State\ContactProcessor',
    requirements: ['id' => '\d+'],
)]
#[Delete(
    security: "is_granted('CONTACT_EDIT', object)",
    requirements: ['id' => '\d+'],
)]
#[Post(
    uriTemplate: '/contacts/import-xml',
    name: 'import_contact_xml',
    controller: 'Ari\Controller\ImportXmlAction',
    deserialize: false,
    validate: false,
    security: "is_granted('ROLE_USER')",
)]
#[Post(
    securityPostDenormalize: "is_granted('CONTACT_ADD', object)",
    processor: 'Ari\State\ContactProcessor',
)]
#[ApiFilter(SearchFilter::class, properties: ['contactGroups.groupResource' => 'exact'])]
#[ApiFilter(ContactSearchFilter::class)]
#[ApiFilter(OrderFilter::class, properties: ['contactNames.given' => 'ASC', 'contactNames.family' => 'ASC'])]
class Contact implements TenantAwareInterface
{
    use TenantAwareTrait;
    use ContactNamesTrait;
    use ContactDatesTrait;
    use ContactPhoneNumbersTrait;
    use ContactEmailsTrait;
    use ContactAddressesTrait;
    use ContactGroupsTrait;
    use ContactOrganizationsTrait;
    use ContactInteractionsTrait;
    use ContactBiographiesTrait;
    use ContactRelationsTrait;

    #[Groups(['contact:read', 'export'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;


    #[Groups(['contact:read', 'export'])]
    #[ORM\Column(type: 'uuid')]
    private ?Uuid $uuid = null;

    /** "Keep in touch every N days" cadence. Null means no cadence configured. */
    #[Groups(['contact:read', 'contact:create', 'contact:update', 'export'])]
    #[Assert\Positive]
    #[ORM\Column(nullable: true)]
    private ?int $cadenceDays = null;

    /**
     * Denormalized timestamp of the most recent ContactInteraction for this contact.
     * Updated by ContactInteractionListener after every flush.
     * Used by NeedsAttentionProvider to avoid a GROUP BY query on contact_interaction.
     * Exposed in contact:read responses for display in the contacts list (last interaction column).
     */
    #[Groups(['contact:read'])]
    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $lastInteractionAt = null;

    #[ORM\ManyToOne(inversedBy: 'contacts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\OneToOne(mappedBy: 'contact', targetEntity: ContactAvatar::class, cascade: ['persist', 'remove'])]
    #[Groups(['contact:read'])]
    private ?ContactAvatar $avatar = null;

    public function getAvatar(): ?ContactAvatar
    {
        return $this->avatar;
    }

    public function setAvatar(?ContactAvatar $avatar): static
    {
        // unset the owning side of the relation if necessary
        if (null === $avatar && null !== $this->avatar) {
            $this->avatar->setContact(null);
        }

        // set the owning side of the relation if necessary
        if (null !== $avatar && $avatar->getContact() !== $this) {
            $avatar->setContact($this);
        }

        $this->avatar = $avatar;

        return $this;
    }

    public function __construct()
    {
        $this->contactNames = new ArrayCollection();
        $this->contactDates = new ArrayCollection();
        $this->phoneNumbers = new ArrayCollection();
        $this->contactEmailAdresses = new ArrayCollection();
        $this->contactAddresses = new ArrayCollection();
        $this->contactGroups = new ArrayCollection();
        $this->contactOrganizations = new ArrayCollection();
        $this->contactBiographies = new ArrayCollection();
        $this->contactInteractions = new ArrayCollection();
        $this->contactRelations = new ArrayCollection();
        $this->reverseContactRelations = new ArrayCollection();
        $this->uuid = Uuid::v7();
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        $this->setTenant($user);

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?Uuid
    {
        return $this->uuid;
    }

    public function setUuid(Uuid $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getUser(): User
    {
        if (null === $this->user) {
            throw new \LogicException('Contact must have a user.');
        }

        return $this->user;
    }

    #[Groups(['contact:read', 'contact_date:read', 'contact_name:read', 'contact_organization:read'])]
    public function getDisplayName(): string
    {
        // 1. Names
        $name = $this->contactNames->first();
        if ($name instanceof ContactName) {
            $parts = [];
            $given = $name->getGiven();
            if (null !== $given && '' !== $given) {
                $parts[] = $given;
            }
            $family = $name->getFamily();
            if (null !== $family && '' !== $family) {
                $parts[] = $family;
            }
            if ([] !== $parts) {
                return implode(' ', $parts);
            }
        }

        // 2. Organization
        $org = $this->contactOrganizations->first();
        if ($org instanceof ContactOrganization) {
            $orgName = $org->getName();
            if (null !== $orgName && '' !== $orgName) {
                return $orgName;
            }
        }

        // 3. Email
        $email = $this->contactEmailAdresses->first();
        if ($email instanceof ContactEmailAdress) {
            $emailValue = $email->getValue();
            if (null !== $emailValue && '' !== $emailValue) {
                return $emailValue;
            }
        }

        // 4. Phone
        $phone = $this->phoneNumbers->first();
        if ($phone instanceof ContactPhoneNumber) {
            $phoneValue = $phone->getValue();
            if (null !== $phoneValue && '' !== $phoneValue) {
                return $phoneValue;
            }
        }

        return 'Unknown Contact';
    }

    public function getCadenceDays(): ?int
    {
        return $this->cadenceDays;
    }

    public function setCadenceDays(?int $cadenceDays): static
    {
        $this->cadenceDays = $cadenceDays;

        return $this;
    }

    public function getLastInteractionAt(): ?\DateTimeImmutable
    {
        return $this->lastInteractionAt;
    }

    public function setLastInteractionAt(?\DateTimeImmutable $lastInteractionAt): static
    {
        $this->lastInteractionAt = $lastInteractionAt;

        return $this;
    }
}
