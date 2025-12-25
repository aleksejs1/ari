<?php

namespace App\Entity;

use App\Security\OwnershipAwareInterface;
use App\Repository\ContactNameRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContactNameRepository::class)]
class ContactName implements OwnershipAwareInterface
{
    #[Groups(['contact:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['contact:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $family = null;

    #[Groups(['contact:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $given = null;

    #[ORM\ManyToOne(inversedBy: 'contactNames')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contact $contact = null;

    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFamily(): ?string
    {
        return $this->family;
    }

    public function setFamily(?string $family): static
    {
        $this->family = $family;

        return $this;
    }

    public function getGiven(): ?string
    {
        return $this->given;
    }

    public function setGiven(?string $given): static
    {
        $this->given = $given;

        return $this;
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

    public function getOwner(): User
    {
        return $this->contact->getOwner();
    }
}
