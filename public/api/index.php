<?php
/**
 * FleetForce Crewing — PHP API Front Controller
 * Разработано по образцу архитектуры ЛАД для вируального хостинга Reg.ru Host-A.
 */

// 1. CORS & JSON Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Helper JSON response sender
function sendJson($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Helper request body parser
function getRequestBody() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $json = json_decode($raw, true);
    return is_array($json) ? $json : [];
}

// 2. Database Manager (JSON / SQLite Storage)
$dbDir = __DIR__ . '/data';
if (!file_exists($dbDir)) {
    mkdir($dbDir, 0755, true);
}
$dbFile = $dbDir . '/fleetforce_db.json';

function loadDatabase($dbFile) {
    if (file_exists($dbFile)) {
        $json = file_get_contents($dbFile);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }
    
    // Initial Default Data
    $initialData = [
        'vacancies' => [
            [
                'id' => 1,
                'title' => 'Master / Captain',
                'rank' => 'Master / Captain',
                'vesselType' => 'Chemical / Product Tanker',
                'dwt' => '47,000 DWT (MAN B&W)',
                'salary' => '$14,500',
                'contract' => '4 months',
                'joiningPort' => 'Rotterdam, Netherlands',
                'joiningDate' => '15.08.2026',
                'urgent' => true,
                'active' => true,
                'requirements' => [
                    'Minimum 2 contracts in rank on Chemical Tankers with FRAMO pumps',
                    'Valid Master Unlimited STCW II/2 Certificate & Flag Endorsements',
                    'Marlins English test > 85%'
                ],
                'responsibilities' => 'Overall command of vessel navigation, safety, crew operations and SIRE inspection readiness.'
            ],
            [
                'id' => 2,
                'title' => 'Chief Engineer',
                'rank' => 'Chief Engineer',
                'vesselType' => 'Container Ship (5000+ TEU)',
                'dwt' => '65,000 DWT (WinGD Flex)',
                'salary' => '$13,800',
                'contract' => '4 months',
                'joiningPort' => 'Singapore',
                'joiningDate' => '20.08.2026',
                'urgent' => false,
                'active' => true,
                'requirements' => [
                    'Experience with WinGD / RT-flex electronic engines',
                    'Chief Engineer Unlimited STCW III/2'
                ],
                'responsibilities' => 'Management of technical department, main engine, bunkering and dry-dock preparation.'
            ]
        ],
        'candidates' => [
            [
                'id' => 'APP-2026-089',
                'fullName' => 'Воронов Александр Сергеевич (Voronov Aleksandr)',
                'dob' => '1984-04-12',
                'citizenship' => 'Россия',
                'phone' => '+7 (918) 456-78-90',
                'email' => 'voronov.capt@gmail.com',
                'appliedRank' => 'Master / Captain',
                'alternativeRank' => 'Chief Officer / 1st Mate',
                'minSalary' => '14000',
                'readyDate' => '2026-08-10',
                'preferredVessels' => 'Chemical / Product Tanker',
                'status' => 'Approved',
                'marlinsScore' => '92%',
                'englishLevel' => 'Fluent / Advanced',
                'notes' => 'Отличные рекомендации от Stena Bulk. Готов к отправке в Нидерланды.',
                'submittedAt' => '2026-07-24T14:30:00Z'
            ]
        ],
        'shipowner_requests' => [
            [
                'id' => 'REQ-2026-001',
                'companyName' => 'Stena Bulk Tanker Management',
                'contactName' => 'Captain Hans Nielsen (Crew Director)',
                'email' => 'h.nielsen@stenabulk.com',
                'phone' => '+46 31 855 000',
                'details' => 'Требуется полное комплектование экипажа для 2 продуктовозов (Chemical/Product Tankers 47,000 DWT).',
                'status' => 'New',
                'createdAt' => '2026-07-26T11:20:00Z'
            ]
        ]
    ];
    
    saveDatabase($dbFile, $initialData);
    return $initialData;
}

function saveDatabase($dbFile, $data) {
    file_put_contents($dbFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$db = loadDatabase($dbFile);

// 3. Route Extraction (from ?route=... or REQUEST_URI)
$route = isset($_GET['route']) ? trim($_GET['route'], '/') : '';

if (empty($route)) {
    $uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (strpos($uriPath, '/api/') !== false) {
        $parts = explode('/api/', $uriPath);
        $route = trim(end($parts), '/');
    }
}

$method = $_SERVER['REQUEST_METHOD'];

// Route parsing logic
$routeParts = explode('/', $route);
$resource = strtolower($routeParts[0] ?? '');
$resourceId = $routeParts[1] ?? (isset($_GET['id']) ? $_GET['id'] : null);

// --- ROUTE 1: /api/vacancies ---
if ($resource === 'vacancies') {
    if ($method === 'GET') {
        sendJson(['success' => true, 'data' => $db['vacancies']]);
    }
    if ($method === 'POST') {
        $body = getRequestBody();
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
        ], $body);

        array_unshift($db['vacancies'], $newVac);
        saveDatabase($dbFile, $db);
        sendJson(['success' => true, 'data' => $newVac], 201);
    }
    if ($method === 'PUT') {
        $body = getRequestBody();
        $id = $resourceId ? intval($resourceId) : (isset($body['id']) ? intval($body['id']) : 0);
        $found = false;

        foreach ($db['vacancies'] as &$v) {
            if ($v['id'] == $id) {
                $v = array_merge($v, $body);
                $found = true;
                break;
            }
        }
        if ($found) {
            saveDatabase($dbFile, $db);
            sendJson(['success' => true]);
        }
        sendJson(['success' => false, 'message' => 'Vacancy not found'], 404);
    }
    if ($method === 'DELETE') {
        $id = $resourceId ? intval($resourceId) : 0;
        $db['vacancies'] = array_values(array_filter($db['vacancies'], function($v) use ($id) {
            return $v['id'] != $id;
        }));
        saveDatabase($dbFile, $db);
        sendJson(['success' => true]);
    }
}

