# Demarrage complet BoTooLogIA : PostgreSQL + migrations + seed + app
# Usage: .\scripts\demarrer-complet.ps1
# Ou: npm run dev:full (si le script est lie)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot + "\.."
Set-Location $root

Write-Host ""
Write-Host "=== BoTooLogIA - Demarrage complet ===" -ForegroundColor Cyan
Write-Host ""

# 1. Docker disponible ?
$dockerOk = $false
try {
  $null = docker info 2>&1
  if ($LASTEXITCODE -eq 0) { $dockerOk = $true }
} catch { }

if (-not $dockerOk) {
  Write-Host "Docker n'est pas demarre." -ForegroundColor Yellow
  Write-Host "  1. Ouvrez Docker Desktop et attendez qu'il soit pret" -ForegroundColor White
  Write-Host "  2. Ou installez PostgreSQL en local et configurez DATABASE_URL dans .env" -ForegroundColor White
  Write-Host "  3. Relancez ce script ou : npm run db:push ; npm run db:seed ; npm run db:seed:admins ; npm run dev" -ForegroundColor White
  Write-Host ""
  exit 1
}

# 2. Demarrer PostgreSQL (compose principal ou standalone)
$envFile = Join-Path $root ".env"
if (Test-Path $envFile) {
  docker compose up -d
} else {
  docker compose -f docker-compose.standalone.yml up -d
}
if ($LASTEXITCODE -ne 0) {
  Write-Host "Erreur: docker compose a echoue." -ForegroundColor Red
  exit 1
}
Write-Host "PostgreSQL (Docker) demarre. Attente 8 s..." -ForegroundColor Green
Start-Sleep -Seconds 8

# 3. Appliquer le schema
Write-Host "Application du schema Prisma (db push)..." -ForegroundColor Cyan
npx prisma db push --accept-data-loss 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Erreur db push. Verifiez DATABASE_URL dans .env." -ForegroundColor Red
  exit 1
}

# 4. Generer le client Prisma
npx prisma generate
Write-Host "Client Prisma genere." -ForegroundColor Green

# 5. Seed
Write-Host "Seed des donnees de base..." -ForegroundColor Cyan
npm run db:seed 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "Attention: db:seed a echoue (optionnel)." -ForegroundColor Yellow }

Write-Host "Seed des admins 2FA..." -ForegroundColor Cyan
npm run db:seed:admins 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "Attention: db:seed:admins a echoue (optionnel)." -ForegroundColor Yellow }

Write-Host ""
Write-Host "Demarrage de l'application (npm run dev)..." -ForegroundColor Cyan
Write-Host "Ouvrez http://localhost:3000 quand 'Ready' s'affiche." -ForegroundColor White
Write-Host ""
npm run dev
