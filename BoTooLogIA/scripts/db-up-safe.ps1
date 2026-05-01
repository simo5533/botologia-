# Demarre PostgreSQL via Docker si disponible ; sinon affiche les alternatives
# Usage: .\scripts\db-up-safe.ps1

$ErrorActionPreference = "SilentlyContinue"
$root = $PSScriptRoot + "\.."
Set-Location $root

try {
  $null = docker info 2>&1
  if ($LASTEXITCODE -ne 0) { throw "Docker non disponible" }
} catch {
  Write-Host ""
  Write-Host "Docker n'est pas demarre ou n'est pas installe." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Option A - Demarrer Docker Desktop:" -ForegroundColor Cyan
  Write-Host "  1. Ouvrez Docker Desktop depuis le menu Demarrer"
  Write-Host "  2. Attendez que l'icone soit prete"
  Write-Host "  3. Relancez: npm run db:up"
  Write-Host ""
  Write-Host "Option B - PostgreSQL installe sur la machine:" -ForegroundColor Cyan
  Write-Host "  1. Creer une base 'botoologia' et un utilisateur (ex: user/root1)"
  Write-Host "  2. Verifier que .env contient DATABASE_URL pointant vers cette instance"
  Write-Host "  3. Lancer: npm run db:push  puis  npm run db:seed"
  Write-Host ""
  exit 1
}

docker compose up -d
if ($LASTEXITCODE -ne 0) {
  Write-Host "Erreur docker compose. Verifiez que Docker Desktop est bien demarre." -ForegroundColor Red
  exit 1
}
Write-Host "Conteneur PostgreSQL demarre. Attendez quelques secondes puis: npm run db:push && npm run db:seed"
