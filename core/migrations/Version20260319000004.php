<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260319000004 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create task_reflection table (Relationship Playbooks — Phase 3a)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE task_reflection (id INT AUTO_INCREMENT NOT NULL, task_id INT NOT NULL, tenant_id INT NOT NULL, question VARCHAR(500) NOT NULL, answer LONGTEXT DEFAULT NULL, answered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_task_reflection_task (task_id), INDEX IDX_task_reflection_tenant (tenant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE task_reflection ADD CONSTRAINT FK_task_reflection_task FOREIGN KEY (task_id) REFERENCES contact_task (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE task_reflection ADD CONSTRAINT FK_task_reflection_tenant FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE task_reflection DROP FOREIGN KEY FK_task_reflection_task');
        $this->addSql('ALTER TABLE task_reflection DROP FOREIGN KEY FK_task_reflection_tenant');
        $this->addSql('DROP TABLE task_reflection');
    }
}
