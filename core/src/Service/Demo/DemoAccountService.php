<?php

namespace App\Service\Demo;

use App\Entity\ActivityFeed;
use App\Entity\Contact;
use App\Entity\ContactAddress;
use App\Entity\ContactDate;
use App\Entity\ContactEmailAdress;
use App\Entity\ContactGroup;
use App\Entity\ContactName;
use App\Entity\ContactOrganization;
use App\Entity\ContactPhoneNumber;
use App\Entity\ContactRelation;
use App\Entity\Group;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Uid\Uuid;

class DemoAccountService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private DemoDataGenerator $generator,
    ) {
    }

    public function generateDemoAccount(): User
    {
        $user = new User();
        $user->setUuid((string) Uuid::v7());
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, 'demo'));

        $this->entityManager->persist($user);

        // Create Groups
        $groups = [];
        $groupNames = ['Family', 'Friends', 'Colleagues', 'Classmates', 'Neighbors'];
        foreach ($groupNames as $name) {
            $group = new Group();
            $group->setName($name);
            $group->setColor($this->generator->getRandomColor());
            $group->setUser($user);
            $this->entityManager->persist($group);
            $groups[$name] = $group;
        }

        // Generate Contacts
        $contacts = [];
        $surnamePool = [];
        for ($i = 0; $i < 5; ++$i) {
            $surnamePool[] = $this->generator->getRandomSurname();
        }

        $organizationPool = [];
        for ($i = 0; $i < 3; ++$i) {
            $organizationPool[] = $this->generator->getRandomCompany();
        }

        for ($i = 0; $i < 70; ++$i) {
            $contact = new Contact();
            $contact->setUser($user);

            // 70% fill rate for most components
            $fill = (rand(1, 100) <= 70);

            // Name (Required for good demo)
            $name = new ContactName($contact);
            $gender = (0 === rand(0, 1) ? 'male' : 'female');
            $name->setGiven($this->generator->getRandomFirstName($gender));
            // Use surname pool for families
            $surname = (rand(1, 10) <= 4) ? $surnamePool[array_rand($surnamePool)] : $this->generator->getRandomSurname();
            $name->setFamily($surname);
            $this->entityManager->persist($name);

            // Groups
            if ($fill) {
                $group = $groups[array_rand($groups)];
                $cg = new ContactGroup($contact);
                $cg->setGroupResource($group);
                $this->entityManager->persist($cg);
            }

            // Organization
            if ($fill || rand(1, 10) <= 3) {
                $org = new ContactOrganization($contact);
                $org->setName(rand(1, 10) <= 6 ? $organizationPool[array_rand($organizationPool)] : $this->generator->getRandomCompany());
                $org->setTitle($this->generator->getRandomTitle());
                $org->setDepartment($this->generator->getRandomDepartment());

                // Work start date for colleagues
                if ($org->getName() === $organizationPool[0] || rand(1, 10) <= 3) {
                    $startDate = $this->generator->getRandomDate(new \DateTime('-10 years'), new \DateTime('-1 month'));
                    $org->setStartDate($startDate);
                }
                $this->entityManager->persist($org);
            }

            // Phone & Email Mix Logic
            $hasPhone = (rand(1, 10) <= 8); // 80% have at least one phone
            $hasEmail = (rand(1, 10) <= 8); // 80% have email

            // Birthday (User requested birthdays first, then wedding dates)
            if ($fill || rand(1, 10) <= 5) {
                $birthday = new ContactDate($contact);
                $birthday->setText('Birthday');
                // Age is between 20 and 70
                $age = rand(20, 70);
                // Random day within the year
                $birthDate = new \DateTime('-' . $age . ' years');
                $days = rand(0, 364);
                $birthDate->modify('+' . $days . ' days');
                $birthday->setDate($birthDate);
                $this->entityManager->persist($birthday);
            }

            if ($hasPhone) {
                $phone = new ContactPhoneNumber($contact);
                $phone->setValue($this->generator->getRandomPhone());
                $phone->setType($this->generator->getRandomPhoneType());
                $this->entityManager->persist($phone);

                // 20% chance for a second phone
                if (rand(1, 10) <= 2) {
                    $phone2 = new ContactPhoneNumber($contact);
                    $phone2->setValue($this->generator->getRandomPhone());
                    $phone2->setType($this->generator->getRandomPhoneType());
                    $this->entityManager->persist($phone2);
                }
            }

            if ($hasEmail) {
                $email = new ContactEmailAdress($contact);
                $email->setValue($this->generator->getRandomEmail((string) $name->getGiven(), (string) $name->getFamily()));
                $email->setType($this->generator->getRandomEmailType());
                $this->entityManager->persist($email);
            }

            // Address
            if ($fill) {
                $address = new ContactAddress($contact);
                $address->setCity($this->generator->getRandomCity());
                $address->setStreet($this->generator->getRandomStreet());
                $address->setType('home');
                $this->entityManager->persist($address);
            }

            $this->entityManager->persist($contact);
            $contacts[] = [
                'entity' => $contact,
                'surname' => $surname,
                'given' => (string) $name->getGiven(),
                'gender' => $gender,
                'age' => $age ?? rand(20, 70),
            ];
        }

        // Family Logic & Relations
        $this->processFamilies($contacts, $groups['Family']);

        $this->entityManager->flush();

        // Fake Notifications (10 read, 2 unread)
        for ($i = 0; $i < 12; ++$i) {
            $notification = new ActivityFeed();
            $notification->setTenant($user);
            $notification->setUserId((int) $user->getId());
            $notification->setTitle('New Message');
            $notification->setMessage($this->generator->getRandomNotificationMessage());
            $notification->setEventType('demo');
            // 2 newest (i=0, 1) are Unread (isRead=false). Older (i>=2) are Read (isRead=true).
            $notification->setRead($i >= 2);
            $notification->setCreatedAt(new \DateTime('-' . ($i + 1) . ' hours'));
            $this->entityManager->persist($notification);
        }

        $this->entityManager->flush();

        return $user;
    }

    /**
     * @param array<int, array{entity: Contact, surname: string, given: string, gender: string, age: int}> $contacts
     */
    private function processFamilies(array $contacts, Group $familyGroup): void
    {
        // Group by surname
        $bySurname = [];
        foreach ($contacts as $c) {
            $bySurname[$c['surname']][] = $c;
        }

        foreach ($bySurname as $members) {
            if (count($members) < 2) {
                continue;
            }

            // Pick a "Head of family" (Parent 1)
            $parent1 = $members[0];
            $parent1['age'] = rand(45, 65);

            // Try to find a spouse (Parent 2)
            $parent2 = null;
            if (isset($members[1])) {
                $parent2 = $members[1];
                $parent2['age'] = $parent1['age'] + rand(-5, 5);

                // Relation: Spouse
                $rel = new ContactRelation($parent1['entity']);
                $rel->setPerson($parent2['entity']);
                $rel->setType('Spouse');
                $this->entityManager->persist($rel);

                // Wedding Date
                $wedding = new ContactDate($parent1['entity']);
                $wedding->setText('Wedding Anniversary');
                $wedding->setDate($this->generator->getRandomDate(new \DateTime('-40 years'), new \DateTime('-20 years')));
                $this->entityManager->persist($wedding);

                // Also add wedding to second parent
                $wedding2 = new ContactDate($parent2['entity']);
                $wedding2->setText('Wedding Anniversary');
                $wedding2->setDate($wedding->getDate());
                $this->entityManager->persist($wedding2);
            }

            // Rest are children (if any)
            for ($i = 2; $i < count($members); ++$i) {
                $child = $members[$i];
                $child['age'] = $parent1['age'] - rand(22, 35);
                // age is always >= 10 here based on parent age (45-65) - (22-35)

                // Relation: Parent -> Child
                $rel = new ContactRelation($parent1['entity']);
                $rel->setPerson($child['entity']);
                $rel->setType('Child');
                $this->entityManager->persist($rel);

                if (null !== $parent2) {
                    $rel2 = new ContactRelation($parent2['entity']);
                    $rel2->setPerson($child['entity']);
                    $rel2->setType('Child');
                    $this->entityManager->persist($rel2);
                }

                // Relation: Child -> Parent
                $rel3 = new ContactRelation($child['entity']);
                $rel3->setPerson($parent1['entity']);
                $rel3->setType('Parent');
                $this->entityManager->persist($rel3);
            }

            // Ensure they are in Family group
            foreach ($members as $m) {
                $hasGroup = false;
                foreach ($m['entity']->getContactGroups() as $cg) {
                    if ($cg->getGroupResource() === $familyGroup) {
                        $hasGroup = true;
                        break;
                    }
                }
                if (!$hasGroup) {
                    $cg = new ContactGroup($m['entity']);
                    $cg->setGroupResource($familyGroup);
                    $this->entityManager->persist($cg);
                }
            }
        }
    }
}
