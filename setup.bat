@echo off
REM Polycore CLI - Setup Script for Windows
REM This script installs all dependencies and sets up the development environment

echo =========================================
echo Polycore CLI - Development Setup
echo =========================================
echo.

REM Check Node.js installation
echo Checking Node.js version...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed
    exit /b 1
)

for /f "tokens=1 delims=v" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    exit /b 1
)
echo Dependencies installed
echo.

REM Build the project
echo Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed
    exit /b 1
)
echo Project built successfully
echo.

REM Link for local testing
echo Linking CLI for local testing...
call npm link
if %errorlevel% neq 0 (
    echo Error: Failed to link CLI
    exit /b 1
)
echo CLI linked successfully
echo.

REM Setup git hooks (if git is initialized)
if exist .git\ (
    echo Setting up git hooks...
    call npx husky install
    echo Git hooks configured
    echo.
)

REM Run tests
echo Running tests...
call npm test
if %errorlevel% neq 0 (
    echo Warning: Some tests failed. Please review and fix.
) else (
    echo All tests passed
)

echo.
echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo Next steps:
echo   1. Test the CLI: polycore --help
echo   2. Create a project: polycore init my-test-app
echo   3. Run tests with UI: npm run test:ui
echo   4. Check code quality: npm run lint
echo.
echo For development:
echo   - Make changes in src/
echo   - Rebuild: npm run build
echo   - Test changes: polycore init test-app
echo.
echo See DEVELOPMENT.md for more details.
echo.

pause
