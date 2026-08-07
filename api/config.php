<?php
// FleetForce Backend — Unified SQLite Database Engine (fleetforce.db)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('DB_SQLITE_FILE', __DIR__ . '/data/fleetforce.db');
define('DB_JSON_FILE', __DIR__ . '/data/db.json');

// ─── SQLite PDO Singleton & Auto-Initializer ──────────────────────────────────
function get_pdo() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dir = dirname(DB_SQLITE_FILE);
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    try {
        $pdo = new PDO("sqlite:" . DB_SQLITE_FILE, null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        // Auto-create single unified site_config table
        $pdo->exec("CREATE TABLE IF NOT EXISTS site_config (
            config_key TEXT PRIMARY KEY,
            config_val TEXT
        )");

        // Auto-create candidates table
        $pdo->exec("CREATE TABLE IF NOT EXISTS candidates (
            id TEXT PRIMARY KEY,
            fullName TEXT,
            appliedRank TEXT,
            status TEXT DEFAULT 'New',
            submittedAt TEXT,
            data_json TEXT
        )");

        // Auto-create shipowner_requests table
        $pdo->exec("CREATE TABLE IF NOT EXISTS shipowner_requests (
            id TEXT PRIMARY KEY,
            companyName TEXT,
            status TEXT DEFAULT 'New',
            createdAt TEXT,
            data_json TEXT
        )");

        // Auto-create vacancies table
        $pdo->exec("CREATE TABLE IF NOT EXISTS vacancies (
            id TEXT PRIMARY KEY,
            title TEXT,
            rank_title TEXT,
            vesselType TEXT,
            dwt TEXT,
            salary TEXT,
            contract TEXT,
            joiningPort TEXT,
            joiningDate TEXT,
            urgent INTEGER DEFAULT 0,
            active INTEGER DEFAULT 1,
            data_json TEXT
        )");

        return $pdo;
    } catch (Exception $e) {
        return null;
    }
}

// ─── Fallback JSON helper ─────────────────────────────────────────────────────
function read_json_db() {
    if (file_exists(DB_JSON_FILE)) {
        $json = file_get_contents(DB_JSON_FILE);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }
    return [
        'vacancies'          => [],
        'candidates'         => [],
        'shipowner_requests' => [],
        'offices'            => [],
        'hub_blocks'         => [],
        'stats'              => [],
        'site_titles'        => null,
        'section_visibility' => ['hero'=>true, 'vacancies'=>true, 'hub'=>true, 'shipowners'=>true, 'offices'=>true]
    ];
}

function write_json_db($data) {
    $dir = dirname(DB_JSON_FILE);
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    @file_put_contents(DB_JSON_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// ─── Main Getter ──────────────────────────────────────────────────────────────
function get_database() {
    $db = read_json_db();
    $pdo = get_pdo();

    if ($pdo) {
        try {
            // Read site_config key-value pairs
            $rows = $pdo->query("SELECT config_key, config_val FROM site_config")->fetchAll();
            foreach ($rows as $r) {
                $val = json_decode($r['config_val'], true);
                if ($val !== null) {
                    $db[$r['config_key']] = $val;
                }
            }

            // Read candidates
            $cRows = $pdo->query("SELECT data_json FROM candidates ORDER BY ROWID DESC")->fetchAll();
            if (!empty($cRows)) {
                $cList = [];
                foreach ($cRows as $cr) {
                    $item = json_decode($cr['data_json'], true);
                    if ($item) $cList[] = $item;
                }
                if (!empty($cList)) $db['candidates'] = $cList;
            }

            // Read shipowner_requests
            $rRows = $pdo->query("SELECT data_json FROM shipowner_requests ORDER BY ROWID DESC")->fetchAll();
            if (!empty($rRows)) {
                $rList = [];
                foreach ($rRows as $rr) {
                    $item = json_decode($rr['data_json'], true);
                    if ($item) $rList[] = $item;
                }
                if (!empty($rList)) $db['shipowner_requests'] = $rList;
            }
        } catch (Exception $e) {}
    }

    return $db;
}

// ─── Main Saver ───────────────────────────────────────────────────────────────
function save_database($data) {
    write_json_db($data);
    $pdo = get_pdo();

    if ($pdo && is_array($data)) {
        try {
            if (method_exists($pdo, 'beginTransaction')) {
                $pdo->beginTransaction();
            }

            if (isset($data['candidates']) && is_array($data['candidates'])) {
                $pdo->exec("DELETE FROM candidates");
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

            if (isset($data['shipowner_requests']) && is_array($data['shipowner_requests'])) {
                $pdo->exec("DELETE FROM shipowner_requests");
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

            $stmtConfig = $pdo->prepare("INSERT OR REPLACE INTO site_config (config_key, config_val) VALUES (?, ?)");
            foreach (['offices', 'hub_blocks', 'vacancies', 'stats', 'site_titles', 'section_visibility'] as $k) {
                if (isset($data[$k])) {
                    $stmtConfig->execute([$k, json_encode($data[$k], JSON_UNESCAPED_UNICODE)]);
                }
            }

            if (method_exists($pdo, 'inTransaction') && $pdo->inTransaction()) {
                $pdo->commit();
            }
        } catch (Exception $e) {
            if (method_exists($pdo, 'inTransaction') && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
        }
    }
}

function get_pdo_for_delete() { return get_pdo(); }

// ─── Endpoint: config.php ─────────────────────────────────────────────────────
if (isset($_SERVER['SCRIPT_FILENAME']) && basename($_SERVER['SCRIPT_FILENAME']) === 'config.php') {
    $db = get_database();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (!empty($input)) {
            foreach (['offices','hub_blocks','vacancies','stats','site_titles','section_visibility'] as $key) {
                if (array_key_exists($key, $input)) {
                    $db[$key] = $input[$key];
                }
            }
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
