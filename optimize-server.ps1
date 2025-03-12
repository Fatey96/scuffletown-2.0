# Clear Next.js cache and temporary files
Write-Host "Clearing Next.js cache and temporary files..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Kill any running Node.js processes (optional - uncomment if needed)
# Write-Host "Stopping any running Node.js processes..." -ForegroundColor Yellow
# taskkill /f /im node.exe

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Cyan
npm cache clean --force

# Install dependencies with clean slate
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm ci

# Build and start the application
Write-Host "Building and starting the application with optimized settings..." -ForegroundColor Green
$env:NODE_ENV = "production"
npm run dev 