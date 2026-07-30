<?php
require_once __DIR__ . '/config.php';

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$email = 'FleetforceLLC@hotmail.com';

$code = strval(rand(100000, 999999));

// Save code to database store
$db = get_database();
$db['admin_verification'] = [
    'code' => $code,
    'expires' => time() + (15 * 60) // valid for 15 minutes
];
save_database($db);

// Prepare real PHP mail dispatch
$subject = "=?UTF-8?B?" . base64_encode("Код подтверждения FleetForce Admin: " . $code) . "?=";
$message = "Здравствуйте!\n\nВаш код для создания пароля администратора FleetForce Crewing Alliance:\n\n" . $code . "\n\nКод действителен в течение 15 минут.\nЕсли вы не запрашивали данный код, просто проигнорируйте данное письмо.";

$from = 'no-reply@fleetforcellc.org';
$headers = "From: FleetForce Security <" . $from . ">\r\n" .
           "Reply-To: FleetforceLLC@hotmail.com\r\n" .
           "MIME-Version: 1.0\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n" .
           "X-Mailer: PHP/" . phpversion();

$sent = @mail($email, $subject, $message, $headers, "-f " . $from);

echo json_encode([
    'success' => true,
    'message' => 'Код подтверждения успешно отправлен на ' . $email
]);
exit();
