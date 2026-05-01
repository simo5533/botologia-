# BoTooLogIA - Diagnostic Node.js / npm pour PowerShell
# Execution: powershell -ExecutionPolicy Bypass -File scripts\diagnose-node.ps1

$ErrorActionPreference = "Continue"
Write-Host "=== Diagnostic Node.js / npm (PowerShell) ===" -ForegroundColor Cyan
Write-Host ""

# 1. Node dans PATH ?
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if ($nodeCmd) {
  Write-Host "[OK] node trouve dans PATH: $($nodeCmd.Source)" -ForegroundColor Green
} else {
  Write-Host "[MANQUANT] node non trouve dans PATH" -ForegroundColor Red
}
if ($npmCmd) {
  Write-Host "[OK] npm trouve dans PATH: $($npmCmd.Source)" -ForegroundColor Green
} else {
  Write-Host "[MANQUANT] npm non trouve dans PATH" -ForegroundColor Red
}
Write-Host ""

# 2. Emplacements standards Windows
$paths = @(
  "$env:ProgramFiles\nodejs",
  "${env:ProgramFiles(x86)}\nodejs",
  "$env:LOCALAPPDATA\Programs\node",
  "$env:APPDATA\npm"
)
Write-Host "--- Emplacements Node.js standards ---" -ForegroundColor Yellow
foreach ($p in $paths) {
  $nodeExe = Join-Path $p "node.exe"
  $npmCmdPath = Join-Path $p "npm.cmd"
  if (Test-Path $nodeExe) {
    Write-Host "[TROUVE] $p" -ForegroundColor Green
    $v = & $nodeExe -v 2>$null
    if ($v) { Write-Host "       node -v: $v" }
  } elseif (Test-Path $p) {
    Write-Host "[DOSSIER SANS node.exe] $p" -ForegroundColor DarkYellow
  }
}
Write-Host ""

# 3. PATH utilisateur et systeme
Write-Host "--- PATH (extrait) ---" -ForegroundColor Yellow
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$hasNodeInUser = $userPath -and $userPath -match "nodejs|node"
$hasNodeInMachine = $machinePath -and $machinePath -match "nodejs|node"
Write-Host "Variable Path (User) contient 'node': $hasNodeInUser"
Write-Host "Variable Path (Machine) contient 'node': $hasNodeInMachine"
$pathParts = $env:Path -split ";"
$nodePaths = $pathParts | Where-Object { $_ -match "node" }
if ($nodePaths) {
  Write-Host "Entrees contenant 'node' dans PATH actuel:" -ForegroundColor Cyan
  $nodePaths | ForEach-Object { Write-Host "  $_" }
} else {
  Write-Host "Aucune entree 'node' dans le PATH de cette session." -ForegroundColor Red
}
Write-Host ""

# 4. Execution policy
Write-Host "--- PowerShell ---" -ForegroundColor Yellow
$policy = Get-ExecutionPolicy -Scope CurrentUser -ErrorAction SilentlyContinue
Write-Host "ExecutionPolicy (CurrentUser): $policy"
Write-Host ""

# 5. Recommandations
Write-Host "--- Recommandations ---" -ForegroundColor Cyan
if (-not $npmCmd) {
  $found = $false
  foreach ($p in @("$env:ProgramFiles\nodejs\npm.cmd", "${env:ProgramFiles(x86)}\nodejs\npm.cmd", "$env:LOCALAPPDATA\Programs\node\npm.cmd")) {
    if (Test-Path $p) {
      Write-Host "Node est installe ici: $(Split-Path $p -Parent)"
      Write-Host "Pour cette session uniquement, executez:"
      Write-Host "  `$env:Path = `"$(Split-Path $p -Parent);`$env:Path`""
      Write-Host "Puis: npm install"
      $found = $true
      break
    }
  }
  if (-not $found) {
    Write-Host "Node.js ne semble pas installe. Installez-le depuis https://nodejs.org (LTS)."
    Write-Host "Cochez 'Add to PATH' lors de l'installation."
  }
} else {
  Write-Host "node -v: $(node -v)"
  Write-Host "npm -v: $(npm -v)"
}
Write-Host ""
Write-Host "Guide complet: docs\NPM_POWERSHELL_WINDOWS.md" -ForegroundColor Cyan
