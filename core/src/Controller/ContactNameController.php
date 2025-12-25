<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Entity\ContactName;
use App\Entity\User;
use App\Form\ContactNameType;
use App\Repository\ContactNameRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/contact/name')]
final class ContactNameController extends AbstractController
{
    #[Route(name: 'app_contact_name_index', methods: ['GET'])]
    public function index(ContactNameRepository $contactNameRepository): Response
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $contactNames = $contactNameRepository->findByUser($user);
        } else {
            $contactNames = [];
        }

        return $this->render('contact_name/index.html.twig', [
            'contact_names' => $contactNames,
        ]);
    }

    #[Route('/new/{contact<\d+>}', name: 'app_contact_name_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, Contact $contact): Response
    {
        $contactName = new ContactName($contact);
        $form = $this->createForm(ContactNameType::class, $contactName);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($contactName);
            $entityManager->flush();

            return $this->redirectToRoute('app_contact_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('contact_name/new.html.twig', [
            'contact_name' => $contactName,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_contact_name_show', methods: ['GET'])]
    #[IsGranted('CONTACT_VIEW', 'contactName')]
    public function show(ContactName $contactName): Response
    {
        return $this->render('contact_name/show.html.twig', [
            'contact_name' => $contactName,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_contact_name_edit', methods: ['GET', 'POST'])]
    #[IsGranted('CONTACT_EDIT', 'contactName')]
    public function edit(Request $request, ContactName $contactName, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ContactNameType::class, $contactName);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_contact_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('contact_name/edit.html.twig', [
            'contact_name' => $contactName,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_contact_name_delete', methods: ['POST'])]
    #[IsGranted('CONTACT_EDIT', 'contactName')]
    public function delete(Request $request, ContactName $contactName, EntityManagerInterface $entityManager): Response
    {
        $tokenId = 'delete' . (string) $contactName->getId();
        if ($this->isCsrfTokenValid($tokenId, $request->getPayload()->getString('_token'))) {
            $entityManager->remove($contactName);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_contact_index', [], Response::HTTP_SEE_OTHER);
    }
}
