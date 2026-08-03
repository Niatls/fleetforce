Add-Type -Assembly 'System.IO.Compression.FileSystem'

$zipPath  = 'c:\Users\asdqw\Project\fleetforce\fleetforce.zip'
$baseDir  = 'c:\Users\asdqw\Project\fleetforce'
$distDir  = 'c:\Users\asdqw\Project\fleetforce\dist'
$prefix   = 'fleetforce/'   # Корневая папка внутри архива

# Файлы из dist (свежий билд)
$distFiles = @('index.html', 'assets\index.js')

# Статические файлы: ключ = путь внутри ZIP (без prefix), значение = путь на диске
$staticFiles = [ordered]@{
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

# Добавляем статические файлы с префиксом
foreach ($entry in $staticFiles.Keys) {
    $src = $staticFiles[$entry]
    $entryName = ($prefix + $entry).Replace('\', '/')
    if (Test-Path $src) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $src, $entryName, 'Optimal') | Out-Null
        Write-Host "Added: $entryName"
    } else {
        Write-Host "SKIP (not found): $entryName"
    }
}

# Добавляем свежие файлы из dist с префиксом
foreach ($rel in $distFiles) {
    $src = "$distDir\$rel"
    $entryName = ($prefix + $rel).Replace('\', '/')
    if (Test-Path $src) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $src, $entryName, 'Optimal') | Out-Null
        Write-Host "Added from dist: $entryName"
    } else {
        Write-Host "SKIP (dist not found): $entryName"
    }
}

$zip.Dispose()
Write-Host ""
Write-Host "fleetforce.zip rebuilt successfully!"
Write-Host "Archive structure: fleetforce/ -> all files"
