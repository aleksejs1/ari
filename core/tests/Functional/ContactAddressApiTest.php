<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Contact;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactAddressApiTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token;
    private string $otherToken;
    private string $userUuid;
    private string $otherUserUuid;
    private string $contactIri;
    private string $otherContactIri;

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

        // Create User 1
        $this->userUuid = 'user1-address-' . bin2hex(random_bytes(4));
        $user1 = new User();
        $user1->setUuid($this->userUuid);
        $user1->setPassword($hasher->hashPassword($user1, 'pass'));
        $em->persist($user1);

        // Create User 2
        $this->otherUserUuid = 'user2-address-' . bin2hex(random_bytes(4));
        $user2 = new User();
        $user2->setUuid($this->otherUserUuid);
        $user2->setPassword($hasher->hashPassword($user2, 'pass'));
        $em->persist($user2);

        // Create Contacts for each user
        $contact1 = new Contact();
        $contact1->setUser($user1);
        $em->persist($contact1);

        $contact2 = new Contact();
        $contact2->setUser($user2);
        $em->persist($contact2);

        $em->flush();

        // Get tokens
        $this->token = $this->getToken($this->userUuid, 'pass');
        $this->otherToken = $this->getToken($this->otherUserUuid, 'pass');

        // Cast to string to avoid Psalm errors
        $this->contactIri = '/api/contacts/' . (string) $contact1->getId();
        $this->otherContactIri = '/api/contacts/' . (string) $contact2->getId();
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

    public function testContactAddressCRUD(): void
    {
        $client = static::createClient();

        // 1. Create ContactAddress
        $response = $client->request('POST', '/api/contact_addresses', [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'Home',
                'street' => '123 Test St',
                'city' => 'Test City',
                'country' => 'Testland',
                'contact' => $this->contactIri,
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $addressIri = $response->toArray()['@id'];

        // 2. GET Item
        $client->request('GET', $addressIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'type' => 'Home',
            'street' => '123 Test St',
        ]);

        // 3. PUT (Update fully)
        $client->request('PUT', $addressIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'Work',
                'street' => '456 Business Rd',
                'city' => 'Work City',
                'country' => 'Workland',
                'contact' => $this->contactIri,
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'type' => 'Work',
            'street' => '456 Business Rd',
        ]);

        // 4. PATCH (Update partially)
        $client->request('PATCH', $addressIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'city' => 'New City',
            ],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'type' => 'Work', // unchanged
            'city' => 'New City',
        ]);

        // 5. GET Collection
        $response = $client->request('GET', '/api/contact_addresses', [
            'auth_bearer' => $this->token,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(1, $response->toArray()['member']);

        // 5.1 Check Audit Log for PUT (Update)
        // The PUT update changed 'type' from 'Home' to 'Work' and 'street' from '123 Test St' to '456 Business Rd'
        $timelineResponse = $client->request('GET', $this->contactIri . '/timeline', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $timelineData = $timelineResponse->toArray();
        $logs = $timelineData['logs'];

        // Find the UPDATE log for ContactAddress
        $updateLog = null;
        foreach ($logs as $log) {
            if ('App\\Entity\\ContactAddress' === $log['entityType'] && 'UPDATE' === $log['action']) {
                $updateLog = $log;
                break;
            }
        }

        self::assertNotNull($updateLog, 'Audit log for ContactAddress UPDATE not found');
        self::assertArrayHasKey('changes', $updateLog);

        // Detailed check for the bug reported: updates should show actual values, not null -> ""
        // Changes: type: Home -> Work, street: 123 Test St -> 456 Business Rd
        $changes = $updateLog['changes'];
        self::assertArrayHasKey('type', $changes);
        self::assertEquals('Home', $changes['type'][0]);
        self::assertEquals('Work', $changes['type'][1]);

        self::assertArrayHasKey('street', $changes);
        self::assertEquals('123 Test St', $changes['street'][0]);
        self::assertEquals('456 Business Rd', $changes['street'][1]);

        self::assertEquals('456 Business Rd', $changes['street'][1]);

        // 5.2 Test "Empty String to Null" behavior
        // Update with empty strings for optional fields. They should be converted to null,
        // and since they are already null (default), no audit log change should be recorded for them.
        $client->request('PUT', $addressIri, [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'Work',
                'street' => '456 Business Rd',
                'streetExtended' => '',
                'region' => '',
                'countryCode' => '',
                'contact' => $this->contactIri,
            ],
        ]);
        self::assertResponseIsSuccessful();

        $timelineResponse = $client->request('GET', $this->contactIri . '/timeline', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $logs = $timelineResponse->toArray()['logs'];

        // Find the log that has 'streetExtended' in changes (Bug reproduction)
        $bugLog = null;
        foreach ($logs as $log) {
            if ('App\\Entity\\ContactAddress' === $log['entityType'] && 'UPDATE' === $log['action']) {
                if (isset($log['changes']['streetExtended'])) {
                    $bugLog = $log;
                    break;
                }
            }
        }

        self::assertNull($bugLog, 'Should NOT find an UPDATE log with streetExtended change (Bug fixed)');

        // 6. Security: Other user cannot see this item
        $client->request('GET', $addressIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // Security: Other user cannot update (PUT)
        $client->request('PUT', $addressIri, [
            'auth_bearer' => $this->otherToken,
            'json' => [
                'type' => 'Hacked',
                'contact' => $this->contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(404);

        // Security: Other user cannot delete
        $client->request('DELETE', $addressIri, [
            'auth_bearer' => $this->otherToken,
        ]);
        self::assertResponseStatusCodeSame(404);

        // 7. Security: Other user cannot list this item
        $response = $client->request('GET', '/api/contact_addresses', [
            'auth_bearer' => $this->otherToken,
            'headers' => ['Accept' => 'application/ld+json'],
        ]);
        self::assertResponseIsSuccessful();
        self::assertCount(0, $response->toArray()['member']);

        // 8. DELETE
        $client->request('DELETE', $addressIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 9. Verify deletion
        $client->request('GET', $addressIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(404);
    }

    public function testCannotCreateContactAddressForOthersContact(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/contact_addresses', [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'Malicious',
                'street' => 'Malicious St',
                'contact' => $this->otherContactIri,
            ],
        ]);

        // When trying to use another user's contact, the contact is not found due to filter
        // -> 400 Bad Request
        self::assertResponseStatusCodeSame(400);
    }
}
