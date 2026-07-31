Add-Type -Assembly 'System.IO.Compression.FileSystem'

$zipPath  = 'c:\Users\User\Documents\fleetforce\fleetforce.zip'
$baseDir  = 'c:\Users\User\Documents\fleetforce'
$distDir  = 'c:\Users\User\Documents\fleetforce\dist'

# Файлы которые берём из dist (перезаписываем в архиве)
$distFiles = @('index.html', 'assets\index.js')

# Полный список файлов архива (те что НЕ из dist — берём с их исходного места)
$staticFiles = @{
    '.htaccess'                    = "$baseDir\.htaccess"
    'Crew_Application_Form.pdf'    = "$baseDir\Crew_Application_Form.pdf"
    'favicon.png'                  = "$baseDir\public\favicon.png"
    '_redirects'                   = "$baseDir\public\_redirects"
    'api\candidates.php'           = "$baseDir\api\candidates.php"
    'api\config.php'               = "$baseDir\api\config.php"
    'api\index.js'                 = "$baseDir\api\index.js"
    'api\index.php'                = "$baseDir\api\index.php"
    'api\send-code.php'            = "$baseDir\api\send-code.php"
    'api\shipowner-requests.php'   = "$baseDir\api\shipowner-requests.php"
    'api\upload.php'               = "$baseDir\api\upload.php"
    'api\vacancies.php'            = "$baseDir\api\vacancies.php"
    'api\verify-code.php'          = "$baseDir\api\verify-code.php"
}

# Удаляем старый архив
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "Old ZIP removed."
}

# Создаём новый пустой ZIP
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')

# Добавляем статические файлы
foreach ($entry in $staticFiles.Keys) {
    $src = $staticFiles[$entry]
    if (Test-Path $src) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $src, $entry, 'Optimal') | Out-Null
        Write-Host "Added: $entry"
    } else {
        Write-Host "SKIP (not found): $entry"
    }
}

# Добавляем свежие файлы из dist
foreach ($rel in $distFiles) {
    $src = "$distDir\$rel"
    if (Test-Path $src) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $src, $rel, 'Optimal') | Out-Null
        Write-Host "Added from dist: $rel"
    } else {
        Write-Host "SKIP (dist not found): $rel"
    }
}

$zip.Dispose()
Write-Host ""
Write-Host "fleetforce.zip rebuilt successfully!"
