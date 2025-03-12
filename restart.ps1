# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Install dependencies if needed
Write-Host "Checking dependencies..." -ForegroundColor Cyan
npm install

# Build and start the application
Write-Host "Building and starting the application..." -ForegroundColor Cyan
npm run dev 