<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260118141530 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9A72F5A1AA');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9A72F5A1AA FOREIGN KEY (channel_id) REFERENCES notification_channel (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9A72F5A1AA');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9A72F5A1AA FOREIGN KEY (channel_id) REFERENCES notification_channel (id)');
    }
}
