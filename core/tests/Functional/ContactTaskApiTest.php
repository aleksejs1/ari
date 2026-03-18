<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\ContactTask;
use Ari\Entity\User;

class ContactTaskApiTest extends AbstractApiTestCase
{
    // ── Helpers ──────────────────────────────────────────────────────────────

    private function getUser(): User
    {
        $em = $this->getEntityManager();
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        \assert($user instanceof User);

        return $user;
    }

    private function createContact(User $user): Contact
    {
        $contact = new Contact();
        $contact->setTenant($user);
        $contact->setUser($user);

        $em = $this->getEntityManager();
        $em->persist($contact);
        $em->flush();

        return $contact;
    }

    /**
     * Creates a ContactTask with sensible defaults.
     * $dueDate null = no due date; 'today' = today; 'yesterday' = overdue.
     */
    private function createTask(
        Contact $contact,
        User $user,
        string $status = ContactTask::STATUS_PENDING,
        string|\DateTimeImmutable|null $dueDate = null,
    ): ContactTask {
        $task = new ContactTask();
        $task->setContact($contact);
        $task->setTenant($user);
        $task->setType(ContactTask::TYPE_CALL);
        $task->setSeriesKey(ContactTask::TYPE_CALL);
        $task->setStatus($status);

        if (is_string($dueDate)) {
            $task->setDueDate(new \DateTimeImmutable($dueDate));
        } elseif ($dueDate instanceof \DateTimeImmutable) {
            $task->setDueDate($dueDate);
        }

        $em = $this->getEntityManager();
        $em->persist($task);
        $em->flush();

        return $task;
    }

    // ── Collection GET ────────────────────────────────────────────────────────

    public function testGetCollectionRequiresAuthentication(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/contact_tasks');
        self::assertResponseStatusCodeSame(401);
    }

    public function testGetCollectionReturnsOnlyOwnTasks(): void
    {
        $client = static::createClient();
        $userA = $this->getUser();
        $contactA = $this->createContact($userA);
        $this->createTask($contactA, $userA);

        // User B
        $userB = $this->createUser('task-b-' . bin2hex(random_bytes(4)) . '@test.com', 'pass');
        $contactB = $this->createContact($userB);
        $this->createTask($contactB, $userB);

        $response = $client->request('GET', '/api/contact_tasks', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        // Every task in the response must belong to user A's contact.
        foreach ($data['member'] as $item) {
            self::assertSame($contactA->getId(), $item['contactId']);
        }
    }

    public function testGetCollectionFilterByContact(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contactA = $this->createContact($user);
        $contactB = $this->createContact($user);
        $this->createTask($contactA, $user);
        $this->createTask($contactB, $user);

        $response = $client->request('GET', '/api/contact_tasks?contact=' . (int) $contactA->getId(), [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertGreaterThanOrEqual(1, $data['totalItems']);
        foreach ($data['member'] as $item) {
            self::assertSame($contactA->getId(), $item['contactId']);
        }
    }

    public function testGetCollectionFilterByStatus(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $this->createTask($contact, $user, ContactTask::STATUS_PENDING);
        $this->createTask($contact, $user, ContactTask::STATUS_COMPLETED);

        $response = $client->request('GET', '/api/contact_tasks?status=pending', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        foreach ($response->toArray()['member'] as $item) {
            self::assertSame('pending', $item['status']);
        }
    }

    // ── GET item ──────────────────────────────────────────────────────────────

    public function testGetItemRequiresAuthentication(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user);

        $client->request('GET', '/api/contact_tasks/' . (int) $task->getId());
        self::assertResponseStatusCodeSame(401);
    }

    public function testGetItemReturnsCorrectShape(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user, ContactTask::STATUS_PENDING, 'tomorrow');

        $response = $client->request('GET', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertSame($task->getId(), $data['id']);
        self::assertSame($contact->getId(), $data['contactId']);
        self::assertSame('pending', $data['status']);
        self::assertSame('call', $data['type']);
        self::assertArrayHasKey('dueDate', $data);
        self::assertArrayHasKey('createdAt', $data);
    }

    public function testGetItemIsolation(): void
    {
        $userA = $this->getUser();
        $contactA = $this->createContact($userA);
        $taskA = $this->createTask($contactA, $userA);

        $userB = $this->createUser('task-iso-' . bin2hex(random_bytes(4)) . '@test.com', 'pass');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        // getToken() calls createClient() internally; re-create so assertResponse* checks the right client.
        $client = static::createClient();

        // User B cannot see User A's task
        $client->request('GET', '/api/contact_tasks/' . (int) $taskA->getId(), [
            'auth_bearer' => $tokenB,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    // ── PATCH ─────────────────────────────────────────────────────────────────

    public function testPatchRequiresAuthentication(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user);

        $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'json' => ['status' => 'completed'],
        ]);
        self::assertResponseStatusCodeSame(401);
    }

    public function testPatchCompletePendingTask(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user, ContactTask::STATUS_PENDING);

        $response = $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'completed'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertSame('completed', $data['status']);
        self::assertNotNull($data['completedAt']);
    }

    public function testPatchOfflineTaskBecomesAwaitingReflection(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        $task = new ContactTask();
        $task->setContact($contact);
        $task->setTenant($user);
        $task->setType(ContactTask::TYPE_DATE_NIGHT);
        $task->setSeriesKey(ContactTask::TYPE_DATE_NIGHT);
        $task->setIsOffline(true);
        $em = $this->getEntityManager();
        $em->persist($task);
        $em->flush();

        $response = $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'completed'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertSame('awaiting_reflection', $data['status']);
        self::assertNotNull($data['reflectionDueAt']);
        self::assertNull($data['completedAt']);
    }

    public function testPatchSnoozeTask(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user);

        $future = (new \DateTimeImmutable('+7 days'))->format('Y-m-d');

        $response = $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'snoozed', 'snoozedUntil' => $future],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertSame('snoozed', $response->toArray()['status']);
    }

