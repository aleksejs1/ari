<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260131175348 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Rename App\\ namespace to Ari\\ in audit_log entity_type and owner_entity_type columns';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("UPDATE audit_log SET entity_type = REPLACE(entity_type, 'App\\\\', 'Ari\\\\') WHERE entity_type LIKE 'App\\\\%'");
        $this->addSql("UPDATE audit_log SET owner_entity_type = REPLACE(owner_entity_type, 'App\\\\', 'Ari\\\\') WHERE owner_entity_type LIKE 'App\\\\%'");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("UPDATE audit_log SET entity_type = REPLACE(entity_type, 'Ari\\\\', 'App\\\\') WHERE entity_type LIKE 'Ari\\\\%'");
        $this->addSql("UPDATE audit_log SET owner_entity_type = REPLACE(owner_entity_type, 'Ari\\\\', 'App\\\\') WHERE owner_entity_type LIKE 'Ari\\\\%'");
    }
}
