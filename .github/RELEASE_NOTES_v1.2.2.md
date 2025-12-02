# Release v1.2.2 🔧

## 🔧 Patch Release

This is a **patch release** that fixes the CLI version display.

## 🐛 What's Fixed

### CLI Version Display Issue

- **Fixed**: `polycore --version` now shows the correct version dynamically from package.json
- **Previous behavior**: Always showed hardcoded version `1.1.0`
- **New behavior**: Shows actual installed version (e.g., `1.2.2`)

**Technical Details:**
- Version is now read dynamically using `createRequire` and `import.meta.url`
- No more hardcoded version strings in source code
- Future version bumps will automatically reflect in CLI output

**Example:**
```bash
# Before v1.2.2:
polycore --version
# Output: 1.1.0  ❌ (wrong)

# After v1.2.2:
polycore --version
# Output: 1.2.2  ✅ (correct)
```

## 📦 Installation

```bash
# Update to latest version
npm install -g polycore-cli@1.2.2

# Or update existing installation
npm update -g polycore-cli

# Verify installation
polycore --version
# Should output: 1.2.2
```

## 🔄 Migration

No migration needed! This is a bug fix only. Simply update to v1.2.2.

## 📚 Full v1.2.x Features

All previous v1.2.x features are included:

- ✅ Complete JWT authentication system in all templates (v1.2.0)
- ✅ Access & refresh token management (v1.2.0)
- ✅ Password hashing with bcryptjs (v1.2.0)
- ✅ Rate limiting on auth routes (v1.2.0)
- ✅ Barrel export pattern for clean imports (v1.2.0)
- ✅ TypeScript ESM configuration fixes (v1.2.0)
- ✅ Testing infrastructure with Vitest (v1.2.0)
- ✅ ESLint + Prettier code quality tools (v1.2.0)
- ✅ Correct package.json naming (v1.2.1)
- ✅ **NEW**: Dynamic version display (v1.2.2)

## 📖 Documentation

- **README**: https://github.com/shahidraza-nas/polybase-core#readme
- **CHANGELOG**: https://github.com/shahidraza-nas/polybase-core/blob/main/CHANGELOG.md
- **v1.2.0 Release**: https://github.com/shahidraza-nas/polybase-core/releases/tag/v1.2.0
- **v1.2.1 Release**: https://github.com/shahidraza-nas/polybase-core/releases/tag/v1.2.1
- **npm Package**: https://www.npmjs.com/package/polycore-cli

## 🙏 Thank You

Thanks for using Polycore CLI!

---

**Changes**: https://github.com/shahidraza-nas/polybase-core/compare/v1.2.1...v1.2.2

**Contributors**: [@shahidraza-nas](https://github.com/shahidraza-nas)
