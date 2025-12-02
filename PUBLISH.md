# Publishing Polycore to npm

## Pre-Publish Checklist

### ✅ Completed Tasks

1. **Package Configuration**
   - ✅ Name: `polycore`
   - ✅ Version: `1.0.0`
   - ✅ Description: Backend boilerplate generator
   - ✅ Keywords: boilerplate, generator, cli, typescript, prisma, sequelize, mongoose
   - ⚠️  Author: Update with your name
   - ⚠️  Repository: Update with your GitHub repo URL
   - ✅ License: MIT
   - ✅ Files: dist/, bin/, templates/
   - ✅ Engines: Node >=18.0.0

2. **Templates**
   - ✅ sql-prisma: Complete with User CRUD
   - ✅ sql-sequelize: Complete with User CRUD
   - ✅ nosql: Complete with User CRUD
   - ✅ hybrid-prisma: Complete with dual database support
   - ✅ hybrid-sequelize: Complete with dual database support
   - ✅ All templates have .env.example
   - ✅ All templates have comprehensive README.md
   - ✅ All templates have proper TypeScript config

3. **CLI Commands**
   - ✅ `polycore init <name>` - Working
   - ✅ `polycore doctor` - Working
   - ⚠️  `polycore generate` - Not implemented (marked as coming soon)

4. **Build & Distribution**
   - ✅ TypeScript compiles successfully
   - ✅ .npmignore excludes dev files
   - ✅ Package includes 157 files (dist/, bin/, templates/)
   - ✅ No source files in package (only compiled)

5. **Documentation**
   - ✅ README.md updated
   - ✅ DEVELOPMENT.md available
   - ✅ .github/copilot-instructions.md for AI assistance

## Before Publishing

### 1. Update package.json

Replace placeholder values:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/polycore.git"
  },
  "homepage": "https://github.com/yourusername/polycore#readme",
  "bugs": {
    "url": "https://github.com/yourusername/polycore/issues"
  }
}
```

### 2. Create GitHub Repository

```bash
# Initialize if not done
git init
git add .
git commit -m "Initial release v1.0.0"

# Add remote
git remote add origin https://github.com/yourusername/polycore.git
git branch -M main
git push -u origin main
```

### 3. Test Package Locally

```bash
# Build
npm run build

# Test locally
npm link

# Create test projects
polycore init test-sql-prisma
polycore init test-nosql
polycore init test-hybrid

# Unlink when done
npm unlink -g polycore
```

### 4. Version & Tag

```bash
# First release
npm version 1.0.0 -m "Release v1.0.0"

# Or for updates
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0
npm version major  # 1.1.0 -> 2.0.0
```

### 5. Publish to npm

```bash
# Login to npm (first time only)
npm login

# Verify package contents
npm pack --dry-run

# Publish (public package)
npm publish --access public

# Or publish with tag for beta
npm publish --tag beta
```

### 6. Post-Publish

```bash
# Push tags to GitHub
git push --tags

# Test installation
npm install -g polycore

# Create a test project
polycore init my-test-api
cd my-test-api
npm install
npm run dev
```

## Verification Commands

```bash
# Check what will be published
npm pack --dry-run

# Test installation from tarball
npm pack
npm install -g polycore-1.0.0.tgz

# View package info
npm view polycore
npm info polycore
```

## Common Issues

### Issue: Package name already taken

Solution: Choose a different name or use scoped package `@yourname/polycore`

### Issue: Permission denied

Solution: Run `npm login` first and ensure you have publish rights

### Issue: 403 Forbidden

Solution: Package might exist. Use `npm view polycore` to check

## Update Strategy

For future updates:

1. Make changes
2. Run tests
3. Update version: `npm version patch/minor/major`
4. Build: `npm run build`
5. Publish: `npm publish`
6. Push: `git push && git push --tags`

## Scoped Package Alternative

If "polycore" is taken, use scoped package:

```json
{
  "name": "@yourusername/polycore"
}
```

Users install with:

```bash
npm install -g @yourusername/polycore
```

## Ready to Publish

Your package is ready for npm. Just update author/repository info and run:

```bash
npm publish --access public
```

🎉 Congratulations on your npm package!
