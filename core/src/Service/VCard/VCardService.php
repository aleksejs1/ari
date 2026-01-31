<?php

namespace Ari\Service\VCard;

use Ari\Entity\Contact;
use Sabre\VObject\Component\VCard;

class VCardService
{
    public function generateVCard(Contact $contact): string
    {
        $vcard = new VCard([
            'VERSION' => '4.0',
        ]);

        // FN is mandatory in vCard 4.0
        $vcard->add('FN', $contact->getDisplayName());

        // Names
        foreach ($contact->getContactNames() as $contactName) {
            $vcard->add('N', [
                $contactName->getFamily() ?? '',
                $contactName->getGiven() ?? '',
                '', // Additional names
                '', // Prefixes
                '', // Suffixes
            ]);
        }

        // Phone numbers
        foreach ($contact->getPhoneNumbers() as $phone) {
            $type = $phone->getType();
            $params = [];
            if (null !== $type && '' !== $type) {
                $params['TYPE'] = $this->mapType($type);
            }
            $vcard->add('TEL', $phone->getValue() ?? '', $params);
        }

        // Emails
        foreach ($contact->getContactEmailAdresses() as $email) {
            $type = $email->getType();
            $params = [];
            if (null !== $type && '' !== $type) {
                $params['TYPE'] = $this->mapType($type);
            }
            $vcard->add('EMAIL', $email->getValue() ?? '', $params);
        }

        // Addresses
        foreach ($contact->getContactAddresses() as $address) {
            $type = $address->getType();
            $params = [];
            if (null !== $type && '' !== $type) {
                $params['TYPE'] = $this->mapType($type);
            }
            $vcard->add('ADR', [
                '', // P.O. Box (deprecated or not used here)
                $address->getStreetExtended() ?? '', // Extended Address
                $address->getStreet() ?? '', // Street Address
                $address->getCity() ?? '', // Locality
                $address->getRegion() ?? '', // Region
                $address->getPostalCode() ?? '', // Postal Code
                $address->getCountry() ?? '', // Country Name
            ], $params);
        }

        // Organizations
        foreach ($contact->getContactOrganizations() as $org) {
            $orgName = $org->getName();
            if (null !== $orgName && '' !== $orgName) {
                $vcard->add('ORG', [
                    $orgName,
                    $org->getDepartment() ?? '',
                ]);
            }
            $title = $org->getTitle();
            if (null !== $title && '' !== $title) {
                $vcard->add('TITLE', $title);
            }
        }

        // Biographies (Notes)
        foreach ($contact->getContactBiographies() as $bio) {
            $bioValue = $bio->getValue();
            if (null !== $bioValue && '' !== $bioValue) {
                $vcard->add('NOTE', $bioValue);
            }
        }

        // Dates
        foreach ($contact->getContactDates() as $date) {
            $dateValue = $date->getDate();
            if (null !== $dateValue) {
                $isBirthday = false;
                $dateText = $date->getText();
                if (null !== $dateText && '' !== $dateText && false !== stripos($dateText, 'birthday')) {
                    $isBirthday = true;
                }

                if ($isBirthday) {
                    $vcard->add('BDAY', $dateValue->format('Ymd'));
                } else {
                    // Custom anniversary or other dates
                    $label = (null !== $dateText && '' !== $dateText) ? $dateText : 'Anniversary';
                    $vcard->add('ANNIVERSARY', $dateValue->format('Ymd'), [
                        'X-LABEL' => $label,
                    ]);
                }
            }
        }

        return $vcard->serialize();
    }

    private function mapType(string $type): string
    {
        $type = strtolower($type);

        return match ($type) {
            'home' => 'home',
            'work' => 'work',
            'mobile', 'cell' => 'cell',
            'fax' => 'fax',
            'pager' => 'pager',
            default => $type,
        };
    }
}
