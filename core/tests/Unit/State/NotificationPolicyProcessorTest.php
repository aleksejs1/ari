<?php

namespace App\Tests\Unit\State;

use ApiPlatform\Metadata\Post;
use App\Dto\NotificationPolicy\NotificationPolicyDto;
use App\Entity\Group;
use App\Entity\NotificationChannel;
use App\Entity\NotificationPolicy;
use App\Entity\NotificationRule;
use App\Entity\User;
use App\Repository\GroupRepository;
use App\Repository\NotificationChannelRepository;
use App\State\NotificationPolicyProcessor;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class NotificationPolicyProcessorTest extends TestCase
{
    public function testProcessCreatesPolicyAndRules(): void
    {
        $em = $this->createMock(EntityManagerInterface::class);
        $tokenStorage = self::createStub(TokenStorageInterface::class);
        $iriConverter = self::createStub(\ApiPlatform\Metadata\IriConverterInterface::class);
        $groupRepo = self::createStub(GroupRepository::class);
        $channelRepo = self::createStub(NotificationChannelRepository::class);

        $processor = new NotificationPolicyProcessor($em, $tokenStorage, $iriConverter);

        // Inputs
        $dto = new NotificationPolicyDto();
        $dto->name = 'Test Policy';
        $dto->targets = ['type' => 'group', 'ids' => [1]];
        $dto->eventTypes = ['birthday'];
        $dto->schedule = [
            ['offsetDays' => -1, 'time' => '10:00', 'channels' => [2]],
        ];

        // Mocks
        $user = new User();
        // Assume user has ID 99 to match "contains" logic etc, or just mock find
        // In processor: if (!$this->em->contains($user)) ... ->find($user->getId())
        // If I mock contains to false, I need find.

        $token = self::createStub(TokenInterface::class);
        $token->method('getUser')->willReturn($user);
        $tokenStorage->method('getToken')->willReturn($token);

        $group = new Group();
        $groupRepo->method('find')->with(1)->willReturn($group);

        $channel = new NotificationChannel();
        $channelRepo->method('find')->with(2)->willReturn($channel);

        $userRepo = self::createStub(\App\Repository\UserRepository::class);
        $userRepo->method('find')->willReturn($user);

        $em->method('getRepository')->willReturnCallback(
            function (string $class) use ($groupRepo, $channelRepo, $userRepo) {
                return match ($class) {
                    Group::class => $groupRepo,
                    NotificationChannel::class => $channelRepo,
                    User::class => $userRepo,
                    default => null,
                };
            }
        );

        // Expectations
        $em->expects($this->exactly(2))->method('persist'); // Policy + 1 Rule
        $em->expects($this->once())->method('flush');

        $result = $processor->process($dto, new Post());

        self::assertInstanceOf(NotificationPolicy::class, $result);
        self::assertEquals('Test Policy', $result->getName());
        self::assertEquals($user, $result->getUser());

        $rules = $result->getNotificationRules();
        self::assertCount(1, $rules);
        $rule = $rules->first();
        self::assertInstanceOf(NotificationRule::class, $rule);
        self::assertEquals('group', $rule->getTargetType());
        self::assertEquals($group, $rule->getContactGroup());
        self::assertEquals('birthday', $rule->getEventType());
        self::assertEquals(-1, $rule->getOffsetDays());
        self::assertEquals('10:00', $rule->getOffsetTime());
        self::assertEquals($channel, $rule->getChannel());
    }
}
