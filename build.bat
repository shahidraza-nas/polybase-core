@echo off
cd /d "%~dp0"
call npx tsc --project tsconfig.json
if %errorlevel% neq 0 (
    echo Build failed with error code %errorlevel%
    exit /b %errorlevel%
)
echo Build completed successfully!
