<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = get_database();

if ($method === 'GET') {
    echo json_encode(['success' => true, 'data' => $db['candidates']]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $newCand = array_merge([
        'id' => 'APP-2026-' . date('His') . '-' . rand(10, 99),
        'status' => 'New',
        'submittedAt' => date('c'),
        'fullName' => 'Candidate',
        'appliedRank' => 'Officer',
        'seaService' => [],
        'attachedFiles' => []
    ], $input);

    array_unshift($db['candidates'], $newCand);
    save_database($db);
    echo json_encode(['success' => true, 'data' => $newCand]);
    exit();
}

if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = isset($_GET['id']) ? $_GET['id'] : (isset($input['id']) ? $input['id'] : '');

    $found = false;
    foreach ($db['candidates'] as &$cand) {
        if ($cand['id'] == $id) {
            $cand = array_merge($cand, $input);
            $found = true;
            break;
        }
    }
    if ($found) {
        save_database($db);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Candidate not found']);
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
        if ($last && $last !== 'candidates.php' && $last !== 'candidates') {
            $id = urldecode($last);
        }
    }
    if ($id) {
        $pdo = get_pdo();
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM candidates WHERE id = ?");
                $stmt->execute([(string)$id]);
            } catch(Exception $e) {}
        }
        $db['candidates'] = array_values(array_filter($db['candidates'], function($c) use ($id) {
            return isset($c['id']) && (string)$c['id'] !== (string)$id;
        }));
        save_database($db);
        echo json_encode(['success' => true]);
        exit();
    }
    echo json_encode(['success' => true, 'message' => 'No candidate ID provided']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
