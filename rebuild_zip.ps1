Add-Type -Assembly 'System.IO.Compression.FileSystem'

$baseDir  = $PSScriptRoot
$zipPath  = Join-Path $baseDir 'fleetforce.zip'
$distDir  = Join-Path $baseDir 'dist'
$prefix   = 'fleetforce/'   # Корневая папка внутри архива

# Файлы из dist (свежий билд)
$distFiles = @('index.html', 'assets\index.js')

# Статические файлы: ключ = путь внутри ZIP (без prefix), значение = путь на диске
$staticFiles = [ordered]@{
    '.htaccess'                    = "$baseDir\.htaccess"
    'Crew_Application_Form.pdf'    = "$baseDir\Crew_Application_Form.pdf"
    'Application form.docx'        = "$baseDir\Application form.docx"
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
    'api\data\db.json'             = "$baseDir\api\data\db.json"
    'fleetforce_schema.sql'        = "$baseDir\fleetforce_schema.sql"
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
Get-ChildItem -Path $distDir -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($distDir.Length + 1)
    $entryName = ($prefix + $rel).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName, 'Optimal') | Out-Null
    Write-Host "Added from dist: $entryName"
}

$zip.Dispose()
Write-Host ""
Write-Host "fleetforce.zip rebuilt successfully!"
Write-Host "Archive structure: fleetforce/ -> all files"
