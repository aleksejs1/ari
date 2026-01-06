<?php

namespace App\Tests\Functional;

use App\Entity\Contact;
use App\Entity\ContactAddress;
use App\Entity\ContactEmailAdress;
use App\Entity\ContactName;
use App\Entity\User;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * @psalm-suppress InternalMethod
 */
class ContactExportTest extends AbstractApiTestCase
{
    public function testExportContacts(): void
    {
        $client = static::createClient();
        $container = self::getContainer();
        $doctrine = $container->get('doctrine');
        assert($doctrine instanceof \Doctrine\Persistence\ManagerRegistry);
        $em = $doctrine->getManager();

        /** @var User $user */
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Create a contact
        $contact = new Contact();
        $contact->setUser($user);

        $name = new ContactName();
        $name->setGiven('John');
        $name->setFamily('Doe');
        $contact->addContactName($name);

        $email = new ContactEmailAdress();
        $email->setValue('john.doe@example.com');
        $email->setType('work');
        $contact->addContactEmailAdress($email);

        $address = new ContactAddress();
        $address->setCity('New York');
        $contact->addContactAddress($address);

        $em->persist($contact);
        $em->flush();

        ob_start();
        $client->request('GET', '/api/contacts/export', [
            'auth_bearer' => $this->token,
        ]);
        $content = (string) ob_get_clean();

        // If content is empty (processed by StreamedResponse), explicitly execute callback to capture it
        // Use strict check instead of empty()
        if ($content === '') {
            $response = $client->getKernelBrowser()->getResponse();
            if ($response instanceof StreamedResponse) {
                $reflection = new \ReflectionClass($response);
                $property = $reflection->getProperty('callback');
                $callback = $property->getValue($response);

                ob_start();
                if (is_callable($callback)) {
                    $callback();
                }
                $content = (string) ob_get_clean();
            }
        }

        self::assertResponseIsSuccessful();

        $response = $client->getResponse();
        if (null === $response) {
            self::fail('Response is null');
        }

        // Access headers via KernelResponse
        $headers = $response->getKernelResponse()->headers;
        $contentType = $headers->get('content-type', '');
        self::assertStringContainsString('text/xml', $contentType);

        self::assertStringContainsString('<contacts>', $content);
        self::assertStringContainsString('<contact>', $content);
        self::assertStringContainsString('John', $content);
        self::assertStringContainsString('Doe', $content);
        self::assertStringContainsString('john.doe@example.com', $content);
        self::assertStringContainsString('New York', $content);
    }
}
