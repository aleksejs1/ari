<?php

namespace App\Entity;

use App\Security\OwnershipAwareInterface;
use App\Repository\ContactDateRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ContactDateRepository::class)]
class ContactDate implements OwnershipAwareInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'contactDates')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $date = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $text = null;

    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
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
        $this->date = $date;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(?string $text): static
    {
        $this->text = $text;

        return $this;
    }
    
    public function getOwner(): User
    {
        return $this->contact->getOwner();
    }
}
