<?php
// FleetForce Backend — JSON-file as primary database, MySQL optional layer
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ─── Primary JSON Database ────────────────────────────────────────────────────
define('DB_JSON', __DIR__ . '/data/db.json');

// ─── MySQL credentials (optional) ────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'u3590013_default');
define('DB_USER', 'u3590013_default');
define('DB_PASS', 'GZqooM9Yl9L3GSI7');

// ─── Read JSON DB ─────────────────────────────────────────────────────────────
function read_json_db() {
    if (file_exists(DB_JSON)) {
        $json = file_get_contents(DB_JSON);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }
    // Fallback skeleton
    return [
        'vacancies'          => [],
        'candidates'         => [],
        'shipowner_requests' => [],
        'offices'            => [],
        'hub_blocks'         => [],
        'stats'              => [],
        'site_titles'        => null
    ];
}

// ─── Write JSON DB ────────────────────────────────────────────────────────────
function write_json_db($data) {
    $dir = dirname(DB_JSON);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    file_put_contents(DB_JSON, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// ─── Optional MySQL PDO ───────────────────────────────────────────────────────
function get_pdo() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        // Ensure candidate & request tables exist
        $pdo->exec("CREATE TABLE IF NOT EXISTS candidates (
            id VARCHAR(100) PRIMARY KEY,
            fullName VARCHAR(255),
            appliedRank VARCHAR(255),
            status VARCHAR(100) DEFAULT 'New',
            submittedAt VARCHAR(100),
            data_json LONGTEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        $pdo->exec("CREATE TABLE IF NOT EXISTS shipowner_requests (
            id VARCHAR(100) PRIMARY KEY,
            companyName VARCHAR(255),
            status VARCHAR(100) DEFAULT 'New',
            createdAt VARCHAR(100),
            data_json LONGTEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        return $pdo;
    } catch (Exception $e) {
        return null;
    }
}

// ─── Main getter ──────────────────────────────────────────────────────────────
function get_database() {
    $db = read_json_db();

    // Merge dynamic candidates from MySQL if available
    $pdo = get_pdo();
    if ($pdo) {
        try {
            $rows = $pdo->query("SELECT data_json FROM candidates ORDER BY submittedAt DESC")->fetchAll();
            $mysqlCandidates = [];
            foreach ($rows as $r) {
                $item = json_decode($r['data_json'], true);
                if ($item) $mysqlCandidates[] = $item;
            }
            if (!empty($mysqlCandidates)) {
                // Merge: keep JSON ones (admin-curated) + add new MySQL ones not already in JSON
                $jsonIds = array_flip(array_map('strval', array_column($db['candidates'], 'id')));
                foreach ($mysqlCandidates as $mc) {
                    $mcId = (string)($mc['id'] ?? '');
                    if ($mcId && !isset($jsonIds[$mcId])) {
                        $db['candidates'][] = $mc;
                    }
                }
            }

            $rows = $pdo->query("SELECT data_json FROM shipowner_requests ORDER BY createdAt DESC")->fetchAll();
            $mysqlRequests = [];
            foreach ($rows as $r) {
                $item = json_decode($r['data_json'], true);
                if ($item) $mysqlRequests[] = $item;
            }
            if (!empty($mysqlRequests)) {
                $jsonIds = array_flip(array_map('strval', array_column($db['shipowner_requests'], 'id')));
                foreach ($mysqlRequests as $mr) {
                    $mrId = (string)($mr['id'] ?? '');
                    if ($mrId && !isset($jsonIds[$mrId])) {
                        $db['shipowner_requests'][] = $mr;
                    }
                }
            }
        } catch (Exception $e) {}
    }

    return $db;
}

// ─── Save helper: writes JSON always, syncs candidates/requests to MySQL ──────
function save_database($data) {
    write_json_db($data);

    $pdo = get_pdo();
    if ($pdo && is_array($data)) {
        try {
            if (isset($data['candidates'])) {
                $pdo->exec("TRUNCATE TABLE candidates");
                $stmt = $pdo->prepare("INSERT INTO candidates (id, fullName, appliedRank, status, submittedAt, data_json) VALUES (?,?,?,?,?,?)");
                foreach ($data['candidates'] as $c) {
                    $stmt->execute([
                        (string)($c['id'] ?? ('APP-' . time())),
                        $c['fullName'] ?? '',
                        $c['appliedRank'] ?? '',
                        $c['status'] ?? 'New',
                        $c['submittedAt'] ?? date('c'),
                        json_encode($c, JSON_UNESCAPED_UNICODE)
                    ]);
                }
            }
            if (isset($data['shipowner_requests'])) {
                $pdo->exec("TRUNCATE TABLE shipowner_requests");
                $stmt = $pdo->prepare("INSERT INTO shipowner_requests (id, companyName, status, createdAt, data_json) VALUES (?,?,?,?,?)");
                foreach ($data['shipowner_requests'] as $r) {
                    $stmt->execute([
                        (string)($r['id'] ?? ('REQ-' . time())),
                        $r['companyName'] ?? '',
                        $r['status'] ?? 'New',
                        $r['createdAt'] ?? date('c'),
                        json_encode($r, JSON_UNESCAPED_UNICODE)
                    ]);
                }
            }
        } catch (Exception $e) {}
    }
}

// ─── Compatibility aliases ────────────────────────────────────────────────────
function get_pdo_for_delete() { return get_pdo(); }

// ─── Endpoint: config.php ─────────────────────────────────────────────────────
if (isset($_SERVER['SCRIPT_FILENAME']) && basename($_SERVER['SCRIPT_FILENAME']) === 'config.php') {
    $db = get_database();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (!empty($input)) {
            // Merge top-level keys into DB JSON (never override dynamic candidates/requests from MySQL)
            foreach (['offices','hub_blocks','vacancies','stats','site_titles'] as $key) {
                if (array_key_exists($key, $input)) {
                    $db[$key] = $input[$key];
                }
            }
            // candidates & shipowner_requests update
            if (array_key_exists('candidates', $input)) $db['candidates'] = $input['candidates'];
            if (array_key_exists('shipowner_requests', $input)) $db['shipowner_requests'] = $input['shipowner_requests'];

            save_database($db);
            echo json_encode(['success' => true, 'data' => $db]);
            exit();
        }
    }

    echo json_encode(['success' => true, 'data' => $db]);
    exit();
}
