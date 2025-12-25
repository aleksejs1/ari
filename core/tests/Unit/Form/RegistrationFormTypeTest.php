<?php

namespace App\Tests\Unit\Form;

use App\Entity\User;
use App\Form\RegistrationFormType;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use Symfony\Component\Form\Extension\Validator\ValidatorExtension;
use Symfony\Component\Form\Test\TypeTestCase;
use Symfony\Component\Validator\Validation;

class RegistrationFormTypeTest extends TypeTestCase
{
    #[\Override]
    protected function getExtensions(): array
    {
        $validator = Validation::createValidator();

        return [
            new ValidatorExtension($validator),
        ];
    }

    #[AllowMockObjectsWithoutExpectations]
    public function testSubmitValidData(): void
    {
        $formData = [
            'uuid' => 'test-uuid-123',
            'agreeTerms' => true,
            'plainPassword' => 'password123',
        ];

        $model = new User();
        // $model will modified by the form data mapping (only 'uuid')

        $form = $this->factory->create(RegistrationFormType::class, $model);

        $expected = new User();
        $expected->setUuid('test-uuid-123');

        // submit the data to the form directly
        $form->submit($formData);

        // This check ensures that there are no transformation failures
        self::assertTrue($form->isSynchronized());

        // check that $model was modified as expected
        self::assertEquals($expected->getUuid(), $model->getUuid());

        // check that non-mapped fields are present in the form but not in the model
        self::assertTrue($form->has('agreeTerms'));
        self::assertTrue($form->has('plainPassword'));

        $view = $form->createView();
        $children = $view->children;

        foreach (array_keys($formData) as $key) {
            self::assertArrayHasKey($key, $children);
        }
    }

    #[AllowMockObjectsWithoutExpectations]
    public function testSubmitInvalidData(): void
    {
        $formData = [
            'uuid' => 'test-uuid-123',
            'agreeTerms' => false, // Invalid: must be true
            'plainPassword' => '123', // Invalid: too short
        ];

        $model = new User();
        $form = $this->factory->create(RegistrationFormType::class, $model);

        $form->submit($formData);

        self::assertTrue($form->isSynchronized());
        self::assertFalse($form->isValid());

        self::assertCount(2, $form->getErrors(true));
    }
}
