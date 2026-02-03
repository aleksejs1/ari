<?php

namespace Ari\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use Ari\Repository\SystemSettingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SystemSettingRepository::class)]
#[ORM\Table(name: 'system_setting')]
#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('ROLE_USER')",
            provider: 'Ari\State\SystemSettingProvider'
        ),
        new Put(
            security: "is_granted('ROLE_ADMIN')",
            provider: 'Ari\State\SystemSettingProvider'
        ),
    ]
)]
class SystemSetting
{
    #[ORM\Id]
    #[ORM\Column(length: 64)]
    private string $id;

    #[ORM\Column(type: Types::TEXT)]
    private string $value;

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }
}
