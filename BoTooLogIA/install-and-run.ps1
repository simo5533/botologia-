# BoTooLogIA - Installation et lancement (PowerShell)
# Force l'ajout des chemins Node.js courants au PATH puis lance npm install et npm run dev.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$nodePaths = @(
  "$env:ProgramFiles\nodejs",
  "${env:ProgramFiles(x86)}\nodejs",
  "$env:LOCALAPPDATA\Programs\node"
)
foreach ($p in $nodePaths) {
  if (Test-Path $p) {
    $env:Path = "$p;$env:Path"
    break
  }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "[ERREUR] Node.js introuvable. Installez-le depuis https://nodejs.org (LTS)" -ForegroundColor Red
  exit 1
}

Write-Host "Node: $(node -v) | npm: $(npm -v)" -ForegroundColor Cyan
Write-Host "Installation des dependances..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host ""
Write-Host "Demarrage du serveur. Ouvrez http://localhost:3000" -ForegroundColor Green
npm run dev
