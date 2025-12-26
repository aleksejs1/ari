<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251226042203 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE audit_log (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, tenant_id INT NOT NULL, entity_type VARCHAR(255) NOT NULL, entity_id INT NOT NULL, action VARCHAR(255) NOT NULL, changes JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', snapshot_before JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', snapshot_after JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX IDX_F6E1C0F5A76ED395 (user_id), INDEX IDX_F6E1C0F59033212A (tenant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE audit_log ADD CONSTRAINT FK_F6E1C0F5A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE audit_log ADD CONSTRAINT FK_F6E1C0F59033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact RENAME INDEX idx_4c62e63860d47263 TO IDX_4C62E6389033212A');
        $this->addSql('ALTER TABLE contact_date RENAME INDEX idx_8261b58560d47263 TO IDX_8261B5859033212A');
        $this->addSql('ALTER TABLE contact_name RENAME INDEX idx_76dcfcf960d47263 TO IDX_76DCFCF99033212A');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE audit_log DROP FOREIGN KEY FK_F6E1C0F5A76ED395');
        $this->addSql('ALTER TABLE audit_log DROP FOREIGN KEY FK_F6E1C0F59033212A');
        $this->addSql('DROP TABLE audit_log');
        $this->addSql('ALTER TABLE contact_name RENAME INDEX idx_76dcfcf99033212a TO IDX_76DCFCF960D47263');
        $this->addSql('ALTER TABLE contact RENAME INDEX idx_4c62e6389033212a TO IDX_4C62E63860D47263');
        $this->addSql('ALTER TABLE contact_date RENAME INDEX idx_8261b5859033212a TO IDX_8261B58560D47263');
    }
}
