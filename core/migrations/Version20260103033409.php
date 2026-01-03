<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260103033409 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_pref (id INT AUTO_INCREMENT NOT NULL, tenant_id INT NOT NULL, user_id INT NOT NULL, type VARCHAR(255) NOT NULL, value VARCHAR(255) DEFAULT NULL, INDEX IDX_DBD4D4F89033212A (tenant_id), INDEX IDX_DBD4D4F8A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_pref ADD CONSTRAINT FK_DBD4D4F89033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_pref ADD CONSTRAINT FK_DBD4D4F8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_pref DROP FOREIGN KEY FK_DBD4D4F89033212A');
        $this->addSql('ALTER TABLE user_pref DROP FOREIGN KEY FK_DBD4D4F8A76ED395');
        $this->addSql('DROP TABLE user_pref');
    }
}
