# Cloudflare Tunnel Setup Script for Windows
# Run this in PowerShell as Administrator

Write-Host "Installing Cloudflare Tunnel..." -ForegroundColor Green

# Create directory for cloudflared
$installDir = "C:\Program Files\cloudflared"
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force
}

# Download cloudflared
$downloadUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
$outputPath = "$installDir\cloudflared.exe"

Write-Host "Downloading from $downloadUrl..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $downloadUrl -OutFile $outputPath

# Add to PATH
$envPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($envPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$envPath;$installDir", "Machine")
    $env:Path = "$env:Path;$installDir"
}

Write-Host "✅ Cloudflare Tunnel installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Close and reopen PowerShell" -ForegroundColor White
Write-Host "2. Run: cloudflared tunnel login" -ForegroundColor White
Write-Host "3. Run: cloudflared tunnel create orasync" -ForegroundColor White
