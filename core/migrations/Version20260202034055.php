<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260202034055 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_plugin (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, plugin_id VARCHAR(128) NOT NULL, enabled TINYINT(1) NOT NULL, activated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_8C3C3CA99033212A (tenant_id), UNIQUE INDEX unique_user_plugin (tenant_id, plugin_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_plugin ADD CONSTRAINT FK_8C3C3CA99033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_plugin DROP FOREIGN KEY FK_8C3C3CA99033212A');
        $this->addSql('DROP TABLE user_plugin');
    }
}
