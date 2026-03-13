<?php

namespace Ari\Service\ContactImport;

use Ari\Entity\Contact;
use Ari\Entity\ContactAddress;
use Ari\Entity\ContactBiography;
use Ari\Entity\ContactDate;
use Ari\Entity\ContactEmailAdress;
use Ari\Entity\ContactGroup;
use Ari\Entity\ContactName;
use Ari\Entity\ContactOrganization;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\ContactRelation;
use Ari\Entity\Group;
use Ari\Entity\User;
use Ari\Repository\ContactRepository;
use Ari\Repository\GroupRepository;
use Ari\Service\Entitlement\EntitlementServiceInterface;
use Ari\Service\Helper\CollectionSyncTrait;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

class XmlImportService
{
    use CollectionSyncTrait;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly GroupRepository $groupRepository,
        private readonly ContactRepository $contactRepository,
        private readonly EntitlementServiceInterface $entitlementService,
        private readonly int $importLimit,
    ) {
    }

    public function import(string $xmlContent, User $user): XmlImportResult
    {
        $xml = simplexml_load_string($xmlContent);
        if (false === $xml) {
            throw new \InvalidArgumentException('Invalid XML content');
        }

        // Phase 0: quota pre-check
        // Determine which contacts in the XML are new (not yet in DB) and apply quota.
        $existingUuidSet = $this->buildExistingUuidSet($xml, $user);
        $newCount = $this->countNewContacts($xml, $existingUuidSet);
        $remaining = $this->entitlementService->remainingQuota($user, 'contacts');

        if ($newCount > 0 && 0 === $remaining) {
            // Quota fully exhausted — reject the entire import
            return new XmlImportResult(imported: 0, skipped: $newCount, reason: 'quota_exceeded');
        }

        // allowedNew = how many new contacts we can create; PHP_INT_MAX means unlimited
        $allowedNew = PHP_INT_MAX === $remaining ? PHP_INT_MAX : $remaining;

        // Phase 1: Import Groups
        foreach ($xml->groups->group as $groupNode) {
            // @var \SimpleXMLElement $groupNode
            $this->importGroup($groupNode, $user);
        }
        $this->entityManager->flush();

        // Phase 2: Import Contacts (Base)
        $contactsMap = []; // Map UUID string -> Contact Entity
        $importedCount = 0;
        $newImported = 0;
        $skippedContacts = [];

        foreach ($xml->contacts->contact as $contactNode) {
            if ($importedCount >= $this->importLimit) {
                break;
            }

            // @var \SimpleXMLElement $contactNode
            $uuid = (string) $contactNode->uuid;
            $isExisting = '' !== $uuid && isset($existingUuidSet[$uuid]);

            if (!$isExisting && $newImported >= $allowedNew) {
                // This is a new contact but quota is exhausted — collect for the response
                $skippedContacts[] = $this->extractContactSummary($contactNode);
                continue;
            }

            $contact = $this->importContactBase($contactNode, $user);

            if (!$isExisting) {
                ++$newImported;
            }

            $contactUuid = $contact->getUuid()?->toRfc4122();
            if (null !== $contactUuid) {
                $contactsMap[$contactUuid] = $contact;
            }
            ++$importedCount;
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

        $skipped = count($skippedContacts);
        if ($skipped > 0) {
            return new XmlImportResult(
                imported: $importedCount,
                skipped: $skipped,
                reason: 'quota_exceeded',
                skippedContacts: $skippedContacts,
            );
        }

        return new XmlImportResult(imported: $importedCount, skipped: 0);
    }

    /**
     * Builds a set (key→true map) of UUIDs that already exist in DB for this user.
     *
     * @return array<string, bool>
     */
    private function buildExistingUuidSet(\SimpleXMLElement $xml, User $user): array
    {
        $xmlUuids = [];
        foreach ($xml->contacts->contact as $contactNode) {
            $uuid = (string) $contactNode->uuid;
            if ('' !== $uuid) {
                $xmlUuids[] = $uuid;
            }
        }

        if ([] === $xmlUuids) {
            return [];
        }

        $existingUuids = $this->contactRepository->findExistingUuids($xmlUuids, $user);

        return array_fill_keys($existingUuids, true);
    }

    /**
     * Counts contact nodes in XML that would create NEW contacts (UUID absent or not in DB).
     *
     * @param array<string, bool> $existingUuidSet
     */
    private function countNewContacts(\SimpleXMLElement $xml, array $existingUuidSet): int
    {
        $newCount = 0;
        foreach ($xml->contacts->contact as $contactNode) {
            $uuid = (string) $contactNode->uuid;
            if ('' === $uuid || !isset($existingUuidSet[$uuid])) {
                ++$newCount;
            }
        }

        return $newCount;
    }

    /**
     * Extracts a human-readable name+email summary from a contact XML node.
     * Used for the skippedContacts list in 207 responses.
     *
     * @return array{name: string, email: string}
     */
    private function extractContactSummary(\SimpleXMLElement $contactNode): array
    {
        $name = '';
        $email = '';

        // contactNames structure: <contactNames> contains child elements.
        // - Flat/Export format: each child IS the record (<contactName><given/><family/></contactName>)
        // - Standard format: each child is a container with <item> sub-records
        foreach ($contactNode->contactNames as $container) {
            if (isset($container->item) && $container->item->count() > 0) {
                // Standard format: container has <item> children
                foreach ($container->item as $item) {
                    $g = (string) ($item->given ?? '');
                    $f = (string) ($item->family ?? '');
                    $candidate = trim($g . ' ' . $f);
                    if ('' !== $candidate) {
                        $name = $candidate;
                        break;
                    }
                }
            } elseif ($container->count() > 0) {
                // Flat format: iterate direct children (each is a name record)
                /** @psalm-suppress PossiblyNullIterator SimpleXMLElement::children() is never null in practice */
                foreach ($container->children() as $nameRecord) {
                    $g = (string) ($nameRecord->given ?? '');
                    $f = (string) ($nameRecord->family ?? '');
                    $candidate = trim($g . ' ' . $f);
                    if ('' !== $candidate) {
                        $name = $candidate;
                        break;
                    }
                }
            }
            if ('' !== $name) {
                break;
            }
        }

        foreach ($contactNode->contactEmailAdresses as $container) {
            if (isset($container->item) && $container->item->count() > 0) {
                foreach ($container->item as $item) {
                    $v = (string) ($item->value ?? '');
                    if ('' !== $v) {
                        $email = $v;
                        break;
                    }
                }
            } elseif ($container->count() > 0) {
                /** @psalm-suppress PossiblyNullIterator SimpleXMLElement::children() is never null in practice */
                foreach ($container->children() as $emailRecord) {
                    $v = (string) ($emailRecord->value ?? '');
                    if ('' !== $v) {
                        $email = $v;
                        break;
                    }
                }
            }
            if ('' !== $email) {
                break;
            }
        }

        return ['name' => $name, 'email' => $email];
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
        /**
         * @param \SimpleXMLElement|iterable $nodes
         *
         * @return array<int, array<string, string>>
         */
        $toItems = function ($nodes): array {
            $items = [];
            foreach ($nodes as $node) {
                // If the node has <item> children, it's a container (Legacy/Standard KeyValue format)
                if (isset($node->item) && count($node->item) > 0) {
                    foreach ($node->item as $child) {
                        $row = [];
                        foreach ($child->children() as $prop) {
                            $row[$prop->getName()] = (string) $prop;
                        }
                        $items[] = $row;
                    }
                } elseif ($node->count() > 0) {
                    // Otherwise, the node itself is the item (Flat/Export format)
                    $row = [];
                    foreach ($node->children() as $prop) {
                        $row[$prop->getName()] = (string) $prop;
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
            fn (array $d) => (new ContactName($contact))->setGiven($d['given'] ?? '')->setFamily($d['family'] ?? ''),
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
            },
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
            fn (array $d) => (new ContactEmailAdress($contact))->setValue($d['value'] ?? '')->setType($d['type'] ?? ''),
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
            fn (array $d) => (new ContactPhoneNumber($contact))->setValue($d['value'] ?? '')->setType($d['type'] ?? ''),
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
            },
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
            },
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
            fn (array $d) => (new ContactBiography($contact))->setValue($d['value'] ?? '')->setType($d['type'] ?? ''),
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
            },
        );

        return $contact;
    }

    /**
     * @param array<string, Contact> $contactsMap
     */
    private function importContactRelations(\SimpleXMLElement $node, Contact $contact, array $contactsMap): void
    {
        // Helpers - duplicate for scope or move to method
        /**
         * @param \SimpleXMLElement|iterable $nodes
         *
         * @return array<int, array<string, string>>
         */
        $toItems = function ($nodes): array {
            $items = [];
            foreach ($nodes as $node) {
                // If the node has <item> children, it's a container (Legacy/Standard KeyValue format)
                if (isset($node->item) && count($node->item) > 0) {
                    foreach ($node->item as $child) {
                        $row = [];
                        foreach ($child->children() as $prop) {
                            $row[$prop->getName()] = (string) $prop;
                        }
                        $items[] = $row;
                    }
                } elseif ($node->count() > 0) {
                    // Otherwise, the node itself is the item (Flat/Export format)
                    $row = [];
                    foreach ($node->children() as $prop) {
                        $row[$prop->getName()] = (string) $prop;
                    }
                    $items[] = $row;
                }
            }

            return $items;
        };

        $parsedItems = $toItems($node->contactRelations);

        // Deduplicate: Filter out relations if the inverse already exists
        $filteredItems = [];
        foreach ($parsedItems as $item) {
            $uuid = $item['personUuid'] ?? '';
            $type = $item['type'] ?? '';

            if (isset($contactsMap[$uuid])) {
                $relatedContact = $contactsMap[$uuid];
                $isDuplicate = false;

                $meUuid = $contact->getUuid()?->toRfc4122();

                // Check if related contact has a relation to me ($contact)
                foreach ($relatedContact->getContactRelationsCollection() as $existingRelation) {
                    $existingPerson = $existingRelation->getPerson();
                    $existingPersonUuid = $existingPerson?->getUuid()?->toRfc4122();
                    $existingType = $existingRelation->getType() ?? '';

                    if ($existingPerson === $contact || $existingPersonUuid === $meUuid) {
                        // Check type compatibility
                        $expectedInverseType = $contact->invertRelationType($type, $relatedContact);

                        // Compare case-insensitively
                        if (mb_strtolower($existingType) === mb_strtolower($expectedInverseType)) {
                            $isDuplicate = true;
                            break;
                        }
                    }
                }

                if ($isDuplicate) {
                    continue;
                }
            }
            $filteredItems[] = $item;
        }

        $this->syncCollection(
            $contact->getContactRelationsCollection(),
            $filteredItems,
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
            },
        );
    }
}
