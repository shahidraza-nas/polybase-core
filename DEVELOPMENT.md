# Development Testing Guide

## Setup for Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Initial Setup

1. **Clone and navigate to project**

   ```bash
   cd polybase-core
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npx typescript
   ```

   Or if typescript is installed globally:

   ```bash
   tsc
   ```

4. **Link for local testing**

   ```bash
   npm link
   ```

5. **Test the CLI**

   ```bash
   polycore --help
   polycore init test-project
   polycore doctor
   ```

### Development Workflow

**After making changes:**

```bash
npm run build
```

The changes will be immediately available since the package is linked.

### Unlink when done testing

```bash
npm unlink -g polycore
```

## Testing Generated Projects

```bash
# Create a test project
polycore init my-test-app

# Navigate and test
cd my-test-app
npm install
npm run dev
```

## Troubleshooting

### UNC Path Issues on Windows + WSL

If you encounter UNC path errors, try:

1. Clone to Windows filesystem directly (C:\projects\polybase-core)
2. Or use WSL terminal exclusively:

   ```bash
   wsl
   cd ~/workspace/polybase-core
   npm install
   npm run build
   npm link
   ```

### TypeScript not compiling

Ensure TypeScript is in node_modules:

```bash
ls node_modules/typescript
```

If missing:

```bash
npm install
```
