@echo off
cd /d "%~dp0"
title BoTooLogIA - Serveur de dev
if not exist "BoTooLogIA\package.json" (
  echo [ERREUR] Dossier projet BoTooLogIA introuvable.
  pause
  exit /b 1
)
cd BoTooLogIA
set "NPM=npm"
where npm >nul 2>&1 || set "NPM=%ProgramFiles%\nodejs\npm.cmd"
if not exist "%NPM%" set "NPM=%ProgramFiles(x86)%\nodejs\npm.cmd"
if not exist "%NPM%" set "NPM=%LOCALAPPDATA%\Programs\node\npm.cmd"
if not exist "%NPM%" (
  echo [ERREUR] Node.js/npm introuvable. Installez depuis https://nodejs.org
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Installation des dependances...
  call "%NPM%" install --legacy-peer-deps
)
echo.
echo Demarrage: http://localhost:3000
echo.
call "%NPM%" run dev
pause
