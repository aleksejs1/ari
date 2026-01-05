<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260105025941 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE notification_policy (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, user_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, is_active TINYINT(1) NOT NULL, ui_snapshot JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', INDEX IDX_34DAFB4B9033212A (tenant_id), INDEX IDX_34DAFB4BA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification_queue (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, rule_id INT NOT NULL, contact_id INT NOT NULL, channel_id INT NOT NULL, status VARCHAR(20) NOT NULL, scheduled_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', payload JSON NOT NULL COMMENT \'(DC2Type:json)\', result VARCHAR(255) DEFAULT NULL, attempts INT NOT NULL, INDEX IDX_B9499A9A9033212A (tenant_id), INDEX IDX_B9499A9A744E0351 (rule_id), INDEX IDX_B9499A9AE7A1254A (contact_id), INDEX IDX_B9499A9A72F5A1AA (channel_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification_rule (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, policy_id INT NOT NULL, channel_id INT DEFAULT NULL, contact_group_id INT DEFAULT NULL, contact_id INT DEFAULT NULL, target_type VARCHAR(255) DEFAULT NULL, event_type VARCHAR(255) DEFAULT NULL, offset_days INT NOT NULL, offset_time INT NOT NULL, INDEX IDX_FEE4E7F69033212A (tenant_id), INDEX IDX_FEE4E7F62D29E3C6 (policy_id), INDEX IDX_FEE4E7F672F5A1AA (channel_id), INDEX IDX_FEE4E7F6647145D0 (contact_group_id), INDEX IDX_FEE4E7F6E7A1254A (contact_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE notification_policy ADD CONSTRAINT FK_34DAFB4B9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_policy ADD CONSTRAINT FK_34DAFB4BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9A9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9A744E0351 FOREIGN KEY (rule_id) REFERENCES notification_rule (id)');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9AE7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9A72F5A1AA FOREIGN KEY (channel_id) REFERENCES notification_channel (id)');
        $this->addSql('ALTER TABLE notification_rule ADD CONSTRAINT FK_FEE4E7F69033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_rule ADD CONSTRAINT FK_FEE4E7F62D29E3C6 FOREIGN KEY (policy_id) REFERENCES notification_policy (id)');
        $this->addSql('ALTER TABLE notification_rule ADD CONSTRAINT FK_FEE4E7F672F5A1AA FOREIGN KEY (channel_id) REFERENCES notification_channel (id)');
        $this->addSql('ALTER TABLE notification_rule ADD CONSTRAINT FK_FEE4E7F6647145D0 FOREIGN KEY (contact_group_id) REFERENCES `group` (id)');
        $this->addSql('ALTER TABLE notification_rule ADD CONSTRAINT FK_FEE4E7F6E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification_policy DROP FOREIGN KEY FK_34DAFB4B9033212A');
        $this->addSql('ALTER TABLE notification_policy DROP FOREIGN KEY FK_34DAFB4BA76ED395');
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9A9033212A');
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9A744E0351');
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9AE7A1254A');
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9A72F5A1AA');
        $this->addSql('ALTER TABLE notification_rule DROP FOREIGN KEY FK_FEE4E7F69033212A');
        $this->addSql('ALTER TABLE notification_rule DROP FOREIGN KEY FK_FEE4E7F62D29E3C6');
        $this->addSql('ALTER TABLE notification_rule DROP FOREIGN KEY FK_FEE4E7F672F5A1AA');
        $this->addSql('ALTER TABLE notification_rule DROP FOREIGN KEY FK_FEE4E7F6647145D0');
        $this->addSql('ALTER TABLE notification_rule DROP FOREIGN KEY FK_FEE4E7F6E7A1254A');
        $this->addSql('DROP TABLE notification_policy');
        $this->addSql('DROP TABLE notification_queue');
        $this->addSql('DROP TABLE notification_rule');
    }
}
