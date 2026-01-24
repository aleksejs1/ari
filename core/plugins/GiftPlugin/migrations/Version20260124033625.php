<?php

declare(strict_types=1);

namespace Plugins\GiftPlugin\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260124033625 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE plg_gift_list (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, event_date DATE DEFAULT NULL COMMENT \'(DC2Type:date_immutable)\', INDEX IDX_F9945B1A9033212A (tenant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE plg_gift_list ADD CONSTRAINT FK_F9945B1A9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE plg_gift_list DROP FOREIGN KEY FK_F9945B1A9033212A');
        $this->addSql('DROP TABLE plg_gift_list');
    }
}
