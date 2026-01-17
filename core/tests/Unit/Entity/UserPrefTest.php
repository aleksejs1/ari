<?php

namespace App\Tests\Unit\Entity;

use App\Entity\UserPref;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use Symfony\Component\Validator\Violation\ConstraintViolationBuilderInterface;

class UserPrefTest extends TestCase
{
    public function testConstants(): void
    {
        self::assertEquals('language', UserPref::TYPE_LANGUAGE);
        self::assertEquals('dateFormat', UserPref::TYPE_DATE_FORMAT);
        self::assertEquals('favourite_group_name', UserPref::TYPE_FAVOURITE_GROUP_NAME);
        self::assertEquals('googleSyncOnUpdate', UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE);
        self::assertContains(UserPref::TYPE_LANGUAGE, UserPref::ALLOWED_TYPES);
        self::assertContains(UserPref::TYPE_DATE_FORMAT, UserPref::ALLOWED_TYPES);
        self::assertContains(UserPref::TYPE_FAVOURITE_GROUP_NAME, UserPref::ALLOWED_TYPES);
        self::assertContains(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE, UserPref::ALLOWED_TYPES);
        self::assertEquals('en', UserPref::DEFAULTS[UserPref::TYPE_LANGUAGE]);
        self::assertEquals('mm/dd/yyyy', UserPref::DEFAULTS[UserPref::TYPE_DATE_FORMAT]);
        self::assertEquals('24h', UserPref::DEFAULTS[UserPref::TYPE_TIME_FORMAT]);
        self::assertEquals('favourite', UserPref::DEFAULTS[UserPref::TYPE_FAVOURITE_GROUP_NAME]);
        self::assertEquals('0', UserPref::DEFAULTS[UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE]);
    }

    public function testGettersSetters(): void
    {
        $pref = new UserPref();
        $pref->setType('language');
        $pref->setValue('ru');

        self::assertEquals('language', $pref->getType());
        self::assertEquals('ru', $pref->getValue());
    }

    public function testValidationLanguage(): void
    {
        $this->assertValidationSuccess(UserPref::TYPE_LANGUAGE, 'ru');
        $this->assertValidationSuccess(UserPref::TYPE_LANGUAGE, 'en');
        $this->assertValidationFailure(UserPref::TYPE_LANGUAGE, 'de', 'Invalid language');
    }

    public function testValidationDateFormat(): void
    {
        $this->assertValidationSuccess(UserPref::TYPE_DATE_FORMAT, 'mm/dd/yyyy');
        $this->assertValidationSuccess(UserPref::TYPE_DATE_FORMAT, 'dd.mm.yyyy');
        $this->assertValidationFailure(UserPref::TYPE_DATE_FORMAT, 'yyyy-mm-dd', 'Invalid date format');
    }

    public function testValidationTimeFormat(): void
    {
        $this->assertValidationSuccess(UserPref::TYPE_TIME_FORMAT, '24h');
        $this->assertValidationSuccess(UserPref::TYPE_TIME_FORMAT, '12h');
        $this->assertValidationFailure(UserPref::TYPE_TIME_FORMAT, '48h', 'Invalid time format');
    }

    public function testValidationFavouriteGroupName(): void
    {
        $this->assertValidationSuccess(UserPref::TYPE_FAVOURITE_GROUP_NAME, 'Custom Name');
        $this->assertValidationSuccess(UserPref::TYPE_FAVOURITE_GROUP_NAME, 'Another Name');
    }

    public function testValidationGoogleSyncOnUpdate(): void
    {
        $this->assertValidationSuccess(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE, '0');
        $this->assertValidationSuccess(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE, '1');
        $this->assertValidationFailure(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE, 'true', 'Invalid value for googleSyncOnUpdate. Must be "0" or "1".');
    }
    
    private function assertValidationSuccess(string $type, string $value): void
    {
        $pref = new UserPref();
        $pref->setType($type);
        $pref->setValue($value);
        
        $violations = [];
        $context = self::createStub(ExecutionContextInterface::class);
        $context->method('buildViolation')->willReturnCallback(function($msg) use (&$violations) {
            $violations[] = $msg;
            return self::createStub(ConstraintViolationBuilderInterface::class);
        });
        
        $pref->validateValue($context);
        
        self::assertEmpty($violations);
    }
    
    private function assertValidationFailure(string $type, string $value, string $expectedMsg): void
    {
        $pref = new UserPref();
        $pref->setType($type);
        $pref->setValue($value);
        
        $violations = [];
        $builder = self::createStub(ConstraintViolationBuilderInterface::class);
        $builder->method('atPath')->willReturn($builder);
        $builder->method('addViolation')->willReturnCallback(function() {}); // just to allow call

        $context = self::createStub(ExecutionContextInterface::class);
        $context->method('buildViolation')->willReturnCallback(function($msg) use (&$violations, $expectedMsg, $builder) {
             if ($msg === $expectedMsg) {
                 $violations[] = $msg;
             }
             return $builder;
        });

        $pref->validateValue($context);
        self::assertCount(1, $violations);
        self::assertEquals($expectedMsg, $violations[0]);
    }
}
