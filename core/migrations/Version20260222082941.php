<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260222082941 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add ai_suggestion table and locale/name_type fields to contact_name';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE ai_suggestion (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, entity_type VARCHAR(64) NOT NULL, entity_id INT NOT NULL, suggestion_type VARCHAR(64) NOT NULL, source_hash VARCHAR(32) NOT NULL, payload JSON NOT NULL COMMENT \'(DC2Type:json)\', status VARCHAR(16) NOT NULL, provider_used VARCHAR(32) DEFAULT NULL, model_used VARCHAR(255) DEFAULT NULL, tokens_prompt INT DEFAULT NULL, tokens_completion INT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', resolved_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_BCA6A14F9033212A (tenant_id), INDEX idx_ai_suggestion_tenant_status (tenant_id, status), INDEX idx_ai_suggestion_entity (tenant_id, entity_type, entity_id), UNIQUE INDEX uniq_ai_suggestion (tenant_id, entity_type, entity_id, suggestion_type, source_hash), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE ai_suggestion ADD CONSTRAINT FK_BCA6A14F9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_name ADD locale VARCHAR(16) DEFAULT NULL, ADD name_type VARCHAR(128) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ai_suggestion DROP FOREIGN KEY FK_BCA6A14F9033212A');
        $this->addSql('DROP TABLE ai_suggestion');
        $this->addSql('ALTER TABLE contact_name DROP locale, DROP name_type');
    }
}
