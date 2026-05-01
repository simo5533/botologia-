# Redémarre PostgreSQL avec docker-compose.standalone.yml (port 5433, postgres/postgres)
# puis applique le schéma Prisma (db:push).
# Usage: npm run db:restart-standalone  ou  .\scripts\db-restart-standalone-and-push.ps1

$ErrorActionPreference = "Stop"
$root = if ($PSScriptRoot) { Join-Path $PSScriptRoot ".." } else { Get-Location }
Set-Location $root

Write-Host "Verification Docker..." -ForegroundColor Cyan
try {
  $null = docker info 2>&1
} catch {
  Write-Host "Docker non disponible. Lancez Docker Desktop puis reessayez." -ForegroundColor Red
  exit 1
}

Write-Host "Arret du conteneur et suppression du volume (base propre)..." -ForegroundColor Cyan
$ErrorActionPreference = "Continue"
docker compose -f docker-compose.standalone.yml down -v 2>&1 | Out-Null
$ErrorActionPreference = "Stop"

Write-Host "Demarrage PostgreSQL standalone (port 5433, postgres/postgres)..." -ForegroundColor Cyan
docker compose -f docker-compose.standalone.yml up -d
if ($LASTEXITCODE -ne 0) {
  Write-Host "Erreur au demarrage du conteneur." -ForegroundColor Red
  exit 1
}

Write-Host "Attente 10 s que PostgreSQL soit pret..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host "Application du schema Prisma (db:push)..." -ForegroundColor Cyan
$env:DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:5433/botoologia?schema=public&sslmode=disable"
npm run db:push
if ($LASTEXITCODE -ne 0) {
  Write-Host "db:push a echoue. Verifiez que .env contient: DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/botoologia?schema=public" -ForegroundColor Yellow
  exit 1
}

Write-Host "Termine. Base a jour sur 127.0.0.1:5433." -ForegroundColor Green
