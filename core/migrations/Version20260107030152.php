<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260107030152 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9AE7A1254A');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9AE7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9AE7A1254A');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9AE7A1254A FOREIGN KEY (contact_id) REFERENCES contact (id)');
    }
}
