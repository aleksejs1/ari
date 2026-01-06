<?php

namespace App\Controller;

use App\Entity\Contact;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class ExportContactsAction
{
    public function __invoke(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em,
        Security $security,
    ): StreamedResponse {
        $user = $security->getUser();

        if (!$user instanceof \App\Entity\User) {
            throw new AccessDeniedException();
        }

        return new StreamedResponse(function () use ($user, $em, $serializer) {
            $contactRepo = $em->getRepository(Contact::class);
            $groupRepo = $em->getRepository(\App\Entity\Group::class);

            $contactsQuery = $contactRepo->createQueryBuilder('c')
                ->where('c.user = :user')
                ->setParameter('user', $user)
                ->getQuery();

            $groups = $groupRepo->findBy(['user' => $user]);

            echo '<?xml version="1.0" encoding="UTF-8"?>';
            echo '<ari_export>';

            // Export Groups
            echo '<groups>';
            foreach ($groups as $group) {
                $xml = $serializer->serialize($group, 'xml', [
                    'groups' => ['export'],
                    'xml_root_node_name' => 'group',
                    'xml_format_output' => true,
                ]);
                $xml = str_replace('<?xml version="1.0"?>', '', $xml);
                echo $xml;
                flush();
            }
            echo '</groups>';

            // Export Contacts
            echo '<contacts>';
            foreach ($contactsQuery->toIterable() as $contact) {
                if (!$contact instanceof Contact) {
                    continue;
                }

                $xml = $serializer->serialize($contact, 'xml', [
                    'groups' => ['export'],
                    'xml_root_node_name' => 'contact',
                    'xml_format_output' => true,
                ]);

                $xml = str_replace('<?xml version="1.0"?>', '', $xml);
                echo $xml;
                flush();
            }
            echo '</contacts>';

            echo '</ari_export>';
        }, 200, [
            'Content-Type' => 'text/xml',
            'Content-Disposition' => 'attachment; filename="contacts_export.xml"',
        ]);
    }
}
