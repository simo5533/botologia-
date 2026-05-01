# BoTooLogIA - Installation forcee (PowerShell) - utilise toujours le npm GLOBAL par chemin complet
# Usage: powershell -ExecutionPolicy Bypass -File scripts/install-deps.ps1

$ErrorActionPreference = "Continue"
$projectRoot = if ($PSScriptRoot) { Join-Path $PSScriptRoot ".." } else { $PWD }
Set-Location $projectRoot

$nodeDirs = @(
  "$env:ProgramFiles\nodejs",
  "${env:ProgramFiles(x86)}\nodejs",
  "$env:LOCALAPPDATA\Programs\node"
)
$npmCmd = $null
foreach ($d in $nodeDirs) {
  $n = Join-Path $d "npm.cmd"
  if (Test-Path $n) { $npmCmd = $n; break }
}
if (-not $npmCmd) {
  $w = Get-Command npm -ErrorAction SilentlyContinue
  if ($w) { $npmCmd = $w.Source }
}
if (-not $npmCmd -or -not (Test-Path $npmCmd)) {
  Write-Host "[ERREUR] Node.js/npm introuvable. Installez depuis https://nodejs.org" -ForegroundColor Red
  exit 1
}

$env:Path = (Split-Path $npmCmd -Parent) + ";" + $env:Path
Write-Host "Node: $(node -v) | npm: $npmCmd" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Cache npm..." -ForegroundColor Yellow
& $npmCmd cache clean --force 2>$null
Write-Host "[2/4] Suppression node_modules et package-lock.json..." -ForegroundColor Yellow
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }
Write-Host "[3/4] Installation (legacy-peer-deps, omit=optional)..." -ForegroundColor Yellow
& $npmCmd install --legacy-peer-deps --force
if ($LASTEXITCODE -ne 0) {
  Write-Host "Nouvelle tentative sans --force..." -ForegroundColor Yellow
  & $npmCmd install --legacy-peer-deps
}
if ($LASTEXITCODE -ne 0) {
  Write-Host "Derniere tentative (install standard)..." -ForegroundColor Yellow
  & $npmCmd install
}
if ($LASTEXITCODE -ne 0) { Write-Host "[ERREUR] Installation echouee." -ForegroundColor Red; exit 1 }

Write-Host "[4/5] Verification des paquets (verify-deps)..." -ForegroundColor Yellow
& node scripts/verify-deps.js
if ($LASTEXITCODE -ne 0) { Write-Host "[ERREUR] Des dependances manquent." -ForegroundColor Red; exit 1 }

Write-Host "[5/5] Build de verification..." -ForegroundColor Yellow
& $npmCmd run build
if ($LASTEXITCODE -ne 0) { Write-Host "[ATTENTION] Build echoue (voir ci-dessus)." -ForegroundColor Yellow } else { Write-Host "OK: build reussi." -ForegroundColor Green }

Write-Host ""
Write-Host "Environnement pret. Lancez: npm run dev" -ForegroundColor Green
exit 0
