<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260103112353 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE import_mapping ADD group_id INT DEFAULT NULL, CHANGE contact_id contact_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE import_mapping ADD CONSTRAINT FK_5AF68566FE54D947 FOREIGN KEY (group_id) REFERENCES `group` (id)');
        $this->addSql('CREATE INDEX IDX_5AF68566FE54D947 ON import_mapping (group_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_user_pref_type ON user_pref (user_id, type)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE import_mapping DROP FOREIGN KEY FK_5AF68566FE54D947');
        $this->addSql('DROP INDEX IDX_5AF68566FE54D947 ON import_mapping');
        $this->addSql('ALTER TABLE import_mapping DROP group_id, CHANGE contact_id contact_id INT NOT NULL');
        $this->addSql('DROP INDEX unique_user_pref_type ON user_pref');
    }
}
