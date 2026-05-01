@echo off
cd /d "%~dp0"
set "NPM="
set "NODE_DIR="

rem Toujours utiliser le chemin COMPLET vers npm.cmd (evite "Cannot find module ... node_modules\npm\bin\npm-cli.js" apres suppression de node_modules)
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
if not defined NPM for /f "delims=" %%i in ('where npm.cmd 2^>nul') do (
  set "NPM=%%i"
  set "NODE_DIR=%%~dpi"
  goto :npm_found
)
if not defined NPM for /f "delims=" %%i in ('where npm 2^>nul') do (
  set "NPM=%%i"
  set "NODE_DIR=%%~dpi"
  goto :npm_found
)
:npm_found
if not defined NPM (
  echo [ERREUR] Node.js/npm introuvable. Installez depuis https://nodejs.org
  pause
  exit /b 1
)
if defined NODE_DIR set "PATH=%NODE_DIR%;%PATH%"

echo === Installation forcee des dependances BoTooLogIA ===
echo Utilisation de: %NPM%
echo.

echo [1/4] Nettoyage du cache npm...
call "%NPM%" cache clean --force 2>nul
echo.

echo [2/4] Suppression de node_modules et package-lock (install propre)...
if exist node_modules rmdir /s /q node_modules 2>nul
if exist package-lock.json del /q package-lock.json 2>nul
echo.

echo [3/4] Installation (legacy-peer-deps)...
call "%NPM%" install --legacy-peer-deps
if errorlevel 1 (
  echo.
  echo Premier essai echoue. Nouvelle tentative avec --force...
  call "%NPM%" install --legacy-peer-deps --force
)
if errorlevel 1 (
  echo.
  echo Deuxieme essai echoue. Derniere tentative (install standard)...
  call "%NPM%" install
)
if errorlevel 1 (
  echo.
  echo [ERREUR] L installation a echoue. Connexion internet ? Droits en ecriture ?
  pause
  exit /b 1
)

echo.
echo [4/4] Verification des paquets...
if exist node_modules\next (
  echo OK: next installe.
) else (
  echo ATTENTION: next manquant. Relancez ce script.
)
echo.
echo === Installation terminee. Lancez: npm run dev ===
if "%CI%"=="" if "%CURSOR%"=="" pause
