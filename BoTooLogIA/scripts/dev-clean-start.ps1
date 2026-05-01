# Demarre le serveur de dev avec un cache propre (evite 404 sur les chunks)
# Usage: .\scripts\dev-clean-start.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot + "\.."
Set-Location $root

if (Test-Path ".next") {
  Remove-Item -Recurse -Force ".next"
  Write-Host "Cache .next supprime."
}
Write-Host "Lancement: npm run dev"
Write-Host "Attendez 'Ready' ou 'Compiled' avant d'ouvrir http://localhost:3000"
Write-Host "Puis rafraichissement force (Ctrl+Shift+R) si la page est blanche."
Write-Host ""
npm run dev
