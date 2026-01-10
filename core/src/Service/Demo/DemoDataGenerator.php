<?php

namespace App\Service\Demo;

class DemoDataGenerator
{
    private const SURNAMES = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
        'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
        'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    ];

    private const FIRST_NAMES_MALE = [
        'James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher',
        'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
    ];

    private const FIRST_NAMES_FEMALE = [
        'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
        'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
    ];

    private const COMPANIES = [
        'TechNova Solutions', 'Global Green Logistics', 'BlueSky Innovations', 'Apex Financial', 'Pinnacle Systems',
        'Lumina Marketing', 'Swift Retail Corp', 'Infinite Horizons', 'Summit Healthcare', 'Nexus Enterprises',
        'Vanguard Media', 'Quantum Leap Tech', 'Starlight Hospitality', 'Ironclad Security', 'Flow Dynamics',
    ];

    private const DEPARTMENTS = [
        'Engineering', 'Sales', 'Marketing', 'Human Resources', 'Finance', 'Legal', 'Product Management', 'Customer Success',
    ];

    private const TITLES = [
        'Software Engineer', 'Sales Executive', 'Marketing Manager', 'HR Specialist', 'Accountant', 'Legal Counsel', 'Product Owner', 'Success Lead',
        'Senior Engineer', 'Director of Sales', 'CMO', 'Head of HR', 'CFO', 'VP of Product',
    ];

    private const CITIES = [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
    ];

    private const STREETS = [
        'Maple Avenue', 'Oak Street', 'Washington Boulevard', 'Lakeview Drive', 'Park Place', 'Broadway', 'Main Street', 'Highland Avenue',
    ];

    // Pastel / Softer colors
    private const COLORS = [
        '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E2F0CB', '#F1E3F3', '#CBAACB',
        '#FFC8A2', '#D4F0F0', '#ECC5C0', '#B0C2F2', '#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8',
    ];

    private const PHONE_TYPES = ['Mobile', 'Home', 'Work'];
    private const EMAIL_TYPES = ['Home', 'Work', 'Other'];

    private const NOTIFICATION_TITLES = [
        'New Message',
    ];

    private const NOTIFICATION_MESSAGES = [
        'Wish John a Happy Birthday!',
        'It is Sarah\'s wedding anniversary today.',
        'Don\'t forget Michael\'s birthday next week.',
        'Reminder: Wedding anniversary for the Smiths.',
        'Upcoming birthday: Emily.',
    ];

    public function getRandomSurname(): string
    {
        return self::SURNAMES[array_rand(self::SURNAMES)];
    }

    public function getRandomFirstName(?string $gender = null): string
    {
        if ($gender === 'male') {
            return self::FIRST_NAMES_MALE[array_rand(self::FIRST_NAMES_MALE)];
        }
        if ($gender === 'female') {
            return self::FIRST_NAMES_FEMALE[array_rand(self::FIRST_NAMES_FEMALE)];
        }
        $all = array_merge(self::FIRST_NAMES_MALE, self::FIRST_NAMES_FEMALE);
        return $all[array_rand($all)];
    }

    public function getRandomCompany(): string
    {
        return self::COMPANIES[array_rand(self::COMPANIES)];
    }

    public function getRandomDepartment(): string
    {
        return self::DEPARTMENTS[array_rand(self::DEPARTMENTS)];
    }

    public function getRandomTitle(): string
    {
        return self::TITLES[array_rand(self::TITLES)];
    }

    public function getRandomCity(): string
    {
        return self::CITIES[array_rand(self::CITIES)];
    }

    public function getRandomStreet(): string
    {
        return self::STREETS[array_rand(self::STREETS)];
    }

    public function getRandomPhone(): string
    {
        return '+1-' . rand(200, 999) . '-' . rand(200, 999) . '-' . rand(1000, 9999);
    }

    public function getRandomPhoneType(): string
    {
        return self::PHONE_TYPES[array_rand(self::PHONE_TYPES)];
    }

    public function getRandomEmail(string $firstName, string $lastName): string
    {
        $domains = ['example.com', 'gmail.com', 'outlook.com', 'yahoo.com'];
        return strtolower($firstName . '.' . $lastName . '@' . $domains[array_rand($domains)]);
    }

    public function getRandomEmailType(): string
    {
        return self::EMAIL_TYPES[array_rand(self::EMAIL_TYPES)];
    }

    public function getRandomColor(): string
    {
        return self::COLORS[array_rand(self::COLORS)];
    }

    public function getRandomNotificationTitle(): string
    {
        return self::NOTIFICATION_TITLES[array_rand(self::NOTIFICATION_TITLES)];
    }

    public function getRandomNotificationMessage(): string
    {
        return self::NOTIFICATION_MESSAGES[array_rand(self::NOTIFICATION_MESSAGES)];
    }

    public function getRandomDate(\DateTime $min, \DateTime $max): \DateTime
    {
        $timestamp = rand($min->getTimestamp(), $max->getTimestamp());
        $dt = new \DateTime();
        $dt->setTimestamp($timestamp);
        return $dt;
    }
}
