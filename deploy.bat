@echo off
echo Starting Vercel deployment...
echo.

REM Run Next.js build
echo Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Build failed!
  exit /b 1
)
echo Build successful!
echo.

REM Deploy to Vercel
echo Deploying to Vercel...
call npx vercel deploy --prod --yes
if %ERRORLEVEL% NEQ 0 (
  echo Deployment failed!
  exit /b 1
)
echo Deployment complete! 