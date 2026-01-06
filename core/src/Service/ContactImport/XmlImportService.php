<?php

namespace App\Service\ContactImport;

use App\Entity\Contact;
use App\Entity\ContactAddress;
use App\Entity\ContactBiography;
use App\Entity\ContactDate;
use App\Entity\ContactEmailAdress;
use App\Entity\ContactGroup;
use App\Entity\ContactName;
use App\Entity\ContactOrganization;
use App\Entity\ContactPhoneNumber;
use App\Entity\ContactRelation;
use App\Entity\Group;
use App\Entity\User;
use App\Repository\ContactRepository;
use App\Repository\GroupRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\Helper\CollectionSyncTrait;
use Symfony\Component\Uid\Uuid;

class XmlImportService
{
    use CollectionSyncTrait;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly GroupRepository $groupRepository,
        private readonly ContactRepository $contactRepository,
    ) {
    }

    public function import(string $xmlContent, User $user): void
    {
        $xml = simplexml_load_string($xmlContent);
        if (false === $xml) {
            throw new \InvalidArgumentException('Invalid XML content');
        }

        // Phase 1: Import Groups
        foreach ($xml->groups->group as $groupNode) {
            // @var \SimpleXMLElement $groupNode
            $this->importGroup($groupNode, $user);
        }
        $this->entityManager->flush();

        // Phase 2: Import Contacts (Base)
        $contactsMap = []; // Map UUID string -> Contact Entity
        foreach ($xml->contacts->contact as $contactNode) {
            // @var \SimpleXMLElement $contactNode
            $contact = $this->importContactBase($contactNode, $user);
            $uuid = $contact->getUuid()?->toRfc4122();
            $uuidStr = (string) $uuid;
            if ('' !== $uuidStr) {
                $contactsMap[$uuidStr] = $contact;
            }
        }
        $this->entityManager->flush();

        // Phase 3: Import Contact Relations
        foreach ($xml->contacts->contact as $contactNode) {
            // @var \SimpleXMLElement $contactNode
            $uuid = (string) $contactNode->uuid;
            if (isset($contactsMap[$uuid])) {
                $this->importContactRelations($contactNode, $contactsMap[$uuid], $contactsMap);
            }
        }
        $this->entityManager->flush();
    }

    private function importGroup(\SimpleXMLElement $node, User $user): void
    {
        $uuid = (string) $node->uuid;
        $name = (string) $node->name;

        if ('' === $uuid) {
            return;
        }

        $group = $this->groupRepository->findOneBy(['uuid' => $uuid, 'user' => $user]);
        if (null === $group) {
            $group = new Group();
            $group->setUser($user);
            $group->setUuid(Uuid::fromString($uuid));
            $this->entityManager->persist($group);
        }

        $group->setName($name);
    }

    private function importContactBase(\SimpleXMLElement $node, User $user): Contact
    {
        $uuid = (string) $node->uuid;

        $contact = null;
        if ('' !== $uuid) {
            $contact = $this->contactRepository->findOneBy(['uuid' => $uuid, 'user' => $user]);
        }

        if (null === $contact) {
            $contact = new Contact();
            $contact->setUser($user);
            if ('' !== $uuid) {
                $contact->setUuid(Uuid::fromString($uuid));
            }
            $this->entityManager->persist($contact);
        }

        // Helper to convert SimpleXML children to array of arrays
        /** @return array<int, array<string, string>> */
        $toItems = function ($parentNode): array {
            $items = [];
            if (isset($parentNode->item)) {
                foreach ($parentNode->item as $item) {
                    $row = [];
                    foreach ($item as $key => $value) {
                        $row[(string) $key] = (string) $value;
                    }
                    $items[] = $row;
                }
            }

            return $items;
        };

        // Sync Basic Collections
        $this->syncCollection(
            $contact->getContactNames(),
            $toItems($node->contactNames),
            function (ContactName $e, array $d) {
                return $e->getGiven() === ($d['given'] ?? '') && $e->getFamily() === ($d['family'] ?? '');
            },
            function (ContactName $e, array $d) {
                $e->setGiven($d['given'] ?? '')->setFamily($d['family'] ?? '');
            },
            fn (array $d) => (new ContactName($contact))->setGiven($d['given'] ?? '')->setFamily($d['family'] ?? '')
        );

        $this->syncCollection(
            $contact->getContactDates(),
            $toItems($node->contactDates),
            function (ContactDate $e, array $d) {
                // Logic already OK, just fixing strict bool
                $dateStr = $d['date'] ?? '';
                $eDate = $e->getDate();
                $parsed = \DateTime::createFromFormat('Y-m-d', $dateStr);
                $dDate = false !== $parsed ? $parsed : null;
                if (null === $dDate && '' !== $dateStr) {
                    try {
                        $dDate = new \DateTime($dateStr);
                    } catch (\Exception $x) {
                    }
                }

                $textMatch = $e->getText() === ($d['text'] ?? '');

                if (null !== $eDate && null !== $dDate) {
                    return $eDate->format('Y-m-d') === $dDate->format('Y-m-d') && $textMatch;
                }

                return false;
            },
            function (ContactDate $e, array $d) {
                $dateStr = $d['date'] ?? '';
                if ('' !== $dateStr) {
                    try {
                        $dt = new \DateTime($dateStr);
                        $e->setDate($dt);
                    } catch (\Exception $x) {
                    }
                }
                $e->setText($d['text'] ?? '');
            },
            function (array $d) use ($contact) {
                $e = new ContactDate($contact);
                $dateStr = $d['date'] ?? '';
                if ('' !== $dateStr) {
                    try {
                        $dt = new \DateTime($dateStr);
                        $e->setDate($dt);
                    } catch (\Exception $x) {
                    }
                }
                $e->setText($d['text'] ?? '');

                return $e;
            }
        );

        $this->syncCollection(
            $contact->getContactEmailAdresses(),
            $toItems($node->contactEmailAdresses),
            function (ContactEmailAdress $e, array $d) {
                return $e->getValue() === ($d['value'] ?? '') && $e->getType() === ($d['type'] ?? '');
            },
            function (ContactEmailAdress $e, array $d) {
                $e->setValue($d['value'] ?? '')->setType($d['type'] ?? '');
            },
            fn (array $d) => (new ContactEmailAdress($contact))->setValue($d['value'] ?? '')->setType($d['type'] ?? '')
        );

        $this->syncCollection(
            $contact->getPhoneNumbers(),
            $toItems($node->phoneNumbers),
            function (ContactPhoneNumber $e, array $d) {
                return $e->getValue() === ($d['value'] ?? '') && $e->getType() === ($d['type'] ?? '');
            },
            function (ContactPhoneNumber $e, array $d) {
                $e->setValue($d['value'] ?? '')->setType($d['type'] ?? '');
            },
            fn (array $d) => (new ContactPhoneNumber($contact))->setValue($d['value'] ?? '')->setType($d['type'] ?? '')
        );

        $this->syncCollection(
            $contact->getContactAddresses(),
            $toItems($node->contactAddresses),
            fn (ContactAddress $e, array $d) => $e->getStreet() === ($d['street'] ?? '')
                && $e->getCity() === ($d['city'] ?? '')
                && $e->getType() === ($d['type'] ?? ''),
            function (ContactAddress $e, array $d) {
                $e->setStreet($d['street'] ?? '')->setCity($d['city'] ?? '')->setType($d['type'] ?? '')
                  ->setRegion($d['region'] ?? '')->setPostalCode($d['postalCode'] ?? '')
                  ->setCountry($d['country'] ?? '')->setCountryCode($d['countryCode'] ?? '')
                  ->setStreetExtended($d['streetExtended'] ?? '');
            },
            function (array $d) use ($contact) {
                $e = new ContactAddress($contact);

                return $e->setStreet($d['street'] ?? '')->setCity($d['city'] ?? '')->setType($d['type'] ?? '')
                  ->setRegion($d['region'] ?? '')->setPostalCode($d['postalCode'] ?? '')
                  ->setCountry($d['country'] ?? '')->setCountryCode($d['countryCode'] ?? '')
                  ->setStreetExtended($d['streetExtended'] ?? '');
            }
        );

        $this->syncCollection(
            $contact->getContactOrganizations(),
            $toItems($node->contactOrganizations),
            function (ContactOrganization $e, array $d) {
                return $e->getName() === ($d['name'] ?? '') && $e->getTitle() === ($d['title'] ?? '');
            },
            function (ContactOrganization $e, array $d) {
                $e->setName($d['name'] ?? '')->setTitle($d['title'] ?? '')
                  ->setDepartment($d['department'] ?? '')->setJobDescription($d['jobDescription'] ?? '')
                  ->setType($d['type'] ?? '');
            },
            function (array $d) use ($contact) {
                $e = new ContactOrganization($contact);

                return $e->setName($d['name'] ?? '')->setTitle($d['title'] ?? '')
                 ->setDepartment($d['department'] ?? '')->setJobDescription($d['jobDescription'] ?? '')
                 ->setType($d['type'] ?? '');
            }
        );

        $this->syncCollection(
            $contact->getContactBiographies(),
            $toItems($node->contactBiographies),
            function (ContactBiography $e, array $d) {
                return $e->getValue() === ($d['value'] ?? '') && $e->getType() === ($d['type'] ?? '');
            },
            function (ContactBiography $e, array $d) {
                $e->setValue($d['value'] ?? '')->setType($d['type'] ?? '');
            },
            fn (array $d) => (new ContactBiography($contact))->setValue($d['value'] ?? '')->setType($d['type'] ?? '')
        );

        // Sync Groups
        $this->syncCollection(
            $contact->getContactGroups(),
            $toItems($node->contactGroups),
            function (ContactGroup $e, array $d) {
                return $e->getGroupUuid() === ($d['groupUuid'] ?? '');
            },
            function (ContactGroup $_e, array $_d) {
            },
            function (array $d) use ($contact, $user) {
                $e = new ContactGroup($contact);
                $uuid = $d['groupUuid'] ?? '';
                if ('' !== $uuid) {
                    $group = $this->groupRepository->findOneBy(['uuid' => $uuid, 'user' => $user]);
                    if (null !== $group) {
                        $e->setGroupResource($group);
                    }
                }

                return $e;
            }
        );

        return $contact;
    }

    /**
     * @param array<string, Contact> $contactsMap
     */
    private function importContactRelations(\SimpleXMLElement $node, Contact $contact, array $contactsMap): void
    {
        // Helpers - duplicate for scope or move to method
        /** @return array<int, array<string, string>> */
        $toItems = function ($parentNode): array {
            $items = [];
            if (isset($parentNode->item)) {
                foreach ($parentNode->item as $item) {
                    $row = [];
                    foreach ($item as $key => $value) {
                        $row[(string) $key] = (string) $value;
                    }
                    $items[] = $row;
                }
            }

            return $items;
        };

        $this->syncCollection(
            $contact->getContactRelations(),
            $toItems($node->contactRelations),
            function (ContactRelation $e, array $d) {
                return $e->getPersonUuid() === ($d['personUuid'] ?? '') && $e->getType() === ($d['type'] ?? '');
            },
            function (ContactRelation $e, array $d) {
                $e->setType($d['type'] ?? '');
            },
            function (array $d) use ($contact, $contactsMap) {
                $e = new ContactRelation($contact);
                $e->setType($d['type'] ?? '');
                $uuid = $d['personUuid'] ?? '';
                if (isset($contactsMap[$uuid])) {
                    $e->setPerson($contactsMap[$uuid]);
                }

                return $e;
            }
        );
    }
}
