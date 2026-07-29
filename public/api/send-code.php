<?php
require_once __DIR__ . '/config.php';

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$email = isset($input['email']) ? trim($input['email']) : 'FleetforceLLC@hotmail.com';

$code = strval(rand(100000, 999999));

$subject = "FleetForce Admin - Verification Code: " . $code;
$message = "Здравствуйте!\n\nВаш код для первоначальной настройки пароля в панель администратора FleetForce Crewing Alliance:\n\n" . $code . "\n\nЕсли вы не запрашивали этот код, просто проигнорируйте данное письмо.";

$headers = "From: no-reply@fleetforce-crewing.com\r\n" .
           "Reply-To: FleetforceLLC@hotmail.com\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Attempt PHP mail dispatch
@mail($email, $subject, $message, $headers);

echo json_encode([
    'success' => true,
    'code' => $code,
    'email' => $email,
    'message' => 'Код успешно выслан на ' . $email
]);
exit();
