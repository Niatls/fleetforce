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
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    $db['vacancies'] = array_values(array_filter($db['vacancies'], function($v) use ($id) {
        return $v['id'] != $id;
    }));
    save_database($db);
    echo json_encode(['success' => true]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
