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

:: --- 2. Rebuild ZIP archive from scratch ---
echo [2/4] Rebuilding fleetforce.zip...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0rebuild_zip.ps1"
if errorlevel 1 (
    echo ZIP REBUILD FAILED. Aborting.
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
