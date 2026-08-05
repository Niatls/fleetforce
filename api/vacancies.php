<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_database();

if ($method === 'GET') {
    echo json_encode(['success' => true, 'data' => $db['vacancies']]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $newVac = array_merge([
        'id' => time(),
        'active' => true,
        'title' => 'Marine Vacancy',
        'rank' => 'Officer',
        'vesselType' => 'Commercial Vessel',
        'salary' => '$5,000',
        'contract' => '4 months',
        'joiningPort' => 'TBD',
        'joiningDate' => 'ASAP',
        'urgent' => false,
        'requirements' => ['Valid STCW'],
        'responsibilities' => 'Standard duties'
    ], $input);

    array_unshift($db['vacancies'], $newVac);
    save_database($db);
    echo json_encode(['success' => true, 'data' => $newVac]);
    exit();
}

if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = isset($_GET['id']) ? intval($_GET['id']) : (isset($input['id']) ? intval($input['id']) : 0);

    $found = false;
    foreach ($db['vacancies'] as &$vac) {
        if ($vac['id'] == $id) {
            $vac = array_merge($vac, $input);
            $found = true;
            break;
        }
    }
    if ($found) {
        save_database($db);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Vacancy not found']);
    }
    exit();
}

if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = isset($_GET['id']) ? $_GET['id'] : (isset($input['id']) ? $input['id'] : '');
    if (!$id && isset($_SERVER['REQUEST_URI'])) {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $parts = explode('/', trim($path, '/'));
        $last = end($parts);
        if ($last && $last !== 'vacancies.php' && $last !== 'vacancies') {
            $id = urldecode($last);
        }
    }
    if ($id) {
        $db['vacancies'] = array_values(array_filter($db['vacancies'], function($v) use ($id) {
            return isset($v['id']) && (string)$v['id'] !== (string)$id;
        }));
        save_database($db);
        echo json_encode(['success' => true]);
        exit();
    }
    echo json_encode(['success' => true, 'message' => 'No vacancy ID provided']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
