<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\User;
use App\Form\ContactDateType;
use App\Repository\ContactDateRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/contact/date')]
final class ContactDateController extends AbstractController
{
    #[Route(name: 'app_contact_date_index', methods: ['GET'])]
    public function index(ContactDateRepository $contactDateRepository): Response
    {
        $user = $this->getUser();
        if ($user instanceof User) {
            $contactDates = $contactDateRepository->findByUser($user);
        } else {
            $contactDates = [];
        }

        return $this->render('contact_date/index.html.twig', [
            'contact_dates' => $contactDates,
        ]);
    }

    #[Route('/new/{contact<\d+>}', name: 'app_contact_date_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, Contact $contact): Response
    {
        $contactDate = new ContactDate($contact);
        $form = $this->createForm(ContactDateType::class, $contactDate);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($contactDate);
            $entityManager->flush();

            return $this->redirectToRoute('app_contact_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('contact_date/new.html.twig', [
            'contact_date' => $contactDate,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_contact_date_show', methods: ['GET'])]
    #[IsGranted('CONTACT_VIEW', 'contactDate')]
    public function show(ContactDate $contactDate): Response
    {
        return $this->render('contact_date/show.html.twig', [
            'contact_date' => $contactDate,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_contact_date_edit', methods: ['GET', 'POST'])]
    #[IsGranted('CONTACT_EDIT', 'contactDate')]
    public function edit(Request $request, ContactDate $contactDate, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ContactDateType::class, $contactDate);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_contact_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('contact_date/edit.html.twig', [
            'contact_date' => $contactDate,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_contact_date_delete', methods: ['POST'])]
    #[IsGranted('CONTACT_EDIT', 'contactDate')]
    public function delete(Request $request, ContactDate $contactDate, EntityManagerInterface $entityManager): Response
    {
        $tokenId = 'delete' . (string) $contactDate->getId();
        if ($this->isCsrfTokenValid($tokenId, $request->getPayload()->getString('_token'))) {
            $entityManager->remove($contactDate);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_contact_index', [], Response::HTTP_SEE_OTHER);
    }
}
