<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_database();

if (!isset($db['shipowner_requests'])) {
    $db['shipowner_requests'] = [];
}

if ($method === 'GET') {
    echo json_encode(['success' => true, 'data' => $db['shipowner_requests']]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $newReq = array_merge([
        'id' => 'REQ-' . time(),
        'status' => 'New',
        'createdAt' => date('c'),
        'companyName' => 'Shipowner Company',
        'contactName' => 'Representative',
        'email' => '',
        'phone' => '',
        'details' => ''
    ], $input);

    array_unshift($db['shipowner_requests'], $newReq);
    save_database($db);
    echo json_encode(['success' => true, 'data' => $newReq]);
    exit();
}

if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = isset($_GET['id']) ? $_GET['id'] : (isset($input['id']) ? $input['id'] : '');

    $found = false;
    foreach ($db['shipowner_requests'] as &$req) {
        if ($req['id'] == $id) {
            $req = array_merge($req, $input);
            $found = true;
            break;
        }
    }
    if ($found) {
        save_database($db);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Request not found']);
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
        if ($last && $last !== 'shipowner-requests.php' && $last !== 'shipowner-requests') {
            $id = urldecode($last);
        }
    }
    if ($id) {
        $pdo = get_pdo();
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM shipowner_requests WHERE id = ?");
                $stmt->execute([(string)$id]);
            } catch(Exception $e) {}
        }
        $db['shipowner_requests'] = array_values(array_filter($db['shipowner_requests'], function($r) use ($id) {
            return isset($r['id']) && (string)$r['id'] !== (string)$id;
        }));
        save_database($db);
        echo json_encode(['success' => true]);
        exit();
    }
    echo json_encode(['success' => true, 'message' => 'No request ID provided']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
