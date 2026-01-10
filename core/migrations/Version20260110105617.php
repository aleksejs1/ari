<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260110105617 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE activity_feed DROP FOREIGN KEY FK_20849F399033212A');
        $this->addSql('ALTER TABLE activity_feed ADD CONSTRAINT FK_20849F399033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE audit_log DROP FOREIGN KEY FK_F6E1C0F59033212A');
        $this->addSql('ALTER TABLE audit_log ADD CONSTRAINT FK_F6E1C0F59033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact DROP FOREIGN KEY FK_4C62E63860D47263');
        $this->addSql('ALTER TABLE contact ADD CONSTRAINT FK_4C62E6389033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_address DROP FOREIGN KEY FK_97614E009033212A');
        $this->addSql('ALTER TABLE contact_address ADD CONSTRAINT FK_97614E009033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_biography DROP FOREIGN KEY FK_8D4245279033212A');
        $this->addSql('ALTER TABLE contact_biography ADD CONSTRAINT FK_8D4245279033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_date DROP FOREIGN KEY FK_8261B58560D47263');
        $this->addSql('ALTER TABLE contact_date ADD CONSTRAINT FK_8261B5859033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_email_adress DROP FOREIGN KEY FK_DC1267A9033212A');
        $this->addSql('ALTER TABLE contact_email_adress ADD CONSTRAINT FK_DC1267A9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_group DROP FOREIGN KEY FK_40EA54CA9033212A');
        $this->addSql('ALTER TABLE contact_group ADD CONSTRAINT FK_40EA54CA9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_name DROP FOREIGN KEY FK_76DCFCF960D47263');
        $this->addSql('ALTER TABLE contact_name ADD CONSTRAINT FK_76DCFCF99033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_organization DROP FOREIGN KEY FK_ED5951489033212A');
        $this->addSql('ALTER TABLE contact_organization ADD CONSTRAINT FK_ED5951489033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_phone_number DROP FOREIGN KEY FK_6B01BC5B9033212A');
        $this->addSql('ALTER TABLE contact_phone_number ADD CONSTRAINT FK_47B68E6F9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_relation DROP FOREIGN KEY FK_F8ACDBDE9033212A');
        $this->addSql('ALTER TABLE contact_relation ADD CONSTRAINT FK_F8ACDBDE9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE `group` DROP FOREIGN KEY FK_6DC044C59033212A');
        $this->addSql('ALTER TABLE `group` ADD CONSTRAINT FK_6DC044C59033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF685669033212A');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF685669033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE notification_channel DROP FOREIGN KEY FK_B7E704F09033212A');
        $this->addSql('ALTER TABLE notification_channel ADD CONSTRAINT FK_B7E704F09033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE notification_intent DROP FOREIGN KEY FK_7ACB054C9033212A');
        $this->addSql('ALTER TABLE notification_intent ADD CONSTRAINT FK_7ACB054C9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9A9033212A');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9A9033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE notification_subscription DROP FOREIGN KEY FK_A2C88EE69033212A');
        $this->addSql('ALTER TABLE notification_subscription ADD CONSTRAINT FK_A2C88EE69033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE token_storage DROP FOREIGN KEY FK_BA7502B79033212A');
        $this->addSql('ALTER TABLE token_storage ADD CONSTRAINT FK_BA7502B79033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_pref DROP FOREIGN KEY FK_DBD4D4F89033212A');
        $this->addSql('ALTER TABLE user_pref ADD CONSTRAINT FK_DBD4D4F89033212A FOREIGN KEY (tenant_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_phone_number DROP FOREIGN KEY FK_47B68E6F9033212A');
        $this->addSql('ALTER TABLE contact_phone_number ADD CONSTRAINT FK_6B01BC5B9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_biography DROP FOREIGN KEY FK_8D4245279033212A');
        $this->addSql('ALTER TABLE contact_biography ADD CONSTRAINT FK_8D4245279033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_name DROP FOREIGN KEY FK_76DCFCF99033212A');
        $this->addSql('ALTER TABLE contact_name ADD CONSTRAINT FK_76DCFCF960D47263 FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_address DROP FOREIGN KEY FK_97614E009033212A');
        $this->addSql('ALTER TABLE contact_address ADD CONSTRAINT FK_97614E009033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9A9033212A');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9A9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE `group` DROP FOREIGN KEY FK_6DC044C59033212A');
        $this->addSql('ALTER TABLE `group` ADD CONSTRAINT FK_6DC044C59033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_channel DROP FOREIGN KEY FK_B7E704F09033212A');
        $this->addSql('ALTER TABLE notification_channel ADD CONSTRAINT FK_B7E704F09033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact DROP FOREIGN KEY FK_4C62E6389033212A');
        $this->addSql('ALTER TABLE contact ADD CONSTRAINT FK_4C62E63860D47263 FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_group DROP FOREIGN KEY FK_40EA54CA9033212A');
        $this->addSql('ALTER TABLE contact_group ADD CONSTRAINT FK_40EA54CA9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_organization DROP FOREIGN KEY FK_ED5951489033212A');
        $this->addSql('ALTER TABLE contact_organization ADD CONSTRAINT FK_ED5951489033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_relation DROP FOREIGN KEY FK_F8ACDBDE9033212A');
        $this->addSql('ALTER TABLE contact_relation ADD CONSTRAINT FK_F8ACDBDE9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF685669033212A');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF685669033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE token_storage DROP FOREIGN KEY FK_BA7502B79033212A');
        $this->addSql('ALTER TABLE token_storage ADD CONSTRAINT FK_BA7502B79033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_intent DROP FOREIGN KEY FK_7ACB054C9033212A');
        $this->addSql('ALTER TABLE notification_intent ADD CONSTRAINT FK_7ACB054C9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification_subscription DROP FOREIGN KEY FK_A2C88EE69033212A');
        $this->addSql('ALTER TABLE notification_subscription ADD CONSTRAINT FK_A2C88EE69033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE activity_feed DROP FOREIGN KEY FK_20849F399033212A');
        $this->addSql('ALTER TABLE activity_feed ADD CONSTRAINT FK_20849F399033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_pref DROP FOREIGN KEY FK_DBD4D4F89033212A');
        $this->addSql('ALTER TABLE user_pref ADD CONSTRAINT FK_DBD4D4F89033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE audit_log DROP FOREIGN KEY FK_F6E1C0F59033212A');
        $this->addSql('ALTER TABLE audit_log ADD CONSTRAINT FK_F6E1C0F59033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_email_adress DROP FOREIGN KEY FK_DC1267A9033212A');
        $this->addSql('ALTER TABLE contact_email_adress ADD CONSTRAINT FK_DC1267A9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_date DROP FOREIGN KEY FK_8261B5859033212A');
        $this->addSql('ALTER TABLE contact_date ADD CONSTRAINT FK_8261B58560D47263 FOREIGN KEY (tenant_id) REFERENCES user (id)');
    }
}
