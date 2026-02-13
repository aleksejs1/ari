<?php

namespace Ari\Tests\Unit\State;

use ApiPlatform\Metadata\Post;
use Ari\Dto\NotificationPolicy\NotificationPolicyDto;
use Ari\Entity\Group;
use Ari\Entity\NotificationChannel;
use Ari\Entity\NotificationPolicy;
use Ari\Entity\NotificationRule;
use Ari\Entity\User;
use Ari\Repository\GroupRepository;
use Ari\Repository\NotificationChannelRepository;
use Ari\State\NotificationPolicyProcessor;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class NotificationPolicyProcessorTest extends TestCase
{
    public function testProcessCreatesPolicyAndRules(): void
    {
        $em = self::createStub(EntityManagerInterface::class);
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
        // Simulate user having ID 99
        $reflection = new \ReflectionProperty(User::class, 'id');
        $reflection->setValue($user, 99);

        // We need to implement 'contains'. User (id 99) is "in" the system.
        // If not contained, method logic does ->find($id).
        // Let's stub 'contains' to return true for this user
        $em->method('contains')->willReturnCallback(function ($obj) use ($user) {
            return $obj === $user;
        });

        $token = self::createStub(TokenInterface::class);
        $token->method('getUser')->willReturn($user);
        $tokenStorage->method('getToken')->willReturn($token);

        $group = new Group();
        $groupRepo->method('find')->willReturn($group);

        $channel = new NotificationChannel();
        $channelRepo->method('find')->willReturn($channel);

        $userRepo = self::createStub(\Ari\Repository\UserRepository::class);
        $userRepo->method('find')->willReturn($user);

        $em->method('getRepository')->willReturnCallback(
            function (string $class) use ($groupRepo, $channelRepo, $userRepo) {
                return match ($class) {
                    Group::class => $groupRepo,
                    NotificationChannel::class => $channelRepo,
                    User::class => $userRepo,
                    default => null,
                };
            },
        );

        // Expectations
        // $em->expects($this->exactly(2))->method('persist'); // Policy + 1 Rule
        // $em->expects($this->once())->method('flush');

        $persisted = [];
        $em->method('persist')->willReturnCallback(function ($obj) use (&$persisted) {
            $persisted[] = $obj;
        });

        // flush ignored

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

        self::assertCount(2, $persisted); // Policy and Rule
    }
}
