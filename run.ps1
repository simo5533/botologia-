# Lance le serveur de dev BoTooLogIA depuis la racine du workspace
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$project = Join-Path $root "BoTooLogIA"

if (-not (Test-Path (Join-Path $project "package.json"))) {
  Write-Host "[ERREUR] Dossier projet BoTooLogIA introuvable." -ForegroundColor Red
  exit 1
}

Set-Location $project

$nodePaths = @(
  "$env:ProgramFiles\nodejs",
  "${env:ProgramFiles(x86)}\nodejs",
  "$env:LOCALAPPDATA\Programs\node"
)
foreach ($p in $nodePaths) {
  if (Test-Path $p) { $env:Path = "$p;$env:Path"; break }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "[ERREUR] Node.js introuvable. Installez depuis https://nodejs.org (LTS)" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path "node_modules")) {
  Write-Host "Installation des dependances..." -ForegroundColor Yellow
  npm install --legacy-peer-deps
}
Write-Host ""
Write-Host "Demarrage: http://localhost:3000" -ForegroundColor Green
npm run dev
