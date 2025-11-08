$ErrorActionPreference = "Stop"

Write-Host "Building Next.js application..." -ForegroundColor Green

$env:NEXT_PRIVATE_SKIP_WEBPACK_BUILD = "0"
$env:NODE_ENV = "production"

try {
    Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
    
    Write-Host "Building Next.js..." -ForegroundColor Yellow
    $env:SKIP_ENV_VALIDATION = "true"
    npx next build
    
    Write-Host "Build completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Build failed: $_" -ForegroundColor Red
    exit 1
}

