<?php

namespace Ari\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Ari\Repository\ContactAddressRepository;
use Ari\Security\TenantAwareInterface;
use Ari\Security\TenantAwareTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContactAddressRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_address:read']],
    denormalizationContext: ['groups' => ['contact_address:create', 'contact_address:update']],
)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Post(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Put(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Patch(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Delete(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
class ContactAddress implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['contact:read', 'contact_address:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['contact_address:read', 'contact_address:create'])]
    #[ORM\ManyToOne(inversedBy: 'contactAddresses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_address:read',
        'contact_address:create',
        'contact_address:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $type = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_address:read',
        'contact_address:create',
        'contact_address:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $street = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_address:read',
        'contact_address:create',
        'contact_address:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $streetExtended = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_address:read',
        'contact_address:create',
        'contact_address:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $city = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_address:read',
        'contact_address:create',
        'contact_address:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $region = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_address:read',
        'contact_address:create',
        'contact_address:update',
        'export',
    ])]
    #[ORM\Column(length: 20, nullable: true)]
    private ?string $postalCode = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_address:read',
        'contact_address:create',
        'contact_address:update',
        'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $country = null;

    #[Groups([
        'contact:read',
        'contact:create',
        'contact_address:read',
        'contact_address:create',
        'contact_address:update',
        'export',
    ])]
    #[ORM\Column(length: 10, nullable: true)]
    private ?string $countryCode = null;

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = '' === $type ? null : $type;

        return $this;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(?string $street): static
    {
        $this->street = '' === $street ? null : $street;

        return $this;
    }

    public function getStreetExtended(): ?string
    {
        return $this->streetExtended;
    }

    public function setStreetExtended(?string $streetExtended): static
    {
        $this->streetExtended = '' === $streetExtended ? null : $streetExtended;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = '' === $city ? null : $city;

        return $this;
    }

    public function getRegion(): ?string
    {
        return $this->region;
    }

    public function setRegion(?string $region): static
    {
        $this->region = '' === $region ? null : $region;

        return $this;
    }

    public function getPostalCode(): ?string
    {
        return $this->postalCode;
    }

    public function setPostalCode(?string $postalCode): static
    {
        $this->postalCode = '' === $postalCode ? null : $postalCode;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): static
    {
        $this->country = '' === $country ? null : $country;

        return $this;
    }

    public function getCountryCode(): ?string
    {
        return $this->countryCode;
    }

    public function setCountryCode(?string $countryCode): static
    {
        $this->countryCode = '' === $countryCode ? null : $countryCode;

        return $this;
    }
}
