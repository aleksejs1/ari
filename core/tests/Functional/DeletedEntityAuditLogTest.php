<?php

namespace App\Tests\Functional;

class DeletedEntityAuditLogTest extends AbstractApiTestCase
{
    protected bool $autoLogin = true;

    public function testTimelineIncludesLogsForDeletedEntities(): void
    {
        $client = static::createClient();

        // 1. Create a contact with a name
        $response = $client->request('POST', '/api/contacts', [
            'auth_bearer' => $this->token,
            'json' => [
                'contactNames' => [
                    [
                        'given' => 'John',
                        'family' => 'Doe',
                    ],
                ],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $data = $response->toArray();
        $contactId = $data['id'];
        $contactNameId = $data['contactNames'][0]['id'];
        $contactNameIri = $data['contactNames'][0]['@id'];

        // 2. Delete the Name (not the contact)
        $client->request('DELETE', $contactNameIri, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseStatusCodeSame(204);

        // 3. Get Contact Timeline
        $timelineResponse = $client->request('GET', "/api/contacts/{$contactId}/timeline", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $timelineData = $timelineResponse->toArray();
        $logs = $timelineData['logs'];

        // 4. Verify logs for the deleted name are present
        $foundCreateLog = false;
        $foundDeleteLog = false;

        foreach ($logs as $log) {
            if ('App\\Entity\\ContactName' === $log['entityType'] && (string) $log['entityId'] === (string) $contactNameId) {
                if ('INSERT' === $log['action']) {
                    $foundCreateLog = true;
                }
                if ('REMOVE' === $log['action']) {
                    $foundDeleteLog = true;
                }
            }
        }

        self::assertTrue($foundCreateLog, 'Timeline should contain INSERT log for deleted ContactName');
        self::assertTrue($foundDeleteLog, 'Timeline should contain REMOVE log for deleted ContactName');
    }
}
