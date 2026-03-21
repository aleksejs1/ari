<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260321000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add composite index on contact_interaction(contact_id, timestamp) for findByContactForEmbed sort';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE INDEX idx_contact_interaction_contact_timestamp ON contact_interaction (contact_id, timestamp)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_contact_interaction_contact_timestamp ON contact_interaction');
    }
}
