@echo off
title BoTooLogIA - Terminal avec Node
set "NODE_DIR="
if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_DIR=%ProgramFiles%\nodejs"
if not defined NODE_DIR if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE_DIR=%ProgramFiles(x86)%\nodejs"
if not defined NODE_DIR if exist "%LOCALAPPDATA%\Programs\node\node.exe" set "NODE_DIR=%LOCALAPPDATA%\Programs\node"
if not defined NODE_DIR (
  echo Node.js introuvable dans les emplacements standards.
  echo Installez Node.js LTS depuis https://nodejs.org
  echo Voir aussi: docs\NPM_NON_RECONNU.md
  pause
  exit /b 1
)
set "PATH=%NODE_DIR%;%PATH%"
cd /d "%~dp0"
echo Node: %NODE_DIR%
node -v
npm -v
echo.
echo Vous pouvez maintenant lancer: npm install
echo Puis: npm run dev
echo.
cmd /k
