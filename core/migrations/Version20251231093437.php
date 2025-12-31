<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251231093437 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contact_group (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, contact_id INT NOT NULL, group_resource_id INT NOT NULL, INDEX IDX_40EA54CA9033212A (tenant_id), INDEX IDX_40EA54CAE7A1254A (contact_id), INDEX IDX_40EA54CAAC8A82E4 (group_resource_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contact_group ADD CONSTRAINT FK_40EA54CA9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_group ADD CONSTRAINT FK_40EA54CAE7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE contact_group ADD CONSTRAINT FK_40EA54CAAC8A82E4 FOREIGN KEY (group_resource_id) REFERENCES `group` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_group DROP FOREIGN KEY FK_40EA54CA9033212A');
        $this->addSql('ALTER TABLE contact_group DROP FOREIGN KEY FK_40EA54CAE7A1254A');
        $this->addSql('ALTER TABLE contact_group DROP FOREIGN KEY FK_40EA54CAAC8A82E4');
        $this->addSql('DROP TABLE contact_group');
    }
}
