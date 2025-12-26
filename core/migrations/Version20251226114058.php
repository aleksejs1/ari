<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251226114058 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE notification_channel (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, user_id INT NOT NULL, type VARCHAR(255) NOT NULL, config JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', verified_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_B7E704F09033212A (tenant_id), INDEX IDX_B7E704F0A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification_intent (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, channel_id INT NOT NULL, payload JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', INDEX IDX_7ACB054C9033212A (tenant_id), INDEX IDX_7ACB054C72F5A1AA (channel_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification_subscription (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, tenant_id INT NOT NULL, channel_id INT DEFAULT NULL, entity_type VARCHAR(255) NOT NULL, entity_id INT NOT NULL, enabled INT NOT NULL, INDEX IDX_A2C88EE6A76ED395 (user_id), INDEX IDX_A2C88EE69033212A (tenant_id), INDEX IDX_A2C88EE672F5A1AA (channel_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE notification_channel ADD CONSTRAINT FK_B7E704F09033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_channel ADD CONSTRAINT FK_B7E704F0A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_intent ADD CONSTRAINT FK_7ACB054C9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_intent ADD CONSTRAINT FK_7ACB054C72F5A1AA FOREIGN KEY (channel_id) REFERENCES notification_channel (id)');
        $this->addSql('ALTER TABLE notification_subscription ADD CONSTRAINT FK_A2C88EE6A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_subscription ADD CONSTRAINT FK_A2C88EE69033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_subscription ADD CONSTRAINT FK_A2C88EE672F5A1AA FOREIGN KEY (channel_id) REFERENCES notification_channel (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification_channel DROP FOREIGN KEY FK_B7E704F09033212A');
        $this->addSql('ALTER TABLE notification_channel DROP FOREIGN KEY FK_B7E704F0A76ED395');
        $this->addSql('ALTER TABLE notification_intent DROP FOREIGN KEY FK_7ACB054C9033212A');
        $this->addSql('ALTER TABLE notification_intent DROP FOREIGN KEY FK_7ACB054C72F5A1AA');
        $this->addSql('ALTER TABLE notification_subscription DROP FOREIGN KEY FK_A2C88EE6A76ED395');
        $this->addSql('ALTER TABLE notification_subscription DROP FOREIGN KEY FK_A2C88EE69033212A');
        $this->addSql('ALTER TABLE notification_subscription DROP FOREIGN KEY FK_A2C88EE672F5A1AA');
        $this->addSql('DROP TABLE notification_channel');
        $this->addSql('DROP TABLE notification_intent');
        $this->addSql('DROP TABLE notification_subscription');
    }
}
