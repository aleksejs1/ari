<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Phase 1 — Interactions & Cadence entity schema.
 *
 * Changes:
 *   contact             — add cadence_days (nullable INT)
 *   contact_interaction — add initiator (VARCHAR 10, nullable)
 *                       — add tags (JSON, nullable)
 *                       — add created_at (DATETIME NOT NULL, defaults to NOW() for existing rows)
 *   New index idx_ci_contact_timestamp on (contact_id, timestamp DESC) for
 *   efficient "last interaction per contact" queries used by NeedsAttentionProvider.
 */
final class Version20260317000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Interactions & Cadence Phase 1: add cadence_days to contact, add initiator/tags/created_at to contact_interaction, add index';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE contact ADD cadence_days INT DEFAULT NULL');

        // created_at defaults to CURRENT_TIMESTAMP so existing rows get a sensible value.
        $this->addSql('ALTER TABLE contact_interaction ADD initiator VARCHAR(10) DEFAULT NULL, ADD tags JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', ADD created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT \'(DC2Type:datetime_immutable)\'');

        $this->addSql('CREATE INDEX idx_ci_contact_timestamp ON contact_interaction (contact_id, timestamp)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_ci_contact_timestamp ON contact_interaction');
        $this->addSql('ALTER TABLE contact_interaction DROP initiator, DROP tags, DROP created_at');
        $this->addSql('ALTER TABLE contact DROP cadence_days');
    }
}
