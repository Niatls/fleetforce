<?php
// Universal PHP Router for Reg.ru Host-A Shared Hosting
require_once __DIR__ . '/config.php';

$request_uri = $_SERVER['REQUEST_URI'];

if (strpos($request_uri, '/api/vacancies') !== false) {
    require __DIR__ . '/vacancies.php';
    exit();
}

if (strpos($request_uri, '/api/candidates') !== false) {
    require __DIR__ . '/candidates.php';
    exit();
}

if (strpos($request_uri, '/api/shipowner-requests') !== false) {
    require __DIR__ . '/shipowner-requests.php';
    exit();
}

if (strpos($request_uri, '/api/upload') !== false) {
    require __DIR__ . '/upload.php';
    exit();
}

// Fallback API Status Response
echo json_encode([
    'success' => true,
    'message' => 'FleetForce Reg.ru Host-A PHP Backend API Active',
    'timestamp' => date('c')
]);
