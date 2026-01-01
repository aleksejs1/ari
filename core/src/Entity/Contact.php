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
use App\Entity\Traits\ContactAddressesTrait;
use App\Entity\Traits\ContactBiographiesTrait;
use App\Entity\Traits\ContactDatesTrait;
use App\Entity\Traits\ContactEmailsTrait;
use App\Entity\Traits\ContactGroupsTrait;
use App\Entity\Traits\ContactNamesTrait;
use App\Entity\Traits\ContactOrganizationsTrait;
use App\Entity\Traits\ContactPhoneNumbersTrait;
use App\Repository\ContactRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact:read']],
    denormalizationContext: ['groups' => ['contact:create']]
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Put(
    security: "is_granted('CONTACT_EDIT', object)",
    processor: 'App\State\ContactProcessor'
)]
#[Patch(
    security: "is_granted('CONTACT_EDIT', object)",
    processor: 'App\State\ContactProcessor'
)]
#[Delete(security: "is_granted('CONTACT_EDIT', object)")]
#[Post(
    securityPostDenormalize: "is_granted('CONTACT_ADD', object)",
    processor: 'App\State\ContactProcessor'
)]
#[ApiFilter(SearchFilter::class, properties: ['contactGroups.groupResource' => 'exact'])]
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

    #[Groups(['contact:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

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

    public function getUser(): User
    {
        if (null === $this->user) {
            throw new \LogicException('Contact must have a user.');
        }

        return $this->user;
    }
}
