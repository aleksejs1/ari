<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260102114712 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contact_relation (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, contact_id INT NOT NULL, person_id INT NOT NULL, type VARCHAR(255) DEFAULT NULL, INDEX IDX_F8ACDBDE9033212A (tenant_id), INDEX IDX_F8ACDBDEE7A1254A (contact_id), INDEX IDX_F8ACDBDE217BBB47 (person_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contact_relation ADD CONSTRAINT FK_F8ACDBDE9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE contact_relation ADD CONSTRAINT FK_F8ACDBDEE7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
        $this->addSql('ALTER TABLE contact_relation ADD CONSTRAINT FK_F8ACDBDE217BBB47 FOREIGN KEY (person_id) REFERENCES contact (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_relation DROP FOREIGN KEY FK_F8ACDBDE9033212A');
        $this->addSql('ALTER TABLE contact_relation DROP FOREIGN KEY FK_F8ACDBDEE7A1254A');
        $this->addSql('ALTER TABLE contact_relation DROP FOREIGN KEY FK_F8ACDBDE217BBB47');
        $this->addSql('DROP TABLE contact_relation');
    }
}
