<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260321000002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add composite index on contact_task(playbook_id, series_key, status) for findActiveTaskForSeries';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE INDEX idx_contact_task_playbook_series_status ON contact_task (playbook_id, series_key, status)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_contact_task_playbook_series_status ON contact_task');
    }
}
