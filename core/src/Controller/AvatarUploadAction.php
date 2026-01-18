<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Service\AvatarManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
class AvatarUploadAction extends AbstractController
{
    public function __construct(
        private AvatarManager $avatarManager,
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
    ) {
    }

    public function __invoke(Contact $data, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('CONTACT_EDIT', $data);

        $file = $request->files->get('file');

        if (null === $file) {
            throw new BadRequestHttpException('"file" is required');
        }

        $avatar = $this->avatarManager->upload($data, $file);

        $this->entityManager->persist($avatar);
        $this->entityManager->flush();

        $json = $this->serializer->serialize($avatar, 'json', ['groups' => ['contact_avatar:read']]);

        return new JsonResponse($json, 201, [], true);
    }
}
