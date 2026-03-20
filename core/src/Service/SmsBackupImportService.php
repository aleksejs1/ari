<?php

namespace Ari\Service;

use Ari\Dto\SmsBackupImportOptions;
use Ari\Dto\SmsBackupImportResult;
use Ari\Entity\Contact;
use Ari\Entity\ContactInteraction;
use Ari\Entity\ContactName;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\User;
use Ari\Repository\ContactInteractionRepository;
use Ari\Service\Entitlement\EntitlementServiceInterface;
use Ari\Service\Entitlement\EntitlementState;
use Ari\ValueObject\ParsedRecord;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

/**
 * Core business logic for the Phone Backup Import feature.
 *
 * Must be called from a Messenger handler that has already enabled
 * the Doctrine TenantFilter for the correct tenant.
 */
class SmsBackupImportService
{
    private const FLUSH_BATCH_SIZE = 50;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ContactInteractionRepository $interactionRepository,
        private readonly EntitlementServiceInterface $entitlementService,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * @param list<array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null}> $records
     */
    public function import(array $records, SmsBackupImportOptions $options, User $user): SmsBackupImportResult
    {
        $tenantId = (int) $user->getId();

        // Step 1: Build normalizedPhone -> contactId map via DBAL (bypasses ORM filter;
        // we filter by tenant_id explicitly).
        $phoneMap = $this->buildPhoneMap($tenantId);

        // Step 2: Create contacts for unknown phone numbers if requested.
        $contactsCreated = 0;
        if ('create' === $options->unknownNumbers) {
            $phoneMap = $this->createContactsForUnknownPhones($records, $phoneMap, $options, $user, $contactsCreated);
        }

        // Step 3: Pre-load deduplication set from existing interactions.
        $contactIds = array_values(array_unique($phoneMap));
        $existingKeys = $this->buildDeduplicationSet($contactIds);

        // Step 4: Process SMS and call records.
        $callsImported = 0;
        $smsThreadsImported = 0;
        $recordsSkipped = 0;
        $flushCount = 0;

        // Track xml contact names per contactId for name conflict handling.
        /** @var array<int, string> $contactXmlNames contactId -> xmlContactName */
        $contactXmlNames = [];

        // --- SMS grouping ---
        /** @var array<string, array{contactId: int, records: list<array{direction: string}>, firstDate: \DateTimeImmutable}> $smsGroups */
        $smsGroups = [];

        foreach ($records as $record) {
            if (ParsedRecord::TYPE_SMS !== $record['type']) {
                continue;
            }

            if ($options->skipAlphanumeric && $this->isAlphanumericSender($record['phoneNumber'])) {
                ++$recordsSkipped;
                continue;
            }

            $contactId = $phoneMap[$record['normalizedPhone']] ?? null;
            if (null === $contactId) {
                ++$recordsSkipped;
                continue;
            }

            $date = new \DateTimeImmutable($record['date']);
            $dayKey = $date->setTimezone(new \DateTimeZone('UTC'))->format('Y-m-d');
            $groupKey = $contactId . '_sms_' . $dayKey;

            if (!isset($smsGroups[$groupKey])) {
                $smsGroups[$groupKey] = [
                    'contactId' => $contactId,
                    'records' => [],
                    'firstDate' => $date,
                ];
            } elseif ($date < $smsGroups[$groupKey]['firstDate']) {
                $smsGroups[$groupKey]['firstDate'] = $date;
            }
            $smsGroups[$groupKey]['records'][] = ['direction' => $record['direction']];

            // Track the first xml name we see for this contact.
            if (!isset($contactXmlNames[$contactId]) && '' !== $record['contactName']) {
                $contactXmlNames[$contactId] = $record['contactName'];
            }
        }

        // Create one interaction per SMS group.
        foreach ($smsGroups as $group) {
            $contactId = $group['contactId'];
            $firstDate = $group['firstDate'];
            $groupRecords = $group['records'];

            $dedupKey = $contactId . '|message|' . $firstDate->getTimestamp();
            // duplicateStrategy 'create' intentionally skips this check, always creating the interaction.
            if ('skip' === $options->duplicateStrategy && isset($existingKeys[$dedupKey])) {
                $recordsSkipped += count($groupRecords);
                continue;
            }

            $received = count(array_filter($groupRecords, static fn(array $r): bool => 'incoming' === $r['direction']));
            $sent = count(array_filter($groupRecords, static fn(array $r): bool => 'outgoing' === $r['direction']));
            $total = count($groupRecords);

            $interaction = $this->newInteraction($contactId, $user);
            $interaction->setType('message');
            $interaction->setTimestamp($firstDate);
            $interaction->setDescription($this->buildSmsDescription($total, $received, $sent));

            $this->entityManager->persist($interaction);
            $existingKeys[$dedupKey] = true;
            ++$smsThreadsImported;
            ++$flushCount;

            if (0 === ($flushCount % self::FLUSH_BATCH_SIZE)) {
                $this->entityManager->flush();
            }
        }

        // --- Call records ---
        foreach ($records as $record) {
            if (ParsedRecord::TYPE_CALL !== $record['type']) {
                continue;
            }

            if ($options->skipAlphanumeric && $this->isAlphanumericSender($record['phoneNumber'])) {
                ++$recordsSkipped;
                continue;
            }

            $contactId = $phoneMap[$record['normalizedPhone']] ?? null;
            if (null === $contactId) {
                ++$recordsSkipped;
                continue;
            }

            $date = new \DateTimeImmutable($record['date']);
            $dedupKey = $contactId . '|call|' . $date->getTimestamp();

            // duplicateStrategy 'create' intentionally skips this check, always creating the interaction.
            if ('skip' === $options->duplicateStrategy && isset($existingKeys[$dedupKey])) {
                ++$recordsSkipped;
                continue;
            }

            $initiator = 'outgoing' === $record['direction'] ? 'me' : 'them';

            $interaction = $this->newInteraction($contactId, $user);
            $interaction->setType('call');
            $interaction->setTimestamp($date);
            $interaction->setInitiator($initiator);
            $interaction->setDescription($this->buildCallDescription($record['direction'], $record['durationSeconds']));

            $this->entityManager->persist($interaction);
            $existingKeys[$dedupKey] = true;
            ++$callsImported;
            ++$flushCount;

            if (0 === ($flushCount % self::FLUSH_BATCH_SIZE)) {
                $this->entityManager->flush();
            }

            if (!isset($contactXmlNames[$contactId]) && '' !== $record['contactName']) {
                $contactXmlNames[$contactId] = $record['contactName'];
            }
        }

        $this->entityManager->flush();

        // Step 5: Name conflict handling (after all interactions are persisted).
        if ('keep' !== $options->nameConflict && [] !== $contactXmlNames) {
            $this->handleNameConflicts($contactXmlNames, $options->nameConflict, $user);
        }

        return new SmsBackupImportResult(
            callsImported: $callsImported,
            smsThreadsImported: $smsThreadsImported,
            contactsCreated: $contactsCreated,
            recordsSkipped: $recordsSkipped,
        );
    }

    /**
     * Build a map of normalizedPhone -> contactId for the given tenant.
     * Uses DBAL directly to bypass the ORM layer (the TenantFilter is applied
     * via explicit tenant_id parameter, not the Doctrine filter).
     *
     * @return array<string, int>
     */
    private function buildPhoneMap(int $tenantId): array
    {
        $rows = $this->entityManager->getConnection()->fetchAllAssociative(
            'SELECT cpn.value, c.id FROM contact_phone_number cpn
             JOIN contact c ON cpn.contact_id = c.id
             WHERE c.tenant_id = :tenantId',
            ['tenantId' => $tenantId]
        );

        $map = [];
        foreach ($rows as $row) {
            /** @var array{value: string|null, id: int|string} $row */
            $rawValue = $row['value'] ?? '';
            if ('' === $rawValue) {
                continue;
            }
            $normalized = preg_replace('/\D/', '', $rawValue) ?? '';
            if ('' !== $normalized) {
                $map[$normalized] = (int) $row['id'];
            }
        }

        return $map;
    }

    /**
     * Create new contacts for phone numbers not in the phone map.
     * Updates and returns the phone map with the newly created contacts,
     * and increments $contactsCreated for each successfully created contact.
     *
     * @param list<array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null}> $records
     * @param array<string, int> $phoneMap
     *
     * @return array<string, int>
     */
    private function createContactsForUnknownPhones(
        array $records,
        array $phoneMap,
        SmsBackupImportOptions $options,
        User $user,
        int &$contactsCreated,
    ): array {
        // Collect unique unknown normalized phones -> first seen contactName.
        /** @var array<string, array{phoneNumber: string, contactName: string}> $unknownPhones */
        $unknownPhones = [];
        foreach ($records as $record) {
            $normalized = $record['normalizedPhone'];
            if ('' === $normalized) {
                continue;
            }
            if ($options->skipAlphanumeric && $this->isAlphanumericSender($record['phoneNumber'])) {
                continue;
            }
            if (!isset($phoneMap[$normalized]) && !isset($unknownPhones[$normalized])) {
                $unknownPhones[$normalized] = [
                    'phoneNumber' => $record['phoneNumber'],
                    'contactName' => $record['contactName'],
                ];
            }
        }

        foreach ($unknownPhones as $normalized => $info) {
            if (EntitlementState::Allowed !== $this->entitlementService->checkQuota($user, 'contacts')) {
                $this->logger->warning('sms_backup_import_quota_reached', [
                    'event' => 'sms_backup_import_quota_reached',
                    'tenant_id' => $user->getId(),
                    'phone' => $normalized,
                ]);
                break; // quota will not increase during this import; no point checking further
            }

            $contact = new Contact();
            $contact->setUser($user);

            $phone = new ContactPhoneNumber($contact);
            $phone->setValue($info['phoneNumber']);
            $phone->setType('mobile');

            $this->entityManager->persist($contact);
            $this->entityManager->persist($phone);

            $contactName = $info['contactName'];
            if ('' !== $contactName && '(Unknown)' !== $contactName) {
                [$given, $family] = $this->parseNameParts($contactName);
                $name = new ContactName($contact);
                $name->setGiven($given);
                $name->setFamily($family);
                $this->entityManager->persist($name);
            }

            // Flush each contact individually to get the ID.
            $this->entityManager->flush();

            $newId = $contact->getId();
            if (null !== $newId) {
                $phoneMap[$normalized] = $newId;
                ++$contactsCreated;
            }
        }

        return $phoneMap;
    }

    /**
     * Build a set of existing interaction dedup keys: "{contactId}|{type}|{timestamp}".
     *
     * @param list<int> $contactIds
     *
     * @return array<string, true>
     */
    private function buildDeduplicationSet(array $contactIds): array
    {
        return $this->interactionRepository->findDeduplicationKeysByContactIds($contactIds);
    }

    /**
     * Apply name conflict resolution for matched contacts.
     *
     * @param array<int, string> $contactXmlNames contactId -> xmlContactName
     */
    private function handleNameConflicts(
        array $contactXmlNames,
        string $nameConflict,
        User $user,
    ): void {
        $contactIds = array_keys($contactXmlNames);

        // For 'replace': pre-load all first ContactNames in one query instead of N separate queries.
        $existingNames = 'replace' === $nameConflict
            ? $this->loadFirstContactNamesMap($contactIds)
            : [];

        // For 'add': build a fingerprint set to prevent creating duplicate names.
        $existingNameKeys = 'add' === $nameConflict
            ? $this->buildExistingNameKeySet($contactIds)
            : [];

        foreach ($contactXmlNames as $contactId => $xmlContactName) {
            if ('' === $xmlContactName || '(Unknown)' === $xmlContactName) {
                continue;
            }

            [$given, $family] = $this->parseNameParts($xmlContactName);

            if ('add' === $nameConflict) {
                $key = $contactId . '|' . ($given ?? '') . '|' . ($family ?? '');
                if (isset($existingNameKeys[$key])) {
                    continue; // exact name already exists — skip to prevent duplicates
                }

                $contactRef = $this->entityManager->getReference(Contact::class, $contactId);
                /** @var Contact $contactRef */
                $name = new ContactName();
                $name->setContact($contactRef);
                $name->setTenant($user);
                $name->setGiven($given);
                $name->setFamily($family);
                $this->entityManager->persist($name);
            } elseif ('replace' === $nameConflict) {
                $existing = $existingNames[$contactId] ?? null;

                if (null !== $existing) {
                    $existing->setGiven($given);
                    $existing->setFamily($family);
                } else {
                    // No existing name — create one.
                    $contactRef = $this->entityManager->getReference(Contact::class, $contactId);
                    /** @var Contact $contactRef */
                    $name = new ContactName();
                    $name->setContact($contactRef);
                    $name->setTenant($user);
                    $name->setGiven($given);
                    $name->setFamily($family);
                    $this->entityManager->persist($name);
                }
            }
        }

        $this->entityManager->flush();
    }

    /**
     * Load the first (lowest id) ContactName per contact for the given contact IDs.
     * Returns a map of contactId -> ContactName. Used by handleNameConflicts to avoid N DQL queries.
     *
     * @param list<int> $contactIds
     *
     * @return array<int, ContactName>
     */
    private function loadFirstContactNamesMap(array $contactIds): array
    {
        if ([] === $contactIds) {
            return [];
        }

        /** @var ContactName[] $names */
        $names = $this->entityManager->createQuery(
            'SELECT cn FROM ' . ContactName::class . ' cn WHERE cn.contact IN (:ids) ORDER BY cn.id ASC'
        )
            ->setParameter('ids', $contactIds)
            ->getResult();

        $map = [];
        foreach ($names as $name) {
            $contactId = $name->getContact()?->getId();
            if (null !== $contactId && !isset($map[$contactId])) {
                $map[$contactId] = $name; // first seen = lowest id (query ordered ASC)
            }
        }

        return $map;
    }

    /**
     * Build a set of name fingerprint strings "{contactId}|{given}|{family}"
     * for all existing ContactNames of the given contacts.
     * Used by handleNameConflicts to prevent duplicate names when strategy is 'add'.
     *
     * @param list<int> $contactIds
     *
     * @return array<string, true>
     */
    private function buildExistingNameKeySet(array $contactIds): array
    {
        if ([] === $contactIds) {
            return [];
        }

        /** @var ContactName[] $names */
        $names = $this->entityManager->createQuery(
            'SELECT cn FROM ' . ContactName::class . ' cn WHERE cn.contact IN (:ids)'
        )
            ->setParameter('ids', $contactIds)
            ->getResult();

        $keys = [];
        foreach ($names as $name) {
            $contactId = $name->getContact()?->getId();
            if (null !== $contactId) {
                $key = $contactId . '|' . ($name->getGiven() ?? '') . '|' . ($name->getFamily() ?? '');
                $keys[$key] = true;
            }
        }

        return $keys;
    }

    /**
     * Create a new ContactInteraction for the given contact without triggering a proxy load.
     */
    private function newInteraction(int $contactId, User $user): ContactInteraction
    {
        $contactRef = $this->entityManager->getReference(Contact::class, $contactId);
        /** @var Contact $contactRef */
        $interaction = new ContactInteraction();
        $interaction->setContact($contactRef);
        $interaction->setTenant($user);

        return $interaction;
    }

    /**
     * Returns true if the phone number contains non-digit characters (alphanumeric sender).
     * E.g. "Google", "Tele2", "BANK" are alphanumeric senders.
     */
    private function isAlphanumericSender(string $phoneNumber): bool
    {
        return 1 !== preg_match('/^\+?[\d\s\-().]+$/', $phoneNumber);
    }

    private function buildSmsDescription(int $total, int $received, int $sent): string
    {
        // TODO: i18n — description is stored as an English string, making it untranslatable for
        // non-English users. A future improvement: store structured counts (JSON) and render
        // the human-readable label on the frontend.
        return sprintf('%d message%s (%d received, %d sent)', $total, $total > 1 ? 's' : '', $received, $sent);
    }

    private function buildCallDescription(string $direction, ?int $durationSeconds): string
    {
        return match ($direction) {
            'incoming' => 'Incoming call' . (null !== $durationSeconds ? ", {$durationSeconds} sec" : ''),
            'outgoing' => 'Outgoing call' . (null !== $durationSeconds ? ", {$durationSeconds} sec" : ''),
            'missed' => 'Missed call',
            'rejected' => 'Rejected call',
            default => 'Call',
        };
    }

    /**
     * Split "Given Family" into ['given' => '...', 'family' => '...'].
     *
     * @return array{0: string|null, 1: string|null}
     */
    private function parseNameParts(string $name): array
    {
        $parts = explode(' ', trim($name), 2);
        $given = '' !== ($parts[0] ?? '') ? $parts[0] : null;
        $family = isset($parts[1]) && '' !== $parts[1] ? $parts[1] : null;

        return [$given, $family];
    }
}
