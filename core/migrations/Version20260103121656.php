<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260103121656 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_group DROP FOREIGN KEY FK_40EA54CAAC8A82E4');
        $this->addSql('ALTER TABLE contact_group DROP FOREIGN KEY FK_40EA54CAE7A1254A');
        $this->addSql('ALTER TABLE contact_group ADD CONSTRAINT FK_40EA54CAAC8A82E4 FOREIGN KEY (group_resource_id) REFERENCES `group` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_group ADD CONSTRAINT FK_40EA54CAE7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF68566FE54D947');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF68566A76ED395');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF68566E7A1254A');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF68566FE54D947 FOREIGN KEY (group_id) REFERENCES `group` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF68566A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF68566E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_group DROP FOREIGN KEY FK_40EA54CAE7A1254A');
        $this->addSql('ALTER TABLE contact_group DROP FOREIGN KEY FK_40EA54CAAC8A82E4');
        $this->addSql('ALTER TABLE contact_group ADD CONSTRAINT FK_40EA54CAE7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE contact_group ADD CONSTRAINT FK_40EA54CAAC8A82E4 FOREIGN KEY (group_resource_id) REFERENCES `group` (id)');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF68566A76ED395');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF68566E7A1254A');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF68566FE54D947');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF68566A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF68566E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF68566FE54D947 FOREIGN KEY (group_id) REFERENCES `group` (id)');
    }
}
