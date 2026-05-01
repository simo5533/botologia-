# Copie la vidéo "carte service animé.mp4" du Bureau vers public/videos/carte-service.mp4
# Usage : powershell -ExecutionPolicy Bypass -File scripts/copy-video-service.ps1

$desktop = [Environment]::GetFolderPath("Desktop")
$destDir = Join-Path $PSScriptRoot "..\public\videos"
$destFile = Join-Path $destDir "carte-service.mp4"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

# Essayer plusieurs noms possibles (accent, encoding)
$possibleNames = @(
    "carte service animé.mp4",
    "carte service anime.mp4",
    "carte service animé.MP4",
    "carte service anime.MP4"
)

$sourceFile = $null
foreach ($name in $possibleNames) {
    $path = Join-Path $desktop $name
    if (Test-Path -LiteralPath $path) {
        $sourceFile = $path
        break
    }
}

if (-not $sourceFile) {
    Write-Host "Fichier introuvable sur le Bureau. Recherche de tout .mp4..."
    Get-ChildItem $desktop -Filter "*.mp4" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "  Trouve: $($_.Name)"
    }
    Write-Host ""
    Write-Host "Copiez manuellement votre fichier vers: $destFile"
    exit 1
}

Copy-Item -LiteralPath $sourceFile -Destination $destFile -Force
Write-Host "OK: Vidéo copiée vers public/videos/carte-service.mp4"
Get-Item $destFile | Select-Object Name, @{N='Size (Ko)';E={[math]::Round($_.Length/1KB,2)}}
