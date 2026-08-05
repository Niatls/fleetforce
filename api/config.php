<?php
// FleetForce PHP Backend Config & MySQL Manager for Reg.ru
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('DB_HOST', 'localhost');
define('DB_NAME', 'u3590013_default');
define('DB_USER', 'u3590013_default');
define('DB_PASS', 'GZqooM9Yl9L3GSI7');
define('DB_FILE', __DIR__ . '/data/fleetforce_db.json');

function get_pdo() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        init_mysql_tables($pdo);
        return $pdo;
    } catch (Exception $e) {
        return null;
    }
}

function init_mysql_tables($pdo) {
    static $initialized = false;
    if ($initialized) return;
    $initialized = true;

    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS vacancies (
            id VARCHAR(100) PRIMARY KEY,
            title VARCHAR(255),
            rank_title VARCHAR(255),
            vesselType VARCHAR(255),
            dwt VARCHAR(255),
            salary VARCHAR(255),
            contract VARCHAR(255),
            joiningPort VARCHAR(255),
            joiningDate VARCHAR(255),
            urgent TINYINT(1) DEFAULT 0,
            active TINYINT(1) DEFAULT 1,
            requirements LONGTEXT,
            responsibilities TEXT,
            data_json LONGTEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

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

        $pdo->exec("CREATE TABLE IF NOT EXISTS site_config (
            config_key VARCHAR(100) PRIMARY KEY,
            config_val LONGTEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    } catch (Exception $e) {}
}

function has_table_records($pdo, $table) {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `$table`");
        $row = $stmt->fetch();
        return ($row && intval($row['cnt']) > 0);
    } catch(Exception $e) {
        return false;
    }
}

function get_default_data() {
    return [
        "vacancies" => [
            [
                "id" => 1,
                "title" => "Master / Captain",
                "rank" => "Master / Captain",
                "vesselType" => "Chemical / Product Tanker",
                "dwt" => "47,000 DWT (MAN B&W)",
                "salary" => "$14,500",
                "contract" => "4 months",
                "joiningPort" => "Rotterdam, Netherlands",
                "joiningDate" => "15.08.2026",
                "urgent" => true,
                "active" => true,
                "requirements" => [
                    "Minimum 2 contracts in rank on Chemical Tankers with FRAMO pumps",
                    "Valid Master Unlimited STCW II/2 Certificate & Flag Endorsements",
                    "Marlins English test > 85%"
                ],
                "responsibilities" => "Overall command of vessel navigation, safety, crew operations and SIRE inspection readiness."
            ],
            [
                "id" => 2,
                "title" => "Chief Engineer",
                "rank" => "Chief Engineer",
                "vesselType" => "Container Ship (5000+ TEU)",
                "dwt" => "65,000 DWT (WinGD Flex)",
                "salary" => "$13,800",
                "contract" => "4 months",
                "joiningPort" => "Singapore",
                "joiningDate" => "20.08.2026",
                "urgent" => false,
                "active" => true,
                "requirements" => [
                    "Experience with WinGD / RT-flex electronic engines",
                    "Chief Engineer Unlimited STCW III/2"
                ],
                "responsibilities" => "Management of technical department, main engine, bunkering and dry-dock preparation."
            ]
        ],
        "candidates" => [
            [
                "id" => "APP-2026-089",
                "fullName" => "Воронов Александр Сергеевич (Voronov Aleksandr)",
                "dob" => "1984-04-12",
                "citizenship" => "Россия",
                "phone" => "+7 (918) 456-78-90",
                "email" => "voronov.capt@gmail.com",
                "appliedRank" => "Master / Captain",
                "alternativeRank" => "Chief Officer / 1st Mate",
                "minSalary" => "14000",
                "readyDate" => "2026-08-10",
                "preferredVessels" => "Chemical / Product Tanker",
                "status" => "Approved",
                "marlinsScore" => "92%",
                "englishLevel" => "Fluent / Advanced",
                "notes" => "Отличные рекомендации от Stena Bulk. Готов к отправке в Нидерланды.",
                "submittedAt" => "2026-07-24T14:30:00Z"
            ]
        ],
        "shipowner_requests" => [
            [
                "id" => "REQ-2026-001",
                "companyName" => "Stena Bulk Tanker Management",
                "contactName" => "Captain Hans Nielsen (Crew Director)",
                "email" => "h.nielsen@stenabulk.com",
                "phone" => "+46 31 855 000",
                "details" => "Требуется полное комплектование экипажа для 2 продуктовозов (Chemical/Product Tankers 47,000 DWT).",
                "status" => "New",
                "createdAt" => "2026-07-26T11:20:00Z"
            ]
        ],
        "offices" => [
            [
                "id" => 1,
                "city" => "Санкт-Петербург",
                "cityEn" => "Saint Petersburg",
                "address" => "г. Санкт-Петербург, пр. Стачек, д. 47А, офис 340-342",
                "addressEn" => "47A Stachek Ave, Office 340-342, Saint Petersburg",
                "phone" => "",
                "phones" => [],
                "email" => "FleetForceLLC@yandex.ru",
                "emails" => ["FleetForceLLC@yandex.ru"],
                "flag" => "⚓ Главный Офис",
                "flagEn" => "⚓ Headquarters"
            ],
            [
                "id" => 2,
                "city" => "Новороссийск",
                "cityEn" => "Novorossiysk",
                "address" => "г. Новороссийск, ул. Энгельса/Свободы/Конституции, д. 7, офис 37",
                "addressEn" => "7 Engelsa/Svobody/Konstitutsii St, Office 37, Novorossiysk",
                "phone" => "",
                "phones" => [],
                "email" => "FleetForceLLC@yandex.ru",
                "emails" => ["FleetForceLLC@yandex.ru"],
                "flag" => "🌊 Черноморский Филиал",
                "flagEn" => "🌊 Black Sea Branch"
            ]
        ],
        "hub_blocks" => [
            [
                "id" => 1,
                "title" => "FleetForce Standard Application (PDF)",
                "description" => "Официальный 5-страничный бланк морской анкеты FleetForce Crewing Alliance в формате PDF.",
                "buttonText" => "Скачать бланки анкеты Fleet Force (.PDF)",
                "actionType" => "download",
                "filename" => "Crew_Application_Form.pdf",
                "iconType" => "FileText",
                "color" => "blue"
            ],
            [
                "id" => 2,
                "title" => "FleetForce CV Form (DOC)",
                "description" => "Редактируемый Word (.DOC) бланк морской анкеты с полной матрицей плавательского ценза Fleet Force.",
                "buttonText" => "Скачать анкету Fleet Force (.DOC)",
                "actionType" => "download",
                "filename" => "Crew_Application_Form.doc",
                "iconType" => "Download",
                "color" => "gold"
            ],
            [
                "id" => 3,
                "title" => "Чек-лист документов для посадки",
                "description" => "Полный перечень рабочих дипломов, подтверждений, НБЖС и медицинских комиссий (Подплав / ОУК) для рейса.",
                "buttonText" => "Заполнить онлайн",
                "actionType" => "wizard",
                "iconType" => "FileCheck",
                "color" => "emerald"
            ]
        ]
    ];
}

function get_database() {
    $pdo = get_pdo();
    if ($pdo) {
        try {
            $vacancies = [];
            $stmt = $pdo->query("SELECT data_json FROM vacancies");
            while ($row = $stmt->fetch()) {
                if (!empty($row['data_json'])) {
                    $item = json_decode($row['data_json'], true);
                    if ($item) $vacancies[] = $item;
                }
            }

            $candidates = [];
            $stmt = $pdo->query("SELECT data_json FROM candidates");
            while ($row = $stmt->fetch()) {
                if (!empty($row['data_json'])) {
                    $item = json_decode($row['data_json'], true);
                    if ($item) $candidates[] = $item;
                }
            }

            $shipowner_requests = [];
            $stmt = $pdo->query("SELECT data_json FROM shipowner_requests");
            while ($row = $stmt->fetch()) {
                if (!empty($row['data_json'])) {
                    $item = json_decode($row['data_json'], true);
                    if ($item) $shipowner_requests[] = $item;
                }
            }

            $offices = null;
            $stmt = $pdo->prepare("SELECT config_val FROM site_config WHERE config_key = 'offices'");
            $stmt->execute();
            $row = $stmt->fetch();
            if ($row && !empty($row['config_val'])) {
                $offices = json_decode($row['config_val'], true);
            }

            $hub_blocks = null;
            $stmt = $pdo->prepare("SELECT config_val FROM site_config WHERE config_key = 'hub_blocks'");
            $stmt->execute();
            $row = $stmt->fetch();
            if ($row && !empty($row['config_val'])) {
                $hub_blocks = json_decode($row['config_val'], true);
            }

            $stats = null;
            $stmt = $pdo->prepare("SELECT config_val FROM site_config WHERE config_key = 'stats'");
            $stmt->execute();
            $row = $stmt->fetch();
            if ($row && !empty($row['config_val'])) {
                $stats = json_decode($row['config_val'], true);
            }

            $site_titles = null;
            $stmt = $pdo->prepare("SELECT config_val FROM site_config WHERE config_key = 'site_titles'");
            $stmt->execute();
            $row = $stmt->fetch();
            if ($row && !empty($row['config_val'])) {
                $site_titles = json_decode($row['config_val'], true);
            }

            $defaultData = get_default_data();
            $result = [
                'vacancies' => (empty($vacancies) && !has_table_records($pdo, 'vacancies')) ? $defaultData['vacancies'] : $vacancies,
                'candidates' => (empty($candidates) && !has_table_records($pdo, 'candidates')) ? $defaultData['candidates'] : $candidates,
                'shipowner_requests' => (empty($shipowner_requests) && !has_table_records($pdo, 'shipowner_requests')) ? $defaultData['shipowner_requests'] : $shipowner_requests,
                'offices' => is_array($offices) ? $offices : $defaultData['offices'],
                'hub_blocks' => is_array($hub_blocks) ? $hub_blocks : $defaultData['hub_blocks'],
                'stats' => is_array($stats) ? $stats : ($defaultData['stats'] ?? []),
                'site_titles' => is_array($site_titles) ? $site_titles : null
            ];

            return $result;
        } catch (Exception $e) {}
    }

    $dir = dirname(DB_FILE);
    if (!file_exists($dir)) mkdir($dir, 0755, true);
    if (file_exists(DB_FILE)) {
        $json = file_get_contents(DB_FILE);
        $data = json_decode($json, true);
        if (is_array($data)) return $data;
    }
    
    $defaultData = get_default_data();
    save_database($defaultData);
    return $defaultData;
}

function save_database($data) {
    $pdo = get_pdo();
    if ($pdo && is_array($data)) {
        try {
            if (isset($data['vacancies']) && is_array($data['vacancies'])) {
                $pdo->exec("TRUNCATE TABLE vacancies");
                $stmt = $pdo->prepare("INSERT INTO vacancies (id, title, rank_title, vesselType, dwt, salary, contract, joiningPort, joiningDate, urgent, active, requirements, responsibilities, data_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($data['vacancies'] as $v) {
                    $vId = (string)($v['id'] ?? time());
                    $stmt->execute([
                        $vId,
                        $v['title'] ?? '',
                        $v['rank'] ?? '',
                        $v['vesselType'] ?? '',
                        $v['dwt'] ?? '',
                        $v['salary'] ?? '',
                        $v['contract'] ?? '',
                        $v['joiningPort'] ?? '',
                        $v['joiningDate'] ?? '',
                        !empty($v['urgent']) ? 1 : 0,
                        !empty($v['active']) ? 1 : 0,
                        json_encode($v['requirements'] ?? []),
                        $v['responsibilities'] ?? '',
                        json_encode($v, JSON_UNESCAPED_UNICODE)
                    ]);
                }
            }

            if (isset($data['candidates']) && is_array($data['candidates'])) {
                $pdo->exec("TRUNCATE TABLE candidates");
                $stmt = $pdo->prepare("INSERT INTO candidates (id, fullName, appliedRank, status, submittedAt, data_json) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($data['candidates'] as $c) {
                    $cId = (string)($c['id'] ?? ('APP-' . time()));
                    $stmt->execute([
                        $cId,
                        $c['fullName'] ?? '',
                        $c['appliedRank'] ?? '',
                        $c['status'] ?? 'New',
                        $c['submittedAt'] ?? date('c'),
                        json_encode($c, JSON_UNESCAPED_UNICODE)
                    ]);
                }
            }

            if (isset($data['shipowner_requests']) && is_array($data['shipowner_requests'])) {
                $pdo->exec("TRUNCATE TABLE shipowner_requests");
                $stmt = $pdo->prepare("INSERT INTO shipowner_requests (id, companyName, status, createdAt, data_json) VALUES (?, ?, ?, ?, ?)");
                foreach ($data['shipowner_requests'] as $r) {
                    $rId = (string)($r['id'] ?? ('REQ-' . time()));
                    $stmt->execute([
                        $rId,
                        $r['companyName'] ?? '',
                        $r['status'] ?? 'New',
                        $r['createdAt'] ?? date('c'),
                        json_encode($r, JSON_UNESCAPED_UNICODE)
                    ]);
                }
            }

            if (isset($data['offices'])) {
                $stmt = $pdo->prepare("REPLACE INTO site_config (config_key, config_val) VALUES ('offices', ?)");
                $stmt->execute([json_encode($data['offices'], JSON_UNESCAPED_UNICODE)]);
            }

            if (isset($data['hub_blocks'])) {
                $stmt = $pdo->prepare("REPLACE INTO site_config (config_key, config_val) VALUES ('hub_blocks', ?)");
                $stmt->execute([json_encode($data['hub_blocks'], JSON_UNESCAPED_UNICODE)]);
            }

            if (isset($data['stats'])) {
                $stmt = $pdo->prepare("REPLACE INTO site_config (config_key, config_val) VALUES ('stats', ?)");
                $stmt->execute([json_encode($data['stats'], JSON_UNESCAPED_UNICODE)]);
            }

            if (isset($data['site_titles'])) {
                $stmt = $pdo->prepare("REPLACE INTO site_config (config_key, config_val) VALUES ('site_titles', ?)");
                $stmt->execute([json_encode($data['site_titles'], JSON_UNESCAPED_UNICODE)]);
            }
        } catch (Exception $e) {}
    }

    $dir = dirname(DB_FILE);
    if (!file_exists($dir)) mkdir($dir, 0755, true);
    file_put_contents(DB_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

if (isset($_SERVER['SCRIPT_FILENAME']) && basename($_SERVER['SCRIPT_FILENAME']) === 'config.php') {
    $db = get_database();
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        if (!empty($input)) {
            $updated = array_merge($db, $input);
            save_database($updated);
            echo json_encode(['success' => true, 'data' => $updated]);
            exit();
        }
    }
    echo json_encode(['success' => true, 'data' => $db]);
    exit();
}
