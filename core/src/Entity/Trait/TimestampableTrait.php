<?php

declare(strict_types=1);

namespace Ari\Entity\Trait;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

/**
 * Provides createdAt / updatedAt lifecycle callbacks.
 *
 * Requirements:
 *   - The entity class must declare #[ORM\HasLifecycleCallbacks].
 *   - Add the two column definitions in the entity (they cannot be declared in a trait
 *     due to Doctrine attribute inheritance limitations in PHP 8.x):
 *
 *     #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
 *     private ?\DateTimeImmutable $createdAt = null;
 *
 *     #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
 *     private ?\DateTimeImmutable $updatedAt = null;
 */
trait TimestampableTrait
{
    #[ORM\PrePersist]
    public function initTimestamps(): void
    {
        $now = new \DateTimeImmutable();
        $this->createdAt ??= $now;
        $this->updatedAt ??= $now;
    }

    #[ORM\PreUpdate]
    public function touchUpdatedAt(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
}
