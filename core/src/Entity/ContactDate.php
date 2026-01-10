<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Filter\UpcomingAnniversaryOrderFilter;
use App\Repository\ContactDateRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;

#[ORM\Entity(repositoryClass: ContactDateRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['contact_date:read']],
    denormalizationContext: ['groups' => ['contact_date:create', 'contact_date:update']],
)]
#[ApiFilter(UpcomingAnniversaryOrderFilter::class)]
#[Get(security: "is_granted('CONTACT_VIEW', object)")]
#[GetCollection]
#[Post(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Put(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Patch(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
#[Delete(securityPostDenormalize: "is_granted('CONTACT_EDIT', object)")]
class ContactDate implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[Groups(['contact:read', 'contact_date:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['contact_date:read', 'contact_date:create'])]
    #[ORM\ManyToOne(inversedBy: 'contactDates')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    #[Groups([
        'contact:read', 'contact:create', 'contact_date:read', 'contact_date:create', 'contact_date:update', 'export',
    ])]
    #[Context(normalizationContext: [DateTimeNormalizer::FORMAT_KEY => 'Y-m-d'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $date = null;

    #[Groups([
        'contact:read', 'contact:create', 'contact_date:read', 'contact_date:create', 'contact_date:update', 'export',
    ])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $text = null;

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

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(?\DateTime $date): static
    {
        if (null !== $date) {
            $date = clone $date;
            $date->setTimezone(new \DateTimeZone('UTC'));
            $date->setTime(0, 0, 0);
        }

        $this->date = $date;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(?string $text): static
    {
        $this->text = '' === $text ? null : $text;

        return $this;
    }

    #[Groups(['contact:read', 'contact:create', 'contact_date:read'])]
    public function getYearsPassed(): ?int
    {
        if (null === $this->date) {
            return null;
        }

        $now = new \DateTime('today');

        return $this->date->diff($now)->y;
    }

    #[Groups(['contact:read', 'contact:create', 'contact_date:read'])]
    #[Context(normalizationContext: [DateTimeNormalizer::FORMAT_KEY => 'Y-m-d'])]
    public function getNextAnniversaryDate(): ?\DateTimeImmutable
    {
        if (null === $this->date) {
            return null;
        }

        $today = new \DateTime('today');
        $currentYear = (int) $today->format('Y');
        $month = (int) $this->date->format('m');
        $day = (int) $this->date->format('d');

        $anniversaryThisYear = new \DateTime();
        $anniversaryThisYear->setDate($currentYear, $month, $day);
        $anniversaryThisYear->setTime(0, 0, 0);

        if ($anniversaryThisYear < $today) {
            $anniversaryThisYear->modify('+1 year');
        }

        return \DateTimeImmutable::createFromMutable($anniversaryThisYear);
    }

    #[Groups(['contact:read', 'contact:create', 'contact_date:read'])]
    public function getYearsAtNextAnniversary(): ?int
    {
        $next = $this->getNextAnniversaryDate();
        if (null === $next || null === $this->date) {
            return null;
        }

        return $this->date->diff($next)->y;
    }
}
