# Copie la vidéo "fond carte service" vers public/videos (toutes les cartes l'utilisent)
$videosDir = Join-Path $PSScriptRoot "..\public\videos"
$userSrc = "C:\Users\hassa\Pictures\Screenshots\fond carte service.mp4"
$dest = Join-Path $videosDir "fond-carte-service.mp4"
if (-not (Test-Path $userSrc)) {
  Write-Warning "Vidéo introuvable : $userSrc"
  exit 1
}
Copy-Item -Path $userSrc -Destination $dest -Force
Write-Host "OK: fond-carte-service.mp4 mis a jour depuis vos captures."
