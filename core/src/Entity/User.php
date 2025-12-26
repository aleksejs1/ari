<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_UUID', fields: ['uuid'])]
#[UniqueEntity(fields: ['uuid'], message: 'There is already an account with this uuid')]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_USER') and object == user"),
        new Post(
            processor: 'App\State\UserPasswordHasherProcessor',
            denormalizationContext: ['groups' => ['user:create']],
            validationContext: ['groups' => ['Default', 'user:create']]
        ),
    ],
    normalizationContext: ['groups' => ['user:read']]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[Groups(['user:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['user:read', 'user:create'])]
    #[ORM\Column(length: 180)]
    private ?string $uuid = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Groups(['user:create'])]
    private ?string $plainPassword = null;

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): void
    {
        $this->plainPassword = $plainPassword;
    }

    /**
     * @var Collection<int, Contact>
     */
    #[ORM\OneToMany(targetEntity: Contact::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $contacts;

    /**
     * @var Collection<int, AuditLog>
     */
    #[ORM\OneToMany(targetEntity: AuditLog::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $auditLogs;

    /**
     * @var Collection<int, NotificationChannel>
     */
    #[ORM\OneToMany(targetEntity: NotificationChannel::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $notificationChannels;

    /**
     * @var Collection<int, NotificationSubscription>
     */
    #[ORM\OneToMany(targetEntity: NotificationSubscription::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $notificationSubscriptions;

    public function __construct()
    {
        $this->contacts = new ArrayCollection();
        $this->auditLogs = new ArrayCollection();
        $this->notificationChannels = new ArrayCollection();
        $this->notificationSubscriptions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    #[\Override]
    public function getUserIdentifier(): string
    {
        $uuid = (string) $this->uuid;
        if ('' === $uuid) {
            throw new \LogicException('User uuid cannot be empty.');
        }

        return $uuid;
    }

    /**
     * @see UserInterface
     */
    #[\Override]
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    #[\Override]
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0" . self::class . "\0password"] = hash('crc32c', (string) $this->password);

        return $data;
    }

    #[\Override]
    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }

    /**
     * @return Collection<int, Contact>
     */
    public function getContacts(): Collection
    {
        return $this->contacts;
    }

    public function addContact(Contact $contact): static
    {
        if (!$this->contacts->contains($contact)) {
            $this->contacts->add($contact);
            $contact->setUser($this);
        }

        return $this;
    }

    public function removeContact(Contact $contact): static
    {
        if ($this->contacts->removeElement($contact)) {
            // set the owning side to null (unless already changed)
            if ($contact->getUser() === $this) {
                $contact->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AuditLog>
     */
    public function getAuditLogs(): Collection
    {
        return $this->auditLogs;
    }

    public function addAuditLog(AuditLog $auditLog): static
    {
        if (!$this->auditLogs->contains($auditLog)) {
            $this->auditLogs->add($auditLog);
            $auditLog->setUser($this);
        }

        return $this;
    }

    public function removeAuditLog(AuditLog $auditLog): static
    {
        if ($this->auditLogs->removeElement($auditLog)) {
            // set the owning side to null (unless already changed)
            if ($auditLog->getUser() === $this) {
                $auditLog->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, NotificationChannel>
     */
    public function getNotificationChannels(): Collection
    {
        return $this->notificationChannels;
    }

    public function addNotificationChannel(NotificationChannel $notificationChannel): static
    {
        if (!$this->notificationChannels->contains($notificationChannel)) {
            $this->notificationChannels->add($notificationChannel);
            $notificationChannel->setUser($this);
        }

        return $this;
    }

    public function removeNotificationChannel(NotificationChannel $notificationChannel): static
    {
        if ($this->notificationChannels->removeElement($notificationChannel)) {
            // set the owning side to null (unless already changed)
            if ($notificationChannel->getUser() === $this) {
                $notificationChannel->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, NotificationSubscription>
     */
    public function getNotificationSubscriptions(): Collection
    {
        return $this->notificationSubscriptions;
    }

    public function addNotificationSubscription(NotificationSubscription $notificationSubscription): static
    {
        if (!$this->notificationSubscriptions->contains($notificationSubscription)) {
            $this->notificationSubscriptions->add($notificationSubscription);
            $notificationSubscription->setUser($this);
        }

        return $this;
    }

    public function removeNotificationSubscription(NotificationSubscription $notificationSubscription): static
    {
        if ($this->notificationSubscriptions->removeElement($notificationSubscription)) {
            // set the owning side to null (unless already changed)
            if ($notificationSubscription->getUser() === $this) {
                $notificationSubscription->setUser(null);
            }
        }

        return $this;
    }
}
