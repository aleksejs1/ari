<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260108035050 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9A744E0351');
        $this->addSql('ALTER TABLE notification_queue CHANGE rule_id rule_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9A744E0351 FOREIGN KEY (rule_id) REFERENCES notification_rule (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification_queue DROP FOREIGN KEY FK_B9499A9A744E0351');
        $this->addSql('ALTER TABLE notification_queue CHANGE rule_id rule_id INT NOT NULL');
        $this->addSql('ALTER TABLE notification_queue ADD CONSTRAINT FK_B9499A9A744E0351 FOREIGN KEY (rule_id) REFERENCES notification_rule (id)');
    }
}
