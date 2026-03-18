<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260318000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add sms_backup_import_batch table for async SMS/call import processing';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE sms_backup_import_batch (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, records LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', status VARCHAR(20) NOT NULL, unknown_numbers VARCHAR(20) NOT NULL, name_conflict VARCHAR(20) NOT NULL, skip_alphanumeric TINYINT(1) NOT NULL, duplicate_strategy VARCHAR(20) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX idx_sms_backup_import_batch_tenant_status (tenant_id, status), INDEX idx_sms_backup_import_batch_created_at (created_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE sms_backup_import_batch');
    }
}
