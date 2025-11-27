#!/bin/bash

echo "Installing Node.js in WSL Ubuntu..."

# Update package list
sudo apt update

# Install Node.js and npm via NodeSource repository (LTS version)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
echo ""
echo "Node.js version:"
node --version
echo ""
echo "npm version:"
npm --version
echo ""
echo "Installation complete! Now run:"
echo "  npm install"
echo "  npm run build"
echo "  npm link"
