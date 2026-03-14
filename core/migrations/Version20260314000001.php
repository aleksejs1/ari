<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260314000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add api_key table and actor_label to audit_log';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE api_key (id VARCHAR(36) NOT NULL, tenant_id INT NOT NULL, name VARCHAR(100) NOT NULL, scopes JSON NOT NULL, secret_hash VARCHAR(64) NOT NULL, secret_last_four VARCHAR(4) NOT NULL, last_used_at DATETIME DEFAULT NULL, last_used_ip VARCHAR(45) DEFAULT NULL, app_type VARCHAR(50) DEFAULT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_api_key_tenant (tenant_id), INDEX idx_api_key_secret_hash (secret_hash), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE api_key ADD CONSTRAINT FK_C912ED9D9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE audit_log ADD actor_label VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE api_key DROP FOREIGN KEY FK_C912ED9D9033212A');
        $this->addSql('DROP TABLE api_key');
        $this->addSql('ALTER TABLE audit_log DROP COLUMN actor_label');
    }
}
