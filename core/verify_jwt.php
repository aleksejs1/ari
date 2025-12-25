<?php
$url = 'http://localhost:8000/api/login_check';
$data = ['username' => 'test-uuid-1234', 'password' => 'password'];
$options = [
    'http' => [
        'header'  => "Content-Type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true,
    ],
];
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo $result;