// --- ROUTE 2: /api/candidates ---
if ($resource === 'candidates') {
    if ($method === 'GET') {
        sendJson(['success' => true, 'data' => $db['candidates']]);
    }
    if ($method === 'POST') {
        $body = getRequestBody();
        $newCand = array_merge([
            'id' => 'APP-2026-' . rand(100, 999),
            'status' => 'New',
            'submittedAt' => date('c'),
            'fullName' => 'Candidate',
            'appliedRank' => 'Officer',
            'seaService' => [],
            'attachedFiles' => []
        ], $body);

        array_unshift($db['candidates'], $newCand);
        saveDatabase($dbFile, $db);
        sendJson(['success' => true, 'data' => $newCand], 201);
    }
    if ($method === 'PUT') {
        $body = getRequestBody();
        $id = $resourceId ? $resourceId : (isset($body['id']) ? $body['id'] : '');
        $found = false;

        foreach ($db['candidates'] as &$c) {
            if ($c['id'] == $id) {
                $c = array_merge($c, $body);
                $found = true;
                break;
            }
        }
        if ($found) {
            saveDatabase($dbFile, $db);
            sendJson(['success' => true]);
        }
        sendJson(['success' => false, 'message' => 'Candidate not found'], 404);
    }
}

// --- ROUTE 3: /api/shipowner-requests ---
if ($resource === 'shipowner-requests') {
    if (!isset($db['shipowner_requests'])) {
        $db['shipowner_requests'] = [];
    }
    if ($method === 'GET') {
        sendJson(['success' => true, 'data' => $db['shipowner_requests']]);
    }
    if ($method === 'POST') {
        $body = getRequestBody();
        $newReq = array_merge([
            'id' => 'REQ-' . time(),
            'status' => 'New',
            'createdAt' => date('c'),
            'companyName' => 'Shipowner Company',
            'contactName' => 'Representative',
            'email' => '',
            'phone' => '',
            'details' => ''
        ], $body);

        array_unshift($db['shipowner_requests'], $newReq);
        saveDatabase($dbFile, $db);
        sendJson(['success' => true, 'data' => $newReq], 201);
    }
    if ($method === 'PUT') {
        $body = getRequestBody();
        $id = $resourceId ? $resourceId : (isset($body['id']) ? $body['id'] : '');
        $found = false;

        foreach ($db['shipowner_requests'] as &$r) {
            if ($r['id'] == $id) {
                $r = array_merge($r, $body);
                $found = true;
                break;
            }
        }
        if ($found) {
            saveDatabase($dbFile, $db);
            sendJson(['success' => true]);
        }
        sendJson(['success' => false, 'message' => 'Request not found'], 404);
    }
    if ($method === 'DELETE') {
        $id = $resourceId ? $resourceId : '';
        $db['shipowner_requests'] = array_values(array_filter($db['shipowner_requests'], function($r) use ($id) {
            return $r['id'] != $id;
        }));
        saveDatabase($dbFile, $db);
        sendJson(['success' => true]);
    }
}

// --- ROUTE 4: /api/upload ---
if ($resource === 'upload' && $method === 'POST') {
    $uploadDir = __DIR__ . '/uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['file']['tmp_name'];
        $fileName = $_FILES['file']['name'];
        $fileSize = $_FILES['file']['size'];
        $fileType = $_FILES['file']['type'];

        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));
        $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
        $dest_path = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $fileUrl = $protocol . "://" . $host . "/api/uploads/" . $newFileName;

            sendJson([
                'success' => true,
                'file' => [
                    'id' => 'f-' . time(),
                    'name' => $fileName,
                    'size' => round($fileSize / 1024, 1) . ' KB',
                    'type' => $fileType,
                    'dataUrl' => $fileUrl
                ]
            ]);
        }
    }
    sendJson(['success' => false, 'message' => 'Upload error'], 400);
}

// --- ROUTE 5: /api/auth/login ---
if ($resource === 'auth' && ($resourceId === 'login' || ($routeParts[1] ?? '') === 'login')) {
    if ($method === 'POST') {
        $body = getRequestBody();
        $user = $body['username'] ?? '';
        $pass = $body['password'] ?? '';

        if ($user === 'admin' && ($pass === 'admin123' || $pass === 'admin')) {
            sendJson(['success' => true, 'token' => 'fleetforce-jwt-token-9988', 'role' => 'admin']);
        } else {
            sendJson(['success' => false, 'message' => 'Invalid credentials'], 401);
        }
    }
}

// Fallback for root /api Status
sendJson([
    'success' => true,
    'service' => 'FleetForce Crewing PHP API (ЛАД Architecture)',
    'status' => 'Active',
    'timestamp' => date('c')
]);
