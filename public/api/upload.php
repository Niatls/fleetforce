<?php
require_once __DIR__ . '/config.php';

$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
            
            echo json_encode([
                'success' => true,
                'file' => [
                    'id' => 'f-' . time(),
                    'name' => $fileName,
                    'size' => round($fileSize / 1024, 1) . ' KB',
                    'type' => $fileType,
                    'dataUrl' => $fileUrl
                ]
            ]);
            exit();
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error moving uploaded file']);
            exit();
        }
    }
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
