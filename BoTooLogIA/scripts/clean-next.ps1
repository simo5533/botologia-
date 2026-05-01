# Supprime le cache .next pour corriger 404 / build-manifest (_error) intermittents.
# Usage : npm run clean

$nextDir = Join-Path $PSScriptRoot "..\.next"
if (Test-Path $nextDir) {
    Remove-Item -Recurse -Force $nextDir
    Write-Host "Cache .next supprime. Relancez: npm run dev"
} else {
    Write-Host "Aucun dossier .next a supprimer."
}
