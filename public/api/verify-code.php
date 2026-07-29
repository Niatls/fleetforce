<?php
require_once __DIR__ . '/config.php';

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$code = isset($input['code']) ? trim($input['code']) : '';
$newPassword = isset($input['newPassword']) ? trim($input['newPassword']) : '';

$db = get_database();
$verification = isset($db['admin_verification']) ? $db['admin_verification'] : null;

if (!$verification || !isset($verification['code'])) {
    // If local/offline or first run fallback
    if (strlen($code) === 6 && !empty($newPassword)) {
        $db['admin_master_password'] = password_hash($newPassword, PASSWORD_DEFAULT);
        $db['admin_master_password_plain'] = $newPassword;
        save_database($db);
        echo json_encode(['success' => true, 'message' => 'Пароль успешно создан']);
        exit();
    }
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Код не был запрошен или истек']);
    exit();
}

if (time() > $verification['expires']) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Срок действия кода истек. Запросите новый код.']);
    exit();
}

if ($verification['code'] !== $code) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Неверный код из письма!']);
    exit();
}

// Verification succeeded - save master password
$db['admin_master_password'] = password_hash($newPassword, PASSWORD_DEFAULT);
$db['admin_master_password_plain'] = $newPassword;
unset($db['admin_verification']);
save_database($db);

echo json_encode(['success' => true, 'message' => 'Пароль администратора успешно создан']);
exit();
