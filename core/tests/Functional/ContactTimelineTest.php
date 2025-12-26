<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\AuditLog;
use App\Entity\Contact;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactTimelineTest extends ApiTestCase
{
    private string $token;
    private string $userUuid;
    private EntityManagerInterface $em;

    protected static ?bool $alwaysBootKernel = true;

    #[\Override]
    protected function setUp(): void
    {
        static::createClient();
        $container = static::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();
        $this->em = $em;

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // Create User
        $this->userUuid = 'user-timeline-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        // Run flush for User
        $this->em->persist($user);
        $this->em->flush();

        // Get token
        $this->token = $this->getToken($this->userUuid, 'pass');
    }

    private function getToken(string $username, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => [
                'username' => $username,
                'password' => $password,
            ],
        ]);

        return $response->toArray()['token'];
    }

    public function testGetContactTimeline(): void
    {
        $client = static::createClient();

        // 1. Create Contact (Triggers AuditLog for Contact INSERT)
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactId = $response->toArray()['id'];
        $contactIri = $response->toArray()['@id'];

        // 2. Add Contact Name (Triggers AuditLog for ContactName INSERT)
        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => 'Doe',
                'given' => 'John',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // 3. Add Contact Date (Triggers AuditLog for ContactDate INSERT)
        $client->request('POST', '/api/contact_dates', [
            'auth_bearer' => $this->token,
            'json' => [
                'date' => '2023-01-01',
                'text' => 'Birthday',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // 4. Update Contact Name (Triggers AuditLog for ContactName UPDATE)
        // Need to find the name ID first? Or just add another one.
        // Let's add another one to be sure of order.
        sleep(1); // Ensure timestamp difference for sorting check

        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => 'Smith',
                'given' => 'Jane',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // Verify Timeline
        $timelineUrl = "/api/contacts/{$contactId}/timeline";
        $response = $client->request('GET', $timelineUrl, [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $timeline = $response->toArray();

        self::assertArrayHasKey('logs', $timeline);
        self::assertGreaterThanOrEqual(4, count($timeline['logs']));

        // Check Sorting (DESC)
        $firstLog = $timeline['logs'][0];
        $lastLog = $timeline['logs'][count($timeline['logs']) - 1];

        $firstDate = new \DateTime($firstLog['createdAt']);
        $lastDate = new \DateTime($lastLog['createdAt']);

        self::assertGreaterThanOrEqual($lastDate, $firstDate, 'Timeline should be sorted by date DESC');

        // Check Content
        $entityTypes = array_column($timeline['logs'], 'entityType');
        self::assertContains(Contact::class, $entityTypes);
        self::assertContains('App\Entity\ContactName', $entityTypes);
        self::assertContains('App\Entity\ContactDate', $entityTypes);
    }

    public function testGetTimelineNotFound(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/contacts/999999/timeline', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }
}
