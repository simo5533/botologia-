# Ajoute Node.js au PATH de la session PowerShell en cours (sans modifier le PATH Windows).
# Usage: . .\scripts\fix-path-current-session.ps1
# Puis: npm install ; npm run dev

$nodeDirs = @(
  "$env:ProgramFiles\nodejs",
  "${env:ProgramFiles(x86)}\nodejs",
  "$env:LOCALAPPDATA\Programs\node"
)
foreach ($d in $nodeDirs) {
  $npm = Join-Path $d "npm.cmd"
  if (Test-Path $npm) {
    $env:Path = "$d;$env:Path"
    Write-Host "PATH mis a jour pour cette session (Node: $d)" -ForegroundColor Green
    Write-Host "node -v: $(& (Join-Path $d 'node.exe') -v)"
    Write-Host "npm -v: $(npm -v)"
    return
  }
}
Write-Host "Node.js non trouve. Installez-le depuis https://nodejs.org" -ForegroundColor Red
