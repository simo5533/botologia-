@echo off
cd /d "%~dp0"
title BoTooLogIA - Installation et demarrage

set "NODE_DIR="
set "NPM="

rem Chemin complet vers npm pour eviter erreur apres suppression de node_modules
if exist "%ProgramFiles%\nodejs\npm.cmd" (
  set "NODE_DIR=%ProgramFiles%\nodejs"
  set "NPM=%ProgramFiles%\nodejs\npm.cmd"
)
if not defined NPM if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" (
  set "NODE_DIR=%ProgramFiles(x86)%\nodejs"
  set "NPM=%ProgramFiles(x86)%\nodejs\npm.cmd"
)
if not defined NPM if exist "%LOCALAPPDATA%\Programs\node\npm.cmd" (
  set "NODE_DIR=%LOCALAPPDATA%\Programs\node"
  set "NPM=%LOCALAPPDATA%\Programs\node\npm.cmd"
)
if not defined NPM for /f "delims=" %%i in ('where npm.cmd 2^>nul') do set "NPM=%%i" && set "NODE_DIR=%%~dpi" && goto :found
if not defined NPM for /f "delims=" %%i in ('where npm 2^>nul') do set "NPM=%%i" && set "NODE_DIR=%%~dpi" && goto :found

:found
if not defined NPM (
  echo [ERREUR] Node.js introuvable. Installez depuis https://nodejs.org
  start https://nodejs.org/fr 2>nul
  pause
  exit /b 1
)

if defined NODE_DIR set "PATH=%NODE_DIR%;%PATH%"

if defined NODE_DIR (
  echo Ajout de Node au PATH utilisateur si besoin...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$d = '%NODE_DIR%'; $p = [Environment]::GetEnvironmentVariable('Path','User'); if ($p -notlike ('*' + $d.TrimEnd('\') + '*')) { [Environment]::SetEnvironmentVariable('Path', $d.TrimEnd('\') + ';' + $p, 'User'); Write-Host 'Node ajoute au PATH utilisateur.' }"
)

echo.
echo [1/2] Installation des dependances...
call "%NPM%" install --legacy-peer-deps --no-optional
if errorlevel 1 (
  echo Nouvelle tentative avec --force...
  call "%NPM%" install --legacy-peer-deps --force --no-optional
)
if errorlevel 1 (
  echo [ERREUR] npm install a echoue. Lancez npm-install.bat pour un install propre.
  pause
  exit /b 1
)

echo.
echo [2/2] Demarrage du serveur...
echo Ouvrez http://localhost:3000
echo.
call "%NPM%" run dev
pause
