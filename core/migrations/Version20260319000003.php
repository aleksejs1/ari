<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260319000003 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add playbook_id FK to contact_task (Relationship Playbooks — Phase 2)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE contact_task ADD playbook_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE contact_task ADD CONSTRAINT fk_contact_task_playbook FOREIGN KEY (playbook_id) REFERENCES contact_playbook (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX idx_contact_task_playbook ON contact_task (playbook_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE contact_task DROP FOREIGN KEY fk_contact_task_playbook');
        $this->addSql('DROP INDEX idx_contact_task_playbook ON contact_task');
        $this->addSql('ALTER TABLE contact_task DROP COLUMN playbook_id');
    }
}
