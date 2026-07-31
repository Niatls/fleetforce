param()
$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$OUT  = Join-Path $ROOT "fleetforce_regru_phphost.zip"

Write-Host ""
Write-Host "========================================"
Write-Host "  FleetForce - Reg.ru Build Script"
Write-Host "========================================"
Write-Host ""

# 1. Install dependencies if node_modules missing
if (-not (Test-Path (Join-Path $ROOT "node_modules"))) {
    Write-Host "[1/3] Installing npm dependencies..."
    & npm install --prefix $ROOT
} else {
    Write-Host "[1/3] node_modules found, skipping install."
}

# 2. Build frontend
Write-Host "[2/3] Building frontend..."
Set-Location $ROOT
& node (Join-Path $ROOT "node_modules\vite\bin\vite.js") build

$distPath = Join-Path $ROOT "dist"
if (-not (Test-Path $distPath)) {
    Write-Host "ERROR: dist/ folder not found after build!"
    exit 1
}
Write-Host "      Build complete."

# 3. Assemble ZIP archive
Write-Host "[3/3] Assembling archive..."

if (Test-Path $OUT) { Remove-Item $OUT -Force }

$STAGE = Join-Path $ROOT "_stage_regru"
if (Test-Path $STAGE) { Remove-Item $STAGE -Recurse -Force }
New-Item -ItemType Directory -Path $STAGE | Out-Null

# Copy built frontend into staging root
Copy-Item -Path (Join-Path $distPath "*") -Destination $STAGE -Recurse -Force

# Copy PHP API files
$apiSrc  = Join-Path $ROOT "public\api"
$apiDest = Join-Path $STAGE "api"
New-Item -ItemType Directory -Path $apiDest -Force | Out-Null
if (Test-Path $apiSrc) {
    Copy-Item -Path (Join-Path $apiSrc "*") -Destination $apiDest -Recurse -Force
}

# Copy .htaccess
$htPub  = Join-Path $ROOT "public\.htaccess"
$htRoot = Join-Path $ROOT ".htaccess"
if (Test-Path $htPub) {
    Copy-Item $htPub (Join-Path $STAGE ".htaccess") -Force
} elseif (Test-Path $htRoot) {
    Copy-Item $htRoot (Join-Path $STAGE ".htaccess") -Force
}

# Copy PDF form if present
$pdf = Join-Path $ROOT "Crew_Application_Form.pdf"
if (Test-Path $pdf) {
    Copy-Item $pdf (Join-Path $STAGE "Crew_Application_Form.pdf") -Force
}

# Create ZIP
Add-Type -Assembly "System.IO.Compression.FileSystem"
[System.IO.Compression.ZipFile]::CreateFromDirectory($STAGE, $OUT)

Remove-Item $STAGE -Recurse -Force

$sizeMB = [math]::Round((Get-Item $OUT).Length / 1MB, 2)
Write-Host ""
Write-Host "========================================"
Write-Host "  DONE! Archive ready:"
Write-Host "  $OUT"
Write-Host "  Size: $sizeMB MB"
Write-Host "========================================"
Write-Host ""