    public function testPatchSnoozeWithoutSnoozedUntilReturns422(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user);

        $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'snoozed'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseStatusCodeSame(422);
    }

    public function testPatchSnoozeWithPastDateReturns422(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user);

        $past = (new \DateTimeImmutable('-1 day'))->format('Y-m-d');
        $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'snoozed', 'snoozedUntil' => $past],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseStatusCodeSame(422);
    }

    public function testPatchInvalidTransitionReturns422(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user, ContactTask::STATUS_COMPLETED);

        $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'snoozed'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseStatusCodeSame(422);
    }

    public function testPatchTenantIsolationReturns404(): void
    {
        $userA = $this->getUser();
        $contactA = $this->createContact($userA);
        $taskA = $this->createTask($contactA, $userA);

        $userB = $this->createUser('task-patch-iso-' . bin2hex(random_bytes(4)) . '@test.com', 'pass');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        // getToken() calls createClient() internally; re-create so assertResponse* checks the right client.
        $client = static::createClient();

        // TenantFilter hides other users' tasks at DB level → 404 (not 403).
        $client->request('PATCH', '/api/contact_tasks/' . (int) $taskA->getId(), [
            'auth_bearer' => $tokenB,
            'json' => ['status' => 'completed'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testPatchSnoozedUntilIgnoredWithoutStatusChange(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user, ContactTask::STATUS_PENDING);

        $farFuture = (new \DateTimeImmutable('+999 days'))->format('Y-m-d');

        // PATCH with only snoozedUntil, no status change — must be silently discarded.
        $response = $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['snoozedUntil' => $farFuture],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertSame('pending', $response->toArray()['status']);
        self::assertNull($response->toArray()['snoozedUntil']);
    }

    public function testPatchUnsnoozeDoesNotPreserveSnoozedUntil(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user, ContactTask::STATUS_PENDING);

        // First, snooze the task.
        $future = (new \DateTimeImmutable('+7 days'))->format('Y-m-d');
        $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'snoozed', 'snoozedUntil' => $future],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseIsSuccessful();

        // Un-snooze with a far-future snoozedUntil in the same PATCH — must be cleared.
        $farFuture = (new \DateTimeImmutable('+999 days'))->format('Y-m-d');
        $response = $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'pending', 'snoozedUntil' => $farFuture],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertSame('pending', $response->toArray()['status']);
        self::assertNull($response->toArray()['snoozedUntil']);
    }

    public function testPatchSkipArchivesTask(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);
        $task = $this->createTask($contact, $user);

        $response = $client->request('PATCH', '/api/contact_tasks/' . (int) $task->getId(), [
            'auth_bearer' => $this->token,
            'json' => ['status' => 'archived'],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertSame('archived', $response->toArray()['status']);
    }

    // ── Needs Attention integration ───────────────────────────────────────────

    public function testContactWithOverdueTaskAppearsInNeedsAttention(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        // Create a task that is already overdue (due yesterday).
        $this->createTask($contact, $user, ContactTask::STATUS_PENDING, 'yesterday');

        $response = $client->request('GET', '/api/contacts/needs-attention', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        $ids = array_column($data['member'], 'id');
        self::assertContains($contact->getId(), $ids, 'Contact with overdue task should appear in needs-attention');

        // Find the dto for our contact and check hasOverdueTask flag.
        foreach ($data['member'] as $item) {
            if ($item['id'] === $contact->getId()) {
                self::assertTrue($item['hasOverdueTask']);
            }
        }
    }

    public function testContactWithFutureTaskDoesNotAppearInNeedsAttention(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        // Task is due in the future → not overdue.
        $this->createTask($contact, $user, ContactTask::STATUS_PENDING, '+14 days');

        $response = $client->request('GET', '/api/contacts/needs-attention', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $ids = array_column($response->toArray()['member'], 'id');
        self::assertNotContains($contact->getId(), $ids);
    }

    public function testSnoozedOverdueTaskDoesNotTriggerNeedsAttention(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        // Task was due yesterday but is snoozed until next week → not overdue.
        $task = $this->createTask($contact, $user, ContactTask::STATUS_SNOOZED, 'yesterday');
        $task->setSnoozedUntil(new \DateTimeImmutable('+7 days'));
        $this->getEntityManager()->flush();

        $response = $client->request('GET', '/api/contacts/needs-attention', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $ids = array_column($response->toArray()['member'], 'id');
        self::assertNotContains($contact->getId(), $ids);
    }

    public function testExpiredSnoozeAppearsInNeedsAttention(): void
    {
        $client = static::createClient();
        $user = $this->getUser();
        $contact = $this->createContact($user);

        // Task is snoozed until today → snooze has expired, should appear as overdue.
        $task = $this->createTask($contact, $user, ContactTask::STATUS_SNOOZED, 'yesterday');
        $task->setSnoozedUntil(new \DateTimeImmutable('today'));
        $this->getEntityManager()->flush();

        $response = $client->request('GET', '/api/contacts/needs-attention', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $ids = array_column($response->toArray()['member'], 'id');
        self::assertContains($contact->getId(), $ids, 'Contact with expired snooze (snoozedUntil=today) should appear in needs-attention');
    }
}
