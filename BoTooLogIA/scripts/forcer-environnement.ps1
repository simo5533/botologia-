# BoTooLogIA - Forcer l'environnement de travail (Node/npm visibles, repertoire projet)
# Usage: . .\scripts\forcer-environnement.ps1   (point-source pour garder les variables dans le shell)

$projectRoot = $PSScriptRoot | ForEach-Object { if ($_) { Join-Path $_ ".." } else { $PWD } }
if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
  Write-Host "[ERREUR] Lancez ce script depuis le repertoire du projet (ou depuis scripts/)." -ForegroundColor Red
  return
}
Set-Location $projectRoot

$nodeDirs = @("$env:ProgramFiles\nodejs", "${env:ProgramFiles(x86)}\nodejs", "$env:LOCALAPPDATA\Programs\node")
foreach ($d in $nodeDirs) {
  if (Test-Path (Join-Path $d "node.exe")) {
    $env:Path = "$d;$env:Path"
    break
  }
}
$env:NODE_OPTIONS = "--no-warnings"
Write-Host "Projet: $projectRoot" -ForegroundColor Cyan
Write-Host "Node: $(node -v) | npm: $(npm -v)" -ForegroundColor Cyan
Write-Host "Pour forcer l'install: .\npm-install.bat  ou  powershell -ExecutionPolicy Bypass -File scripts/install-deps.ps1" -ForegroundColor Yellow
