<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251226024911 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact ADD tenant_id INT NOT NULL');
        $this->addSql('UPDATE contact SET tenant_id = user_id');
        $this->addSql('ALTER TABLE contact ADD CONSTRAINT FK_4C62E63860D47263 FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_4C62E63860D47263 ON contact (tenant_id)');
        $this->addSql('ALTER TABLE contact_date ADD tenant_id INT NOT NULL');
        $this->addSql('UPDATE contact_date JOIN contact ON contact_date.contact_id = contact.id SET contact_date.tenant_id = contact.tenant_id');
        $this->addSql('ALTER TABLE contact_date ADD CONSTRAINT FK_8261B58560D47263 FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_8261B58560D47263 ON contact_date (tenant_id)');
        $this->addSql('ALTER TABLE contact_name ADD tenant_id INT NOT NULL');
        $this->addSql('UPDATE contact_name JOIN contact ON contact_name.contact_id = contact.id SET contact_name.tenant_id = contact.tenant_id');
        $this->addSql('ALTER TABLE contact_name ADD CONSTRAINT FK_76DCFCF960D47263 FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_76DCFCF960D47263 ON contact_name (tenant_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_name DROP FOREIGN KEY FK_76DCFCF960D47263');
        $this->addSql('DROP INDEX IDX_76DCFCF960D47263 ON contact_name');
        $this->addSql('ALTER TABLE contact_name DROP tenant_id');
        $this->addSql('ALTER TABLE contact DROP FOREIGN KEY FK_4C62E63860D47263');
        $this->addSql('DROP INDEX IDX_4C62E63860D47263 ON contact');
        $this->addSql('ALTER TABLE contact DROP tenant_id');
        $this->addSql('ALTER TABLE contact_date DROP FOREIGN KEY FK_8261B58560D47263');
        $this->addSql('DROP INDEX IDX_8261B58560D47263 ON contact_date');
        $this->addSql('ALTER TABLE contact_date DROP tenant_id');
    }
}
