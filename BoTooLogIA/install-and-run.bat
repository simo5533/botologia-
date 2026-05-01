@echo off
cd /d "%~dp0"
set "NPM="
where npm >nul 2>&1 && set NPM=npm
if not defined NPM if exist "%ProgramFiles%\nodejs\npm.cmd" set "NPM=%ProgramFiles%\nodejs\npm.cmd"
if not defined NPM if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" set "NPM=%ProgramFiles(x86)%\nodejs\npm.cmd"
if not defined NPM if exist "%LOCALAPPDATA%\Programs\node\npm.cmd" set "NPM=%LOCALAPPDATA%\Programs\node\npm.cmd"
if not defined NPM (
  echo [ERREUR] Node.js/npm introuvable.
  echo Installez Node.js LTS depuis https://nodejs.org ^(option "Add to PATH"^)
  echo Ou lancez "ouvrir-terminal-avec-node.bat" puis: npm install ^& npm run dev
  echo Guide: docs\NPM_NON_RECONNU.md
  pause
  exit /b 1
)
echo Installation des dependances (npm install)...
call "%NPM%" install
if errorlevel 1 (
  echo [ERREUR] npm install a echoue. Verifiez votre connexion et les droits sur le dossier.
  pause
  exit /b 1
)
echo.
echo Demarrage du serveur (npm run dev). Ouvrez http://localhost:3000
echo.
call "%NPM%" run dev
pause
