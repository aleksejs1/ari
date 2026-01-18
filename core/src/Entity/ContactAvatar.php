<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Dto\AvatarUploadInput;
use App\Repository\ContactAvatarRepository;
use App\Security\TenantAwareInterface;
use App\Security\TenantAwareTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: ContactAvatarRepository::class)]
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/contacts/{id}/avatar',
            requirements: ['id' => '\d+'],
            input: AvatarUploadInput::class,
            output: ContactAvatar::class,
            controller: 'App\Controller\AvatarUploadAction',
            openapi: new \ApiPlatform\OpenApi\Model\Operation(
                summary: 'Upload a contact avatar',
                description: 'Upload an image file (JPEG, PNG, WEBP) to be used as a contact avatar.',
            ),
            normalizationContext: ['groups' => ['contact_avatar:read']],
            inputFormats: ['multipart' => ['multipart/form-data']],
        ),
    ],
    security: "is_granted('ROLE_USER')",
)]
class ContactAvatar implements TenantAwareInterface
{
    use TenantAwareTrait;

    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    #[Groups(['contact_avatar:read', 'contact:read'])]
    private ?Ulid $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['contact_avatar:read', 'contact:read'])]
    private ?string $path = null;

    #[ORM\Column(type: Types::BLOB, nullable: true)]
    private mixed $thumbnailData = null;

    #[Groups(['contact_avatar:read', 'contact:read'])]
    public function getThumbnailDataEncoded(): ?string
    {
        if (null === $this->thumbnailData) {
            return null;
        }

        $data = $this->thumbnailData;
        if (is_resource($data)) {
            rewind($data);
            $data = stream_get_contents($data);
        }

        return base64_encode((string) $data);
    }

    #[ORM\Column(length: 100)]
    #[Groups(['contact_avatar:read', 'contact:read'])]
    private ?string $mimeType = null;

    #[ORM\Column]
    #[Groups(['contact_avatar:read', 'contact:read'])]
    private ?int $size = null;

    #[ORM\OneToOne(inversedBy: 'avatar', targetEntity: Contact::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Contact $contact = null;

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): static
    {
        $this->path = $path;

        return $this;
    }

    public function getThumbnailData(): mixed
    {
        return $this->thumbnailData;
    }

    public function setThumbnailData(mixed $thumbnailData): static
    {
        $this->thumbnailData = $thumbnailData;

        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): static
    {
        $this->mimeType = $mimeType;

        return $this;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(int $size): static
    {
        $this->size = $size;

        return $this;
    }

    public function getContact(): ?Contact
    {
        return $this->contact;
    }

    public function setContact(?Contact $contact): static
    {
        $this->contact = $contact;

        return $this;
    }
}
