<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Filter\ContactSearchFilter;
use App\Entity\Traits\ContactAddressesTrait;
use App\Entity\Traits\ContactBiographiesTrait;
use App\Entity\Traits\ContactDatesTrait;
use App\Entity\Traits\ContactEmailsTrait;
use App\Entity\Traits\ContactGroupsTrait;
use App\Entity\Traits\ContactNamesTrait;
use App\Entity\Traits\ContactOrganizationsTrait;
use App\Entity\Traits\ContactPhoneNumbersTrait;
use App\Entity\Traits\ContactRelationsTrait;
use App\Repository\ContactRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact:read']],
    denormalizationContext: ['groups' => ['contact:create']]
)]
#[Get(
    security: "is_granted('CONTACT_VIEW', object)",
    requirements: ['id' => '\d+']
)]
#[Get(
    uriTemplate: '/contacts/{id}/similar',
    name: 'contact_similar',
    provider: 'App\State\ContactSimilarProvider',
    requirements: ['id' => '\d+']
)]
#[GetCollection(
    uriTemplate: '/contacts/export',
    name: 'contact_export',
    controller: 'App\Controller\ExportContactsAction',
    normalizationContext: ['groups' => ['export']],
    security: "is_granted('ROLE_USER')",
    paginationEnabled: false
)]
#[GetCollection]
#[Put(
    security: "is_granted('CONTACT_EDIT', object)",
    processor: 'App\State\ContactProcessor',
    requirements: ['id' => '\d+']
)]
#[Patch(
    security: "is_granted('CONTACT_EDIT', object)",
    processor: 'App\State\ContactProcessor',
    requirements: ['id' => '\d+']
)]
#[Delete(
    security: "is_granted('CONTACT_EDIT', object)",
    requirements: ['id' => '\d+']
)]
#[Post(
    securityPostDenormalize: "is_granted('CONTACT_ADD', object)",
    processor: 'App\State\ContactProcessor'
)]
#[ApiFilter(SearchFilter::class, properties: ['contactGroups.groupResource' => 'exact'])]
#[ApiFilter(ContactSearchFilter::class)]
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
    use ContactBiographiesTrait;
    use ContactRelationsTrait;

    #[Groups(['contact:read', 'export'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['contact:read', 'export'])]
    #[ORM\Column(type: 'uuid', unique: true)]
    private ?Uuid $uuid = null;

    #[ORM\ManyToOne(inversedBy: 'contacts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

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
        $this->contactBiographies = new ArrayCollection();
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
}
