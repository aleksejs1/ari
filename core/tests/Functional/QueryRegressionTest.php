<?php

declare(strict_types=1);

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\ContactPlaybook;
use Ari\Entity\User;
use Ari\Service\ContactPlaybookLifecycleService;
use Symfony\Bridge\Doctrine\Middleware\Debug\DebugDataHolder;

/**
 * Query-count regression guards for the three hottest read/write paths.
 *
 * Each test resets the DBAL debug log immediately before the measured
 * operation and then asserts the query count stays below a known ceiling.
 * If a future change introduces an N+1 pattern the assertion will fail
 * and the developer must justify the higher count or fix the regression.
 *
 * Requires kernel.debug=true (active in the test environment).
 */
class QueryRegressionTest extends AbstractApiTestCase
{
    // ── Contact PUT ──────────────────────────────────────────────────────────

    /**
     * Guard: Contact PUT must pre-load all 11 collections in explicit queries
     * (task 2.1) and must NOT trigger per-item lazy-loads during processing.
     *
     * The ceiling of 30 gives headroom for auth overhead (JWT verify, user
     * load, TenantFilter enable) while still catching any N+1 regression that
     * would add O(items) extra queries.
     */
    public function testContactPutQueryCountIsBounded(): void
    {
        $client = static::createClient();

        // Create a contact with a handful of nested entities.
        $createResp = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [['given' => 'Alice', 'family' => 'Smith']],
                'phoneNumbers' => [['value' => '+1234567890', 'type' => 'mobile']],
                'contactEmailAdresses' => [['value' => 'alice@example.com', 'type' => 'personal']],
            ],
        ]);
        self::assertResponseIsSuccessful();
        $contactIri = $createResp->toArray()['@id'];

        $this->resetQueryLog();

        $client->request('PUT', $contactIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [['given' => 'Alicia', 'family' => 'Smith']],
                'phoneNumbers' => [['value' => '+9876543210', 'type' => 'work']],
                'contactEmailAdresses' => [['value' => 'alicia@example.com', 'type' => 'personal']],
            ],
        ]);
        self::assertResponseIsSuccessful();

        $count = $this->countQueries();
        // Fails if an N+1 regression is introduced (e.g., lazy-loads inside the
        // handleClearAndReplace loop or per-item hydration).
        self::assertLessThanOrEqual(
            30,
            $count,
            "Contact PUT fired {$count} queries — exceeds guard of 30. Check for N+1 regressions.",
        );
    }

    // ── generateMissingTasksForAllActive batch path ──────────────────────────

    /**
     * Guard: generateMissingTasksForAllActive must use the 3-SELECT batch path
     * (task 2.2) and must NOT issue N×K×2 per-series SELECT queries.
     *
     * We count only SELECT queries, not INSERT/UPDATE from flush(), because
     * the number of inserts is O(new_tasks) and depends on seed-data state.
     * The batch optimisation is entirely in the lookup phase:
     *
     *   Old: 1 (load playbooks) + N×K×2 SELECT per series  → unbounded
     *   New: 1 (load playbooks) + 1 (batch active) + 1 (batch last) → 3 SELECTs
     *
     * Ceiling 6 leaves room for minor Doctrine identity-map overhead while
     * still catching a reversion to the per-series pattern.
     */
    public function testGenerateMissingTasksBatchSelectQueryCount(): void
    {
        $em = $this->getEntityManager();
        $user = $this->getUser();

        // Create 3 contacts with active playbooks and no existing tasks.
        for ($i = 0; $i < 3; ++$i) {
            $contact = new Contact();
            $contact->setTenant($user);
            $contact->setUser($user);
            $em->persist($contact);

            $playbook = new ContactPlaybook();
            $playbook->setContact($contact);
            $playbook->setPreset('maintain_friend'); // 2 task series: call + text_message
            $playbook->setStatus(ContactPlaybook::STATUS_ACTIVE);
            $playbook->setTenant($user);
            $em->persist($playbook);
        }
        $em->flush();

        $playbookService = self::getContainer()->get(ContactPlaybookLifecycleService::class);

        $this->resetQueryLog();
        $playbookService->generateMissingTasksForAllActive();

        // Count SELECT queries only — INSERT/UPDATE from flush are excluded because they
        // are proportional to how many tasks need creating (seed-data dependent).
        $debugHolder = self::getContainer()->get('doctrine.debug_data_holder');
        \assert($debugHolder instanceof DebugDataHolder);
        $selectCount = 0;
        foreach ($debugHolder->getData() as $queries) {
            foreach ($queries as $query) {
                if (str_starts_with(strtoupper(ltrim((string) $query['sql'])), 'SELECT')) {
                    ++$selectCount;
                }
            }
        }

        // Ceiling 6: 1 (load playbooks) + 1 (batch active tasks with JOIN FETCH reflection)
        // + 1 (batch last tasks with JOIN FETCH reflection) + up to 3 for minor overhead.
        // The old per-series pattern for 3 playbooks × 2 series would have fired 13 SELECTs.
        self::assertLessThanOrEqual(
            6,
            $selectCount,
            "generateMissingTasksForAllActive fired {$selectCount} SELECT queries — "
            . 'expected ≤ 6. The N×K×2 per-series SELECT pattern may have been reintroduced.',
        );
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function getUser(): User
    {
        $user = $this->getEntityManager()->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        \assert($user instanceof User);

        return $user;
    }
}
