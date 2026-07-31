@echo off
setlocal

echo.
echo ==========================================
echo  FleetForce Deploy Script
echo ==========================================
echo.

:: --- 1. Build ---
echo [1/4] Building...
node node_modules\vite\bin\vite.js build
if errorlevel 1 (
    echo BUILD FAILED. Aborting.
    pause
    exit /b 1
)
echo Build OK.
echo.

:: --- 2. Update ZIP archive ---
echo [2/4] Updating fleetforce.zip...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Add-Type -Assembly 'System.IO.Compression.FileSystem'; ^
     Add-Type -Assembly 'System.IO.Compression'; ^
     $zip = [System.IO.Compression.ZipFile]::Open('%~dp0fleetforce.zip', 'Update'); ^
     $updates = @{ 'assets\index.js' = '%~dp0dist\assets\index.js'; 'index.html' = '%~dp0dist\index.html' }; ^
     foreach ($e in $updates.Keys) { ^
         $old = $zip.Entries | Where-Object { $_.FullName -eq $e }; ^
         if ($old) { $old.Delete() }; ^
         [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $updates[$e], $e, 'Optimal') | Out-Null; ^
         Write-Host 'Updated: ' $e ^
     }; ^
     $zip.Dispose(); ^
     Write-Host 'ZIP updated.'"
if errorlevel 1 (
    echo ZIP UPDATE FAILED. Aborting.
    pause
    exit /b 1
)
echo.

:: --- 3. Git commit ---
echo [3/4] Committing...
set /p MSG="Commit message (or press Enter for default): "
if "%MSG%"=="" set MSG=Build: update dist and deployment archive

git add -A
git commit -m "%MSG%"
echo.

:: --- 4. Git push ---
echo [4/4] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo PUSH FAILED. Check your internet connection or token.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  Done! Build, ZIP and push complete.
echo ==========================================
pause
