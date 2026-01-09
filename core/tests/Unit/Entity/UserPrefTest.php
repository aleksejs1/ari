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
        // Valid 'ru'
        $pref = new UserPref();
        $pref->setType(UserPref::TYPE_LANGUAGE);
        $pref->setValue('ru');

        $context = $this->createMock(ExecutionContextInterface::class);
        $context->expects($this->never())->method('buildViolation');
        $pref->validateValue($context);

        // Valid 'en'
        $pref2 = new UserPref();
        $pref2->setType(UserPref::TYPE_LANGUAGE);
        $pref2->setValue('en');

        $context2 = $this->createMock(ExecutionContextInterface::class);
        $context2->expects($this->never())->method('buildViolation');
        $pref2->validateValue($context2);

        // Invalid 'de'
        $pref3 = new UserPref();
        $pref3->setType(UserPref::TYPE_LANGUAGE);
        $pref3->setValue('de');

        $context3 = $this->createMock(ExecutionContextInterface::class);
        $builder = $this->createMock(ConstraintViolationBuilderInterface::class);

        $context3->expects($this->once())->method('buildViolation')->with('Invalid language')->willReturn($builder);
        $builder->expects($this->once())->method('atPath')->with('value')->willReturn($builder);
        $builder->expects($this->once())->method('addViolation');

        $pref3->validateValue($context3);
    }

    public function testValidationDateFormat(): void
    {
        // Valid 'mm/dd/yyyy'
        $pref = new UserPref();
        $pref->setType(UserPref::TYPE_DATE_FORMAT);
        $pref->setValue('mm/dd/yyyy');

        $context = $this->createMock(ExecutionContextInterface::class);
        $context->expects($this->never())->method('buildViolation');
        $pref->validateValue($context);

        // Valid 'dd.mm.yyyy'
        $pref2 = new UserPref();
        $pref2->setType(UserPref::TYPE_DATE_FORMAT);
        $pref2->setValue('dd.mm.yyyy');

        $context2 = $this->createMock(ExecutionContextInterface::class);
        $context2->expects($this->never())->method('buildViolation');
        $pref2->validateValue($context2);

        // Invalid 'yyyy-mm-dd'
        $pref3 = new UserPref();
        $pref3->setType(UserPref::TYPE_DATE_FORMAT);
        $pref3->setValue('yyyy-mm-dd');

        $context3 = $this->createMock(ExecutionContextInterface::class);
        $builder = $this->createMock(ConstraintViolationBuilderInterface::class);

        $context3->expects($this->once())->method('buildViolation')->with('Invalid date format')->willReturn($builder);
        $builder->expects($this->once())->method('atPath')->with('value')->willReturn($builder);
        $builder->expects($this->once())->method('addViolation');

        $pref3->validateValue($context3);
    }

    public function testValidationTimeFormat(): void
    {
        // Valid '24h'
        $pref = new UserPref();
        $pref->setType(UserPref::TYPE_TIME_FORMAT);
        $pref->setValue('24h');

        $context = $this->createMock(ExecutionContextInterface::class);
        $context->expects($this->never())->method('buildViolation');
        $pref->validateValue($context);

        // Valid '12h'
        $pref2 = new UserPref();
        $pref2->setType(UserPref::TYPE_TIME_FORMAT);
        $pref2->setValue('12h');

        $context2 = $this->createMock(ExecutionContextInterface::class);
        $context2->expects($this->never())->method('buildViolation');
        $pref2->validateValue($context2);

        // Invalid '48h'
        $pref3 = new UserPref();
        $pref3->setType(UserPref::TYPE_TIME_FORMAT);
        $pref3->setValue('48h');

        $context3 = $this->createMock(ExecutionContextInterface::class);
        $builder = $this->createMock(ConstraintViolationBuilderInterface::class);

        $context3->expects($this->once())->method('buildViolation')->with('Invalid time format')->willReturn($builder);
        $builder->expects($this->once())->method('atPath')->with('value')->willReturn($builder);
        $builder->expects($this->once())->method('addViolation');

        $pref3->validateValue($context3);
    }

    public function testValidationFavouriteGroupName(): void
    {
        // Valid 'Custom Name'
        $pref = new UserPref();
        $pref->setType(UserPref::TYPE_FAVOURITE_GROUP_NAME);
        $pref->setValue('Custom Name');

        $context = $this->createMock(ExecutionContextInterface::class);
        $context->expects($this->never())->method('buildViolation');
        $pref->validateValue($context);

        // Valid 'Another Name'
        $pref2 = new UserPref();
        $pref2->setType(UserPref::TYPE_FAVOURITE_GROUP_NAME);
        $pref2->setValue('Another Name');

        $context2 = $this->createMock(ExecutionContextInterface::class);
        $context2->expects($this->never())->method('buildViolation');
        $pref2->validateValue($context2);
    }
    public function testValidationGoogleSyncOnUpdate(): void
    {
        // Valid '0'
        $pref = new UserPref();
        $pref->setType(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE);
        $pref->setValue('0');

        $context = $this->createMock(ExecutionContextInterface::class);
        $context->expects($this->never())->method('buildViolation');
        $pref->validateValue($context);

        // Valid '1'
        $pref2 = new UserPref();
        $pref2->setType(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE);
        $pref2->setValue('1');

        $context2 = $this->createMock(ExecutionContextInterface::class);
        $context2->expects($this->never())->method('buildViolation');
        $pref2->validateValue($context2);

        // Invalid 'true'
        $pref3 = new UserPref();
        $pref3->setType(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE);
        $pref3->setValue('true');

        $context3 = $this->createMock(ExecutionContextInterface::class);
        $builder = $this->createMock(ConstraintViolationBuilderInterface::class);

        $context3->expects($this->once())->method('buildViolation')
            ->with('Invalid value for googleSyncOnUpdate. Must be "0" or "1".')
            ->willReturn($builder);
        $builder->expects($this->once())->method('atPath')->with('value')->willReturn($builder);
        $builder->expects($this->once())->method('addViolation');

        $pref3->validateValue($context3);
    }
}
