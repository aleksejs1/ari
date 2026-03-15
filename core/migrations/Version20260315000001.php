<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * M6: sourceHash algorithm changed from md5 to xxh128.
 *
 * Both algorithms produce 32 hex characters, so no column ALTER is needed.
 * However, existing rows use md5 hashes that are now incompatible with the
 * xxh128-based deduplication key. Clearing the table lets AiSuggestionService
 * regenerate suggestions with the correct hash on the next batch trigger.
 *
 * Pending/error AI suggestions are ephemeral — losing them has no user-visible
 * impact beyond requiring a re-run of the batch analysis. Accepted/dismissed
 * suggestions cannot be regenerated, but their loss is acceptable given the
 * low volume at this stage of the feature.
 */
final class Version20260315000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Clear ai_suggestion rows with stale md5-based source_hash (replaced by xxh128)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('DELETE FROM ai_suggestion WHERE 1=1');
    }

    public function down(Schema $schema): void
    {
        // Cannot restore deleted rows — down migration is a no-op.
        $this->addSql('SELECT 1');
    }
}
