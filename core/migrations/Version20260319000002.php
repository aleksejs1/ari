<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260319000002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create contact_playbook table (Relationship Playbooks — Phase 2)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
            CREATE TABLE contact_playbook (
                id                   INT AUTO_INCREMENT NOT NULL,
                contact_id           INT NOT NULL,
                tenant_id            INT NOT NULL,
                preset               VARCHAR(60)  NOT NULL,
                goal                 VARCHAR(20)  NOT NULL,
                why_tags             JSON         DEFAULT NULL,
                why_text             LONGTEXT     DEFAULT NULL,
                status               VARCHAR(20)  NOT NULL DEFAULT 'active',
                celebration_pending  TINYINT(1)   NOT NULL DEFAULT 0,
                created_at           DATETIME     NOT NULL COMMENT '(DC2Type:datetime_immutable)',
                updated_at           DATETIME     NOT NULL COMMENT '(DC2Type:datetime_immutable)',
                INDEX idx_contact_playbook_tenant_status (tenant_id, status),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);

        $this->addSql('ALTER TABLE contact_playbook ADD CONSTRAINT fk_contact_playbook_contact FOREIGN KEY (contact_id) REFERENCES contact (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_playbook ADD CONSTRAINT fk_contact_playbook_tenant  FOREIGN KEY (tenant_id)  REFERENCES user    (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE contact_playbook DROP FOREIGN KEY fk_contact_playbook_contact');
        $this->addSql('ALTER TABLE contact_playbook DROP FOREIGN KEY fk_contact_playbook_tenant');
        $this->addSql('DROP TABLE contact_playbook');
    }
}
