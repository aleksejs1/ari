<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Tests for Phase 1 additions to ContactInteraction: initiator, tags, createdAt.
 */
class ContactInteractionExtendedTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private string $token;
    private string $otherToken;
    private string $contactIri;

    #[\Override]
    protected function setUp(): void
    {
        static::createClient();
        $container = static::getContainer();

        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $userAUuid = 'ci-a-' . bin2hex(random_bytes(4));
        $userA = new User();
        $userA->setUuid($userAUuid);
        $userA->setPassword($hasher->hashPassword($userA, 'pass'));
        $em->persist($userA);

        $userBUuid = 'ci-b-' . bin2hex(random_bytes(4));
        $userB = new User();
        $userB->setUuid($userBUuid);
        $userB->setPassword($hasher->hashPassword($userB, 'pass'));
        $em->persist($userB);

        $em->flush();

        $this->token = $this->getToken($userAUuid, 'pass');
        $this->otherToken = $this->getToken($userBUuid, 'pass');

        $response = static::createClient()->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);
        $this->contactIri = $response->toArray()['@id'];
    }

    private function getToken(string $username, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => ['username' => $username, 'password' => $password],
        ]);

        return $response->toArray()['token'];
    }

    /**
     * Posts a contact_interaction and returns the decoded response array (may contain errors).
     *
     * @param array<string, mixed> $overrides
     * @return array<string, mixed>
     */
    private function postInteraction(array $overrides = []): array
    {
        $response = static::createClient()->request('POST', '/api/contact_interactions', [
            'auth_bearer' => $this->token,
            'json' => array_merge([
                'contact' => $this->contactIri,
                'type' => 'call',
                'description' => 'Test',
                'timestamp' => (new \DateTimeImmutable())->format(\DateTimeInterface::ATOM),
            ], $overrides),
        ]);

        return $response->toArray(throw: false);
    }

    public function testCreateWithInitiatorAndTagsReturns201(): void
    {
        $data = $this->postInteraction(['initiator' => 'me', 'tags' => ['business', 'fundraising']]);

        self::assertResponseStatusCodeSame(201);
        self::assertSame('me', $data['initiator']);
        self::assertSame(['business', 'fundraising'], $data['tags']);
        self::assertArrayHasKey('createdAt', $data);
        self::assertNotNull($data['createdAt']);
    }

    public function testCreateWithoutInitiatorOrTagsDefaultsToNull(): void
    {
        $data = $this->postInteraction();

        self::assertResponseStatusCodeSame(201);
        $interactionIri = $data['@id'];

        // Fetch the created interaction to verify null defaults
        $fetched = static::createClient()->request('GET', $interactionIri, [
            'auth_bearer' => $this->token,
        ])->toArray();

        self::assertNull($fetched['initiator']);
        self::assertNull($fetched['tags']);
    }

    public function testInvalidInitiatorReturns422(): void
    {
        $this->postInteraction(['initiator' => 'nobody']);

        self::assertResponseStatusCodeSame(422);
    }

    public function testTagStringTooLongReturns422(): void
    {
        $this->postInteraction(['tags' => [str_repeat('x', 101)]]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testPatchClearsTags(): void
    {
        $data = $this->postInteraction(['tags' => ['topic1', 'topic2']]);
        self::assertResponseStatusCodeSame(201);
        $interactionIri = $data['@id'];

        static::createClient()->request('PATCH', $interactionIri, [
            'auth_bearer' => $this->token,
            'json' => ['tags' => []],
            'headers' => ['Content-Type' => 'application/merge-patch+json'],
        ]);

        self::assertResponseStatusCodeSame(200);
        self::assertJsonContains(['tags' => []]);
    }

    public function testTenantIsolation(): void
    {
        $data = $this->postInteraction();
        self::assertResponseStatusCodeSame(201);
        $interactionIri = $data['@id'];

        static::createClient()->request('GET', $interactionIri, [
            'auth_bearer' => $this->otherToken,
        ]);

        // Tenant filter removes the entity from User B's view → 404
        self::assertResponseStatusCodeSame(404);
    }
}
