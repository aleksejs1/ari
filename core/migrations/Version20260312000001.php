<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260312000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add user_plan table and back-fill existing users with self_hosted plan';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE user_plan (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, plan_id VARCHAR(64) NOT NULL DEFAULT \'self_hosted\', UNIQUE INDEX UNIQ_2C3B4E07A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_plan ADD CONSTRAINT FK_2C3B4E07A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');

        // Back-fill existing users so future plan management code can use simple UPDATE
        $this->addSql("INSERT INTO user_plan (user_id, plan_id) SELECT id, 'self_hosted' FROM user u WHERE NOT EXISTS (SELECT 1 FROM user_plan up WHERE up.user_id = u.id)");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user_plan DROP FOREIGN KEY FK_2C3B4E07A76ED395');
        $this->addSql('DROP TABLE user_plan');
    }
}
