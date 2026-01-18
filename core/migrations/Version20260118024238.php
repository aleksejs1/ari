<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260118024238 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contact_avatar (id BINARY(16) NOT NULL COMMENT \'(DC2Type:ulid)\', contact_id INT NOT NULL, tenant_id INT NOT NULL, path VARCHAR(255) NOT NULL, thumbnail_data LONGBLOB DEFAULT NULL, mime_type VARCHAR(100) NOT NULL, size INT NOT NULL, UNIQUE INDEX UNIQ_86E545AEE7A1254A (contact_id), INDEX IDX_86E545AE9033212A (tenant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contact_avatar ADD CONSTRAINT FK_86E545AEE7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_avatar ADD CONSTRAINT FK_86E545AE9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE audit_log CHANGE entity_id entity_id VARCHAR(100) DEFAULT NULL, CHANGE owner_entity_id owner_entity_id VARCHAR(100) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_avatar DROP FOREIGN KEY FK_86E545AEE7A1254A');
        $this->addSql('ALTER TABLE contact_avatar DROP FOREIGN KEY FK_86E545AE9033212A');
        $this->addSql('DROP TABLE contact_avatar');
        $this->addSql('ALTER TABLE audit_log CHANGE entity_id entity_id INT DEFAULT NULL, CHANGE owner_entity_id owner_entity_id INT DEFAULT NULL');
    }
}
