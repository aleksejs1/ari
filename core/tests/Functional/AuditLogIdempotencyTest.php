<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\AuditLog;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class AuditLogIdempotencyTest extends ApiTestCase
{
    private string $token;
    private string $userUuid;

    #[\Override]
    protected function setUp(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
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

    public function testIdempotentUpdateDoesNotCreateAuditLog(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();

        // 1. Create a contact with a date
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactDates' => [
                    [
                        'date' => '2025-01-23',
                        'text' => 'Birthday',
                    ],
                ],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();
        $contactIri = $data['@id'];
        $contactDateId = $data['contactDates'][0]['id'];
        $contactDateIri = $data['contactDates'][0]['@id'];

        // Get initial AuditLog count
        $em->clear();
        $auditLogsBefore = $em->getRepository(AuditLog::class)->findAll();
        $countBefore = count($auditLogsBefore);

        // 2. Perform PUT with the same date but potentially different timezone representation
        $client->request('PUT', $contactIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'contactDates' => [
                    [
                        'id' => (string) $contactDateId,
                        '@id' => $contactDateIri,
                        'date' => '2025-01-23T00:00:00+00:00',
                        'text' => 'Birthday',
                    ]
                ]
            ],
        ]);
        self::assertResponseIsSuccessful();

        // 3. Verify AuditLog count has NOT increased
        $em->clear();
        $auditLogsAfter = $em->getRepository(AuditLog::class)->findAll();
        $countAfter = count($auditLogsAfter);

        self::assertEquals($countBefore, $countAfter, 'Audit log count should not increase for idempotent update');
    }
}
