<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class DeletedEntityAuditLogTest extends ApiTestCase
{
    private string $token;
    private string $userUuid;

    // Suppress API Platform deprecation about kernel booting
    protected static ?bool $alwaysBootKernel = true;

    #[\Override]
    protected function setUp(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // Create User
        $this->userUuid = 'user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);
        $em->flush();

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

    public function testTimelineIncludesLogsForDeletedEntities(): void
    {
        $client = static::createClient();

        // 1. Create a contact with a name
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    [
                        'given' => 'John',
                        'family' => 'Doe',
                    ],
                ],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();
        $contactId = $data['id'];
        $contactNameId = $data['contactNames'][0]['id'];
        $contactNameIri = $data['contactNames'][0]['@id'];

        // 2. Delete the Name (not the contact)
        $client->request('DELETE', $contactNameIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 3. Get Contact Timeline
        $timelineResponse = $client->request('GET', "/api/contacts/{$contactId}/timeline", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $timelineData = $timelineResponse->toArray();
        $logs = $timelineData['logs'];

        // 4. Verify logs for the deleted name are present
        $foundCreateLog = false;
        $foundDeleteLog = false;

        foreach ($logs as $log) {
            if ('App\\Entity\\ContactName' === $log['entityType'] && $log['entityId'] === $contactNameId) {
                if ('INSERT' === $log['action']) {
                    $foundCreateLog = true;
                }
                if ('REMOVE' === $log['action']) {
                    $foundDeleteLog = true;
                }
            }
        }

        self::assertTrue($foundCreateLog, 'Timeline should contain INSERT log for deleted ContactName');
        self::assertTrue($foundDeleteLog, 'Timeline should contain REMOVE log for deleted ContactName');
    }
}
