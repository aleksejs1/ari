<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260101070220 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contact_organization (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, contact_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, department VARCHAR(255) DEFAULT NULL, title VARCHAR(255) DEFAULT NULL, start_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL, job_description VARCHAR(255) DEFAULT NULL, type VARCHAR(255) DEFAULT NULL, INDEX IDX_ED5951489033212A (tenant_id), INDEX IDX_ED595148E7A1254A (contact_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contact_organization ADD CONSTRAINT FK_ED5951489033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_organization ADD CONSTRAINT FK_ED595148E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_organization DROP FOREIGN KEY FK_ED5951489033212A');
        $this->addSql('ALTER TABLE contact_organization DROP FOREIGN KEY FK_ED595148E7A1254A');
        $this->addSql('DROP TABLE contact_organization');
    }
}
