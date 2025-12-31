<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251231040719 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contact_email_adress (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, contact_id INT NOT NULL, value VARCHAR(255) DEFAULT NULL, type VARCHAR(255) DEFAULT NULL, INDEX IDX_DC1267A9033212A (tenant_id), INDEX IDX_DC1267AE7A1254A (contact_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contact_email_adress ADD CONSTRAINT FK_DC1267A9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_email_adress ADD CONSTRAINT FK_DC1267AE7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE contact_phone_number RENAME INDEX idx_6b01bc5be7a1254a TO IDX_47B68E6FE7A1254A');
        $this->addSql('ALTER TABLE contact_phone_number RENAME INDEX idx_6b01bc5b9033212a TO IDX_47B68E6F9033212A');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_email_adress DROP FOREIGN KEY FK_DC1267A9033212A');
        $this->addSql('ALTER TABLE contact_email_adress DROP FOREIGN KEY FK_DC1267AE7A1254A');
        $this->addSql('DROP TABLE contact_email_adress');
        $this->addSql('ALTER TABLE contact_phone_number RENAME INDEX idx_47b68e6f9033212a TO IDX_6B01BC5B9033212A');
        $this->addSql('ALTER TABLE contact_phone_number RENAME INDEX idx_47b68e6fe7a1254a TO IDX_6B01BC5BE7A1254A');
    }
}
