@echo off
title BoTooLogIA - PowerShell avec Node
cd /d "%~dp0"
set "NODE_DIR="
if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_DIR=%ProgramFiles%\nodejs"
if not defined NODE_DIR if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE_DIR=%ProgramFiles(x86)%\nodejs"
if not defined NODE_DIR if exist "%LOCALAPPDATA%\Programs\node\node.exe" set "NODE_DIR=%LOCALAPPDATA%\Programs\node"
if not defined NODE_DIR (
  echo Node.js introuvable. Installez-le depuis https://nodejs.org
  echo Voir: docs\NPM_POWERSHELL_WINDOWS.md
  pause
  exit /b 1
)
set "PATH=%NODE_DIR%;%PATH%"
powershell -NoExit -Command "Write-Host 'Node:' -NoNewline; node -v; Write-Host ' npm:' -NoNewline; npm -v; Write-Host ''; Write-Host 'Lancer: npm install puis npm run dev' -ForegroundColor Green; Set-Location '%~dp0'"
