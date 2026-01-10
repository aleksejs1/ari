<?php

namespace App\Service\Export;

use App\Entity\Contact;
use App\Entity\User;
use App\Repository\ContactRepository;
use App\Repository\GroupRepository;
use Symfony\Component\Serializer\SerializerInterface;

class ContactExportService
{
    public function __construct(
        private readonly ContactRepository $contactRepository,
        private readonly GroupRepository $groupRepository,
        private readonly SerializerInterface $serializer,
    ) {
    }

    public function exportToXml(User $user, callable $write): void
    {
        $contactsQuery = $this->contactRepository->createQueryBuilder('c')
            ->where('c.user = :user')
            ->setParameter('user', $user)
            ->getQuery();

        $groups = $this->groupRepository->findBy(['user' => $user]);

        $write('<?xml version="1.0" encoding="UTF-8"?>');
        $write('<ari_export>');

        // Export Groups
        $write('<groups>');
        foreach ($groups as $group) {
            $xml = $this->serializer->serialize($group, 'xml', [
                'groups' => ['export'],
                'xml_root_node_name' => 'group',
                'xml_format_output' => true,
            ]);
            $xml = str_replace('<?xml version="1.0"?>', '', $xml);
            $write($xml);
        }
        $write('</groups>');

        // Export Contacts
        $write('<contacts>');
        foreach ($contactsQuery->toIterable() as $contact) {
            if (!$contact instanceof Contact) {
                continue;
            }

            $xml = $this->serializer->serialize($contact, 'xml', [
                'groups' => ['export'],
                'xml_root_node_name' => 'contact',
                'xml_format_output' => true,
            ]);

            $xml = str_replace('<?xml version="1.0"?>', '', $xml);
            $write($xml);
        }
        $write('</contacts>');

        $write('</ari_export>');
    }
}
