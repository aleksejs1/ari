<?php

namespace Ari\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Ari\Repository\ContactOrganizationRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ContactOrganizationRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_organization:read']],
    denormalizationContext: ['groups' => ['contact_organization:create', 'contact_organization:update']],
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Post(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Put(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Patch(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Delete(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
class ContactOrganization implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['contact:read', 'contact_organization:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['contact_organization:read', 'contact_organization:create'])]
    #[ORM\ManyToOne(inversedBy: 'contactOrganizations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_organization:read',
        'contact_organization:create',
        'contact_organization:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_organization:read',
        'contact_organization:create',
        'contact_organization:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $department = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_organization:read',
        'contact_organization:create',
        'contact_organization:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $title = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_organization:read',
        'contact_organization:create',
        'contact_organization:update',
        'export',
    ])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $startDate = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_organization:read',
        'contact_organization:create',
        'contact_organization:update',
        'export',
    ])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $endDate = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_organization:read',
        'contact_organization:create',
        'contact_organization:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $jobDescription = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_organization:read',
        'contact_organization:create',
        'contact_organization:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $type = null;

    public function __construct(?Contact $contact = null)
    {
        if (null !== $contact) {
            $this->contact = $contact;
            $this->setTenant($contact->getTenant());
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContact(): ?Contact
    {
        return $this->contact;
    }

    public function setContact(?Contact $contact): static
    {
        $this->contact = $contact;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = '' === $name ? null : $name;

        return $this;
    }

    public function getDepartment(): ?string
    {
        return $this->department;
    }

    public function setDepartment(?string $department): static
    {
        $this->department = '' === $department ? null : $department;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): static
    {
        $this->title = '' === $title ? null : $title;

        return $this;
    }

    public function getStartDate(): ?\DateTime
    {
        return $this->startDate;
    }

    public function setStartDate(?\DateTime $startDate): static
    {
        if (null !== $startDate) {
            $startDate = clone $startDate;
            $startDate->setTimezone(new \DateTimeZone('UTC'));
            $startDate->setTime(0, 0, 0);
        }

        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTime
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTime $endDate): static
    {
        if (null !== $endDate) {
            $endDate = clone $endDate;
            $endDate->setTimezone(new \DateTimeZone('UTC'));
            $endDate->setTime(0, 0, 0);
        }

        $this->endDate = $endDate;

        return $this;
    }

    public function getJobDescription(): ?string
    {
        return $this->jobDescription;
    }

    public function setJobDescription(?string $jobDescription): static
    {
        $this->jobDescription = '' === $jobDescription ? null : $jobDescription;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = '' === $type ? null : $type;

        return $this;
    }
}
