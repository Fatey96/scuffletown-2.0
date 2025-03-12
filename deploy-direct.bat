@echo off
echo Starting direct Vercel deployment...
echo.

REM Install and use latest Vercel CLI directly with npx
echo Using npx to deploy directly...
npx vercel@latest --prod --yes --cwd . --token YOUR_VERCEL_TOKEN

echo Deployment attempt completed. 