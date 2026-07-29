<?php
// FleetForce PHP Backend Config & DB Manager for Reg.ru Host-A
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('DB_FILE', __DIR__ . '/data/fleetforce_db.json');

function get_database() {
    $dir = dirname(DB_FILE);
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
    
    if (file_exists(DB_FILE)) {
        $json = file_get_contents(DB_FILE);
        $data = json_decode($json, true);
        if (is_array($data)) {
            return $data;
        }
    }
    
    // Default initial data structure
    $defaultData = [
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
        ]
    ];

    save_database($defaultData);
    return $defaultData;
}

function save_database($data) {
    $dir = dirname(DB_FILE);
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents(DB_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
