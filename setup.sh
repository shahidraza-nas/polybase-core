#!/bin/bash

# Polycore CLI - Setup Script
# This script installs all dependencies and sets up the development environment

set -e  # Exit on error

echo "========================================="
echo "Polycore CLI - Development Setup"
echo "========================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Build the project
echo "Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Project built successfully"
echo ""

# Link for local testing
echo "Linking CLI for local testing..."
npm link

if [ $? -ne 0 ]; then
    echo "❌ Failed to link CLI"
    exit 1
fi

echo "✅ CLI linked successfully"
echo ""

# Setup git hooks (if git is initialized)
if [ -d .git ]; then
    echo "Setting up git hooks..."
    npx husky install
    echo "✅ Git hooks configured"
    echo ""
fi

# Run tests
echo "Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed. Please review and fix."
else
    echo "✅ All tests passed"
fi

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Test the CLI: polycore --help"
echo "  2. Create a project: polycore init my-test-app"
echo "  3. Run tests with UI: npm run test:ui"
echo "  4. Check code quality: npm run lint"
echo ""
echo "For development:"
echo "  - Make changes in src/"
echo "  - Rebuild: npm run build"
echo "  - Test changes: polycore init test-app"
echo ""
echo "See DEVELOPMENT.md for more details."
echo ""
