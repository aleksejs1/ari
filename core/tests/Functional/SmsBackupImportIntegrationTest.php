<?php

declare(strict_types=1);

namespace Ari\Tests\Functional;

use Ari\Dto\SmsBackupImportOptions;
use Ari\Entity\Contact;
use Ari\Entity\ContactInteraction;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\User;
use Ari\Service\SmsBackupImportService;
use Ari\ValueObject\ParsedRecord;

/**
 * Integration tests for SmsBackupImportService.
 *
 * Unlike the unit tests (SmsBackupImportServiceTest) which stub all
 * repositories, these tests run against the real SQLite test database
 * to verify end-to-end deduplication behaviour:
 *
 *   - Re-importing the same file must not create duplicate ContactInteraction rows.
 *   - Second import reports records_skipped = first import's imported count.
 */
final class SmsBackupImportIntegrationTest extends AbstractApiTestCase
{
    private const PHONE = '+37129837434';
    private const NORMALIZED = '37129837434';

    // ── Setup ─────────────────────────────────────────────────────────────────

    private function getService(): SmsBackupImportService
    {
        /** @var SmsBackupImportService */
        return self::getContainer()->get(SmsBackupImportService::class);
    }

    private function enableTenantFilter(User $user): void
    {
        $em = $this->getEntityManager();
        $em->getFilters()
            ->enable('tenant')
            ->setParameter('currentTenant', (string) $user->getId());
    }

    /**
     * Creates a user with a contact that has a known phone number.
     * Returns [User, Contact].
     *
     * @return array{0: User, 1: Contact}
     */
    private function createUserWithPhoneContact(): array
    {
        $em = $this->getEntityManager();
        $container = self::getContainer();

        /** @var \Symfony\Component\DependencyInjection\ContainerInterface $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $user = new User();
        $user->setUuid('sms-integ-' . bin2hex(random_bytes(6)));
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);

        $contact = new Contact();
        $contact->setTenant($user);
        $contact->setUser($user);
        $em->persist($contact);

        $phone = new ContactPhoneNumber();
        $phone->setTenant($user);
        $phone->setContact($contact);
        $phone->setValue(self::PHONE); // buildPhoneMapForTenant normalizes at query time
        $phone->setType('mobile');
        $em->persist($phone);

        $em->flush();

        return [$user, $contact];
    }

    /**
     * @return list<array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null}>
     */
    private function makeCallRecords(): array
    {
        return [
            [
                'type' => ParsedRecord::TYPE_CALL,
                'phoneNumber' => self::PHONE,
                'normalizedPhone' => self::NORMALIZED,
                'contactName' => 'Alice',
                'date' => (new \DateTimeImmutable('2023-01-01 10:00:00 UTC'))->format('c'),
                'direction' => 'incoming',
                'durationSeconds' => 60,
            ],
            [
                'type' => ParsedRecord::TYPE_CALL,
                'phoneNumber' => self::PHONE,
                'normalizedPhone' => self::NORMALIZED,
                'contactName' => 'Alice',
                'date' => (new \DateTimeImmutable('2023-01-02 15:00:00 UTC'))->format('c'),
                'direction' => 'outgoing',
                'durationSeconds' => 120,
            ],
        ];
    }

    /**
     * @return list<array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null}>
     */
    private function makeSmsRecords(): array
    {
        return [
            [
                'type' => ParsedRecord::TYPE_SMS,
                'phoneNumber' => self::PHONE,
                'normalizedPhone' => self::NORMALIZED,
                'contactName' => 'Alice',
                'date' => (new \DateTimeImmutable('2023-01-03 09:00:00 UTC'))->format('c'),
                'direction' => 'incoming',
                'durationSeconds' => null,
            ],
        ];
    }

    private function countInteractionsForContact(Contact $contact): int
    {
        return $this->getEntityManager()
            ->getRepository(ContactInteraction::class)
            ->count(['contact' => $contact]);
    }

    // ── Tests ─────────────────────────────────────────────────────────────────

    public function testReimportCallsDoesNotCreateDuplicates(): void
    {
        [$user, $contact] = $this->createUserWithPhoneContact();

        $this->enableTenantFilter($user);

        $service = $this->getService();
        $options = new SmsBackupImportOptions(duplicateStrategy: 'skip');
        $records = $this->makeCallRecords();

        // First import: should create 2 call interactions.
        $result1 = $service->import($records, $options, $user);

        self::assertSame(2, $result1->callsImported, 'First import should import 2 calls');
        self::assertSame(0, $result1->recordsSkipped, 'First import should skip nothing');
        $countAfterFirst = $this->countInteractionsForContact($contact);
        self::assertSame(2, $countAfterFirst);

        // Second import with the same records: must not create duplicates.
        $result2 = $service->import($records, $options, $user);

        self::assertSame(0, $result2->callsImported, 'Re-import should not create new calls');
        self::assertSame(2, $result2->recordsSkipped, 'Re-import should skip 2 duplicate records');

        $countAfterSecond = $this->countInteractionsForContact($contact);
        self::assertSame(
            $countAfterFirst,
            $countAfterSecond,
            'Re-import must not increase interaction count',
        );
    }

    public function testReimportSmsThreadsDoesNotCreateDuplicates(): void
    {
        [$user, $contact] = $this->createUserWithPhoneContact();

        $this->enableTenantFilter($user);

        $service = $this->getService();
        $options = new SmsBackupImportOptions(duplicateStrategy: 'skip');
        $records = $this->makeSmsRecords();

        // First import: 1 SMS grouped into 1 thread interaction.
        $result1 = $service->import($records, $options, $user);
        self::assertSame(1, $result1->smsThreadsImported);
        self::assertSame(0, $result1->recordsSkipped);

        $countAfterFirst = $this->countInteractionsForContact($contact);
        self::assertSame(1, $countAfterFirst);

        // Second import with same records.
        $result2 = $service->import($records, $options, $user);
        self::assertSame(0, $result2->smsThreadsImported, 'Re-import must not create duplicate threads');
        self::assertSame(1, $result2->recordsSkipped);

        $countAfterSecond = $this->countInteractionsForContact($contact);
        self::assertSame($countAfterFirst, $countAfterSecond, 'Re-import must not increase interaction count');
    }

    public function testMixedReimportNoNewDuplicates(): void
    {
        [$user, $contact] = $this->createUserWithPhoneContact();

        $this->enableTenantFilter($user);

        $service = $this->getService();
        $options = new SmsBackupImportOptions(duplicateStrategy: 'skip');

        $records = array_merge($this->makeCallRecords(), $this->makeSmsRecords());

        // First import: 2 calls + 1 SMS thread = 3 interactions.
        $result1 = $service->import($records, $options, $user);
        self::assertSame(2, $result1->callsImported);
        self::assertSame(1, $result1->smsThreadsImported);
        self::assertSame(0, $result1->recordsSkipped);

        $countAfterFirst = $this->countInteractionsForContact($contact);
        self::assertSame(3, $countAfterFirst);

        // Second import: everything skipped.
        $result2 = $service->import($records, $options, $user);
        self::assertSame(0, $result2->callsImported);
        self::assertSame(0, $result2->smsThreadsImported);
        self::assertGreaterThan(0, $result2->recordsSkipped);

        $countAfterSecond = $this->countInteractionsForContact($contact);
        self::assertSame($countAfterFirst, $countAfterSecond);
    }
}
