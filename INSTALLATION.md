# Installation Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional, for version control)

## Installation

### Global Installation (Recommended)

Install Polycore CLI globally to use it anywhere:

```bash
npm install -g polycore-cli
```

Verify installation:

```bash
polycore --version
```

### Local Installation (for development)

Clone the repository and link locally:

```bash
git clone https://github.com/shahidraza-nas/polybase-core.git
cd polybase-core
npm install
npm run build
npm link
```

Test the CLI:

```bash
polycore --help
```

## Post-Installation

### Install Dependencies

After installing the CLI, you need to install dependencies in your system:

```bash
# Install Vitest and dev dependencies
npm install
```

### Run Tests

```bash
# Run tests
npm test

# Run tests with UI
npm test:ui

# Generate coverage report
npm test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Uninstallation

### Global Uninstallation

```bash
npm uninstall -g polycore-cli
```

### Local Uninstallation

```bash
npm unlink -g polycore-cli
```

## Troubleshooting

### Command not found

If `polycore` command is not found after global installation:

1. Check npm global bin directory:

   ```bash
   npm config get prefix
   ```

2. Add to PATH (Linux/Mac):

   ```bash
   export PATH=$PATH:$(npm config get prefix)/bin
   ```

3. Add to PATH (Windows):
   - Add `%APPDATA%\npm` to your PATH environment variable

### Permission errors (Linux/Mac)

If you encounter permission errors:

```bash
sudo npm install -g polycore-cli
```

Or configure npm to use a different directory:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### WSL + Windows issues

If using WSL with Windows:

1. Clone to WSL filesystem (`~/workspace/`), not Windows mount (`/mnt/c/`)
2. Run all commands in WSL terminal
3. Ensure Node.js is installed in WSL, not just Windows

## Next Steps

After installation, create your first project:

```bash
polycore init my-api
cd my-api
npm install
npm run dev
```

See [README.md](./README.md) for usage documentation.
