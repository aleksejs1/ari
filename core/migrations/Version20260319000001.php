<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260319000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create contact_task table (Relationship Playbooks — Phase 1)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
            CREATE TABLE contact_task (
                id            INT AUTO_INCREMENT NOT NULL,
                contact_id    INT NOT NULL,
                tenant_id     INT NOT NULL,
                type          VARCHAR(50)  NOT NULL,
                series_key    VARCHAR(50)  NOT NULL,
                is_offline    TINYINT(1)   NOT NULL DEFAULT 0,
                due_date      DATE         DEFAULT NULL,
                status        VARCHAR(30)  NOT NULL DEFAULT 'pending',
                snoozed_until DATE         DEFAULT NULL,
                reflection_due_at  DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
                completed_at       DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
                created_at         DATETIME NOT NULL    COMMENT '(DC2Type:datetime_immutable)',
                updated_at         DATETIME NOT NULL    COMMENT '(DC2Type:datetime_immutable)',
                INDEX idx_contact_task_contact (contact_id),
                INDEX idx_contact_task_tenant_status_due (tenant_id, status, due_date),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);

        $this->addSql('ALTER TABLE contact_task ADD CONSTRAINT fk_contact_task_contact FOREIGN KEY (contact_id) REFERENCES contact (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_task ADD CONSTRAINT fk_contact_task_tenant  FOREIGN KEY (tenant_id)  REFERENCES user    (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE contact_task DROP FOREIGN KEY fk_contact_task_contact');
        $this->addSql('ALTER TABLE contact_task DROP FOREIGN KEY fk_contact_task_tenant');
        $this->addSql('DROP TABLE contact_task');
    }
}
