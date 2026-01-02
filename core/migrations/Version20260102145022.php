<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260102145022 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE import_mapping (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, user_id INT NOT NULL, contact_id INT NOT NULL, type VARCHAR(255) NOT NULL, external_id INT DEFAULT NULL, INDEX IDX_5AF685669033212A (tenant_id), INDEX IDX_5AF68566A76ED395 (user_id), INDEX IDX_5AF68566E7A1254A (contact_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF685669033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF68566A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF68566E7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF685669033212A');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF68566A76ED395');
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF68566E7A1254A');
        $this->addSql('DROP TABLE import_mapping');
    }
}
