<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260122031450 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contact_interaction (id INT AUTO_INCREMENT NOT NULL, contact_id INT NOT NULL, tenant_id INT NOT NULL, type VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, timestamp DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_59214219E7A1254A (contact_id), INDEX IDX_592142199033212A (tenant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contact_interaction ADD CONSTRAINT FK_59214219E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE contact_interaction ADD CONSTRAINT FK_592142199033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_interaction DROP FOREIGN KEY FK_59214219E7A1254A');
        $this->addSql('ALTER TABLE contact_interaction DROP FOREIGN KEY FK_592142199033212A');
        $this->addSql('DROP TABLE contact_interaction');
    }
}
