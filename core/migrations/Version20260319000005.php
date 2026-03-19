<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260319000005 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add updated_at to task_reflection (Phase 3a review fix)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE task_reflection ADD updated_at DATETIME NOT NULL DEFAULT NOW() COMMENT '(DC2Type:datetime_immutable)'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE task_reflection DROP updated_at');
    }
}
