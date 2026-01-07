<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260107032435 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_4C62E638D17F50A6 ON contact');
        $this->addSql('CREATE UNIQUE INDEX unique_contact_uuid_per_user ON contact (uuid, user_id)');
        $this->addSql('DROP INDEX UNIQ_6DC044C5D17F50A6 ON `group`');
        $this->addSql('CREATE UNIQUE INDEX unique_group_uuid_per_user ON `group` (uuid, user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX unique_group_uuid_per_user ON `group`');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6DC044C5D17F50A6 ON `group` (uuid)');
        $this->addSql('DROP INDEX unique_contact_uuid_per_user ON contact');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4C62E638D17F50A6 ON contact (uuid)');
    }
}
