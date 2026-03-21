<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Adds the denormalized last_interaction_at column to the contact table.
 *
 * This column is maintained by ContactInteractionListener and allows NeedsAttentionProvider
 * to find cadence-overdue contacts without a GROUP BY query on contact_interaction.
 *
 * The backfill UPDATE computes the initial value from existing interaction data.
 */
final class Version20260321000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add last_interaction_at to contact (denormalized from contact_interaction)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("ALTER TABLE contact ADD last_interaction_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'");
        // Backfill: correlated subquery is compatible with both MySQL and SQLite (used in tests).
        // On large datasets (> 100k rows) prefer the JOIN form instead:
        //   UPDATE contact c JOIN (SELECT contact_id, MAX(timestamp) mx FROM contact_interaction GROUP BY contact_id) ci
        //   ON c.id = ci.contact_id SET c.last_interaction_at = ci.mx
        $this->addSql('UPDATE contact SET last_interaction_at = (SELECT MAX(ci.timestamp) FROM contact_interaction ci WHERE ci.contact_id = contact.id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE contact DROP COLUMN last_interaction_at');
    }
}
