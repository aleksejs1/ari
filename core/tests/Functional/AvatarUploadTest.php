<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AvatarUploadTest extends AbstractApiTestCase
{
    public function testUploadAvatar(): void
    {
        static::createClient();
        $user = $this->createUser('test_avatar@example.com', 'password');

        $contact = new Contact();
        $contact->setUser($user);
        $this->getEntityManager()->persist($contact);
        $this->getEntityManager()->flush();

        $filePath = tempnam(sys_get_temp_dir(), 'test_image');
        self::assertIsString($filePath);
        $image = imagecreatetruecolor(100, 100);
        self::assertNotFalse($image);
        imagejpeg($image, $filePath);

        $uploadedFile = new UploadedFile(
            $filePath,
            'avatar.jpg',
            'image/jpeg',
            null,
            true,
        );

        $token = $this->getToken('test_avatar@example.com', 'password');
        $client = static::createClient();

        $response = $client->request('POST', '/api/contacts/' . (string) $contact->getId() . '/avatar', [
            'headers' => [
                'Content-Type' => 'multipart/form-data',
                'Authorization' => 'Bearer ' . $token,
            ],
            'extra' => [
                'files' => [
                    'file' => $uploadedFile,
                ],
            ],
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'mimeType' => 'image/jpeg',
        ]);

        $responseContent = $response->toArray();
        self::assertArrayHasKey('thumbnailDataEncoded', $responseContent);
        self::assertNotEmpty($responseContent['thumbnailDataEncoded']);

        $this->getEntityManager()->clear();
        $updatedContact = $this->getEntityManager()->getRepository(Contact::class)->find($contact->getId());
        self::assertInstanceOf(Contact::class, $updatedContact);

        $avatar = $updatedContact->getAvatar();
        self::assertNotNull($avatar);
        self::assertNotNull($avatar->getPath());

        // Check if file exists in public directory (since default is local in test too)
        $projectDir = self::getContainer()->getParameter('kernel.project_dir');
        self::assertIsString($projectDir);
        $fullPath = $projectDir . '/public/uploads/avatars/' . $avatar->getPath();
        self::assertFileExists($fullPath);

        // Cleanup
        unlink($fullPath);
    }

    public function testUploadAvatarTenantIsolation(): void
    {
        static::createClient();

        $this->createUser('user1@example.com', 'password');
        $user2 = $this->createUser('user2@example.com', 'password');

        $contactOfUser2 = new Contact();
        $contactOfUser2->setUser($user2);
        $this->getEntityManager()->persist($contactOfUser2);
        $this->getEntityManager()->flush();

        $filePath = tempnam(sys_get_temp_dir(), 'test_image');
        self::assertIsString($filePath);
        $image = imagecreatetruecolor(100, 100);
        self::assertNotFalse($image);
        imagejpeg($image, $filePath);

        $uploadedFile = new UploadedFile($filePath, 'avatar.jpg', 'image/jpeg', null, true);

        $token = $this->getToken('user1@example.com', 'password');
        $client = static::createClient();

        // User1 tries to upload avatar to User2's contact
        $client->request('POST', '/api/contacts/' . (string) $contactOfUser2->getId() . '/avatar', [
            'headers' => [
                'Content-Type' => 'multipart/form-data',
                'Authorization' => 'Bearer ' . $token,
            ],
            'extra' => [
                'files' => [
                    'file' => $uploadedFile,
                ],
            ],
        ]);

        // Should return 404 because of TenantFilter (it prevents contact from being found)
        self::assertResponseStatusCodeSame(404);
    }
}
