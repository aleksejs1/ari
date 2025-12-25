<?php

namespace App\Form;

use App\Entity\Contact;
use App\Entity\ContactName;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * @extends AbstractType<ContactName>
 */
class ContactNameType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('family')
            ->add('given')
            ->add('contact', EntityType::class, [
                'class' => Contact::class,
                'choice_label' => 'id',
                'disabled' => true,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ContactName::class,
        ]);
    }
}
