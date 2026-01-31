<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class ContactVCardTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token;
    private string $userUuid;

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
        $this->userUuid = 'vCardUser-' . bin2hex(random_bytes(4));
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

    public function testVCardExport(): void
    {
        $client = static::createClient();

        // 1. Create Contact
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        self::assertResponseStatusCodeSame(201);
        $contactIri = $response->toArray()['@id'];
        $contactId = $response->toArray()['id'];

        // 2. Add Name
        $client->request('POST', '/api/contact_names', [
            'auth_bearer' => $this->token,
            'json' => [
                'family' => 'Smith',
                'given' => 'Bob',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // 3. Add Phone
        $client->request('POST', '/api/contact_phone_numbers', [
            'auth_bearer' => $this->token,
            'json' => [
                'value' => '+123456789',
                'type' => 'work',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // 4. Add Email
        $client->request('POST', '/api/contact_email_adresses', [
            'auth_bearer' => $this->token,
            'json' => [
                'value' => 'bob@example.com',
                'type' => 'home',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // 5. Add Address
        $client->request('POST', '/api/contact_addresses', [
            'auth_bearer' => $this->token,
            'json' => [
                'street' => 'Main St',
                'city' => 'Springfield',
                'country' => 'USA',
                'type' => 'home',
                'contact' => $contactIri,
            ],
        ]);
        self::assertResponseStatusCodeSame(201);

        // 6. Export vCard
        $response = $client->request('GET', "/api/contacts/$contactId/vcard", [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('Content-Type', 'text/vcard; charset=utf-8');
        self::assertResponseHeaderSame('Content-Disposition', 'attachment; filename="Bob_Smith.vcf"');

        $content = $response->getContent();
        self::assertStringContainsString('BEGIN:VCARD', $content);
        self::assertStringContainsString('VERSION:4.0', $content);
        self::assertStringContainsString('FN:Bob Smith', $content);
        self::assertStringContainsString('N:Smith;Bob;;;', $content);
        self::assertStringContainsString('TEL;TYPE=work:+123456789', $content);
        self::assertStringContainsString('EMAIL;TYPE=home:bob@example.com', $content);
        self::assertStringContainsString('ADR;TYPE=home:;;Main St;Springfield;;;USA', $content);
        self::assertStringContainsString('END:VCARD', $content);
    }
}
