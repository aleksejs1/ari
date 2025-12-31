<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251231050225 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contact_address (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, contact_id INT NOT NULL, type VARCHAR(255) DEFAULT NULL, street VARCHAR(255) DEFAULT NULL, street_extended VARCHAR(255) DEFAULT NULL, city VARCHAR(255) DEFAULT NULL, region VARCHAR(255) DEFAULT NULL, postal_code VARCHAR(20) DEFAULT NULL, country VARCHAR(255) DEFAULT NULL, country_code VARCHAR(10) DEFAULT NULL, INDEX IDX_97614E009033212A (tenant_id), INDEX IDX_97614E00E7A1254A (contact_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contact_address ADD CONSTRAINT FK_97614E009033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_address ADD CONSTRAINT FK_97614E00E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_address DROP FOREIGN KEY FK_97614E009033212A');
        $this->addSql('ALTER TABLE contact_address DROP FOREIGN KEY FK_97614E00E7A1254A');
        $this->addSql('DROP TABLE contact_address');
    }
}
