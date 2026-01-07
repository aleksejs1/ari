<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Put;
use App\Repository\UserPrefRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

#[ORM\Entity(repositoryClass: UserPrefRepository::class)]
#[ORM\UniqueConstraint(name: 'unique_user_pref_type', columns: ['user_id', 'type'])]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['user_pref:read']],
    denormalizationContext: ['groups' => ['user_pref:create', 'user_pref:update']],
    validationContext: ['groups' => ['Default', 'user_pref:create', 'user_pref:update']],
    operations: [
        new Get(
            uriTemplate: '/user_prefs/{type}',
            requirements: ['type' => '\w+'],
            provider: 'App\State\UserPrefStateProvider',
            security: "is_granted('USER_PREF_VIEW', object)"
        ),
        new GetCollection(), // Optional: if we want to list all prefs
        new Put(
            uriTemplate: '/user_prefs/{type}',
            requirements: ['type' => '\w+'],
            provider: 'App\State\UserPrefStateProvider',
            processor: 'App\State\UserPrefProcessor',
            security: "is_granted('USER_PREF_EDIT', object)"
        ),
        new Patch(
            uriTemplate: '/user_prefs/{type}',
            requirements: ['type' => '\w+'],
            provider: 'App\State\UserPrefStateProvider',
            processor: 'App\State\UserPrefProcessor',
            security: "is_granted('USER_PREF_EDIT', object)"
        ),
        new Delete(
            uriTemplate: '/user_prefs/{type}',
            requirements: ['type' => '\w+'],
            provider: 'App\State\UserPrefStateProvider',
            security: "is_granted('USER_PREF_EDIT', object)"
        ),
    ]
)]
#[Assert\Callback(callback: 'validateValue')]
class UserPref implements TenantAwareInterface
{
    use TenantAwareTrait;

    public const TYPE_LANGUAGE = 'language';
    public const TYPE_DATE_FORMAT = 'dateFormat';
    public const TYPE_TIME_FORMAT = 'timeFormat';
    public const TYPE_FAVOURITE_GROUP_NAME = 'favourite_group_name';

    public const ALLOWED_TYPES = [
        self::TYPE_LANGUAGE,
        self::TYPE_DATE_FORMAT,
        self::TYPE_TIME_FORMAT,
        self::TYPE_FAVOURITE_GROUP_NAME,
    ];

    public const DEFAULTS = [
        self::TYPE_LANGUAGE => 'en',
        self::TYPE_DATE_FORMAT => 'mm/dd/yyyy',
        self::TYPE_TIME_FORMAT => '24h',
        self::TYPE_FAVOURITE_GROUP_NAME => 'favourite',
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'userPrefs')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_pref:read', 'user_pref:create', 'user_pref:update'])]
    #[Assert\Choice(choices: self::ALLOWED_TYPES)]
    #[ApiProperty(identifier: true)]
    private ?string $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user_pref:read', 'user_pref:create', 'user_pref:update'])]
    private ?string $value = null;

    public function validateValue(ExecutionContextInterface $context): void
    {
        if (self::TYPE_LANGUAGE === $this->type) {
            if (!in_array($this->value, ['ru', 'en'], true)) {
                $context->buildViolation('Invalid language')
                    ->atPath('value')
                    ->addViolation();
            }
        } elseif (self::TYPE_DATE_FORMAT === $this->type) {
            if (!in_array($this->value, ['mm/dd/yyyy', 'dd.mm.yyyy'], true)) {
                $context->buildViolation('Invalid date format')
                   ->atPath('value')
                   ->addViolation();
            }
        } elseif (self::TYPE_TIME_FORMAT === $this->type) {
            if (!in_array($this->value, ['24h', '12h'], true)) {
                $context->buildViolation('Invalid time format')
                   ->atPath('value')
                   ->addViolation();
            }
        } elseif (self::TYPE_FAVOURITE_GROUP_NAME === $this->type) {
            // Any string is allowed, so no strict validation needed other than type check if necessary,
            // but the property is string type hint.
            // If empty string is not allowed, we could check that, but requirement says "any string".
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): static
    {
        $this->value = $value;

        return $this;
    }
}
