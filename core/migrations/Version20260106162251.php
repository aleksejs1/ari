<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260106162251 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        // Contact
        $this->addSql('ALTER TABLE contact ADD uuid BINARY(16) DEFAULT NULL COMMENT \'(DC2Type:uuid)\'');
        $this->addSql('UPDATE contact SET uuid = UNHEX(REPLACE(UUID(), "-", ""))');
        $this->addSql('ALTER TABLE contact CHANGE uuid uuid BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\'');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4C62E638D17F50A6 ON contact (uuid)');

        // Group
        $this->addSql('ALTER TABLE `group` ADD uuid BINARY(16) DEFAULT NULL COMMENT \'(DC2Type:uuid)\'');
        $this->addSql('UPDATE `group` SET uuid = UNHEX(REPLACE(UUID(), "-", ""))');
        $this->addSql('ALTER TABLE `group` CHANGE uuid uuid BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\'');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6DC044C5D17F50A6 ON `group` (uuid)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_6DC044C5D17F50A6 ON `group`');
        $this->addSql('ALTER TABLE `group` DROP uuid');
        $this->addSql('DROP INDEX UNIQ_4C62E638D17F50A6 ON contact');
        $this->addSql('ALTER TABLE contact DROP uuid');
    }
}
