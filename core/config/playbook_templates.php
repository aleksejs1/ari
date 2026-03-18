<?php

declare(strict_types=1);

use Ari\Service\PlaybookTaskConfig;
use Ari\Service\PlaybookTemplateConfig;

return [
    new PlaybookTemplateConfig(
        preset: 'maintain_parents',
        goal: 'maintain',
        title: 'Parents / Close Family',
        frequencyDays: 7,
        tasks: [
            new PlaybookTaskConfig('call', false, 7, null),
            new PlaybookTaskConfig('visit', true, 30, 'What was best about this visit?'),
        ],
    ),
    new PlaybookTemplateConfig(
        preset: 'maintain_friend',
        goal: 'maintain',
        title: 'Close Friend',
        frequencyDays: 14,
        tasks: [
            new PlaybookTaskConfig('call', false, 14, null),
            new PlaybookTaskConfig('text_message', false, 7, null),
        ],
    ),
    new PlaybookTemplateConfig(
        preset: 'deepen_colleague',
        goal: 'deepen',
        title: 'Colleague / Mentor',
        frequencyDays: 14,
        tasks: [
            new PlaybookTaskConfig('call', false, 14, null),
            new PlaybookTaskConfig('share_insight', false, 21, null),
            new PlaybookTaskConfig('checkin_question', false, 30, null),
        ],
    ),
    new PlaybookTemplateConfig(
        preset: 'reignite_partner',
        goal: 'reignite',
        title: 'Partner / Spouse',
        frequencyDays: 7,
        tasks: [
            new PlaybookTaskConfig('date_night', true, 14, 'What made tonight special?'),
            new PlaybookTaskConfig('text_message', false, 3, null),
            new PlaybookTaskConfig('surprise', true, 30, 'What did they love most?'),
        ],
    ),
    new PlaybookTemplateConfig(
        preset: 'reignite_friend',
        goal: 'reignite',
        title: 'Old Friend',
        frequencyDays: 14,
        tasks: [
            new PlaybookTaskConfig('call', false, 14, null),
            new PlaybookTaskConfig('restart_message', false, 30, null),
        ],
    ),
    new PlaybookTemplateConfig(
        preset: 'appreciate_mentor',
        goal: 'appreciate',
        title: 'Mentor / Hero',
        frequencyDays: 30,
        tasks: [
            new PlaybookTaskConfig('share_insight', false, 21, null),
            new PlaybookTaskConfig('checkin_question', false, 30, null),
        ],
    ),
    new PlaybookTemplateConfig(
        preset: 'rekindle_lost',
        goal: 'rekindle',
        title: 'Lost Connection',
        frequencyDays: 30,
        tasks: [
            new PlaybookTaskConfig('restart_message', false, 30, null),
            new PlaybookTaskConfig('call', false, 21, null),
        ],
    ),
];
