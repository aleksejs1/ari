<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251231091832 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `group` (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, user_id INT NOT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_6DC044C59033212A (tenant_id), INDEX IDX_6DC044C5A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE `group` ADD CONSTRAINT FK_6DC044C59033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE `group` ADD CONSTRAINT FK_6DC044C5A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `group` DROP FOREIGN KEY FK_6DC044C59033212A');
        $this->addSql('ALTER TABLE `group` DROP FOREIGN KEY FK_6DC044C5A76ED395');
        $this->addSql('DROP TABLE `group`');
    }
}
