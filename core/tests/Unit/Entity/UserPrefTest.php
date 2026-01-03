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
        self::assertContains(UserPref::TYPE_LANGUAGE, UserPref::ALLOWED_TYPES);
        self::assertContains(UserPref::TYPE_DATE_FORMAT, UserPref::ALLOWED_TYPES);
        self::assertEquals('en', UserPref::DEFAULTS[UserPref::TYPE_LANGUAGE]);
        self::assertEquals('mm/dd/yyyy', UserPref::DEFAULTS[UserPref::TYPE_DATE_FORMAT]);
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
}
