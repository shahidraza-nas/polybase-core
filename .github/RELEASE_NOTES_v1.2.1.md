# Release v1.2.1 🐛

## 🐛 Bug Fix Release

This is a **hotfix release** that addresses a bug in project initialization.

## 🔧 What's Fixed

### Package.json Name Issue

- **Fixed**: Generated projects now correctly use the project name specified in `polycore init <name>`
- **Previous behavior**: All projects had hardcoded `"name": "my-api-project"` in package.json
- **New behavior**: Project name matches the directory name you provide

**Example:**

```bash
polycore init memtrap

# Before v1.2.1:
# package.json had: "name": "my-api-project"

# After v1.2.1:
# package.json has: "name": "memtrap"  ✅
```

## 📦 Installation

```bash
# Update to latest version
npm install -g polycore-cli@1.2.1

# Or update existing installation
npm update -g polycore-cli

# Verify installation
polycore --version
# Should output: 1.2.1
```

## 🚀 What This Means for You

### If you're using v1.2.0

- Update to v1.2.1 to get correct package.json names in new projects
- Existing projects are not affected (you can manually update the name in package.json if needed)

### If you're new to Polycore

- Install v1.2.1 for the best experience
- All v1.2.0 features (authentication, barrel exports, TypeScript ESM) are included

## 🔄 Migration

No migration needed! This is a bug fix only.

If you generated a project with v1.2.0 and want to fix the name:

```bash
# Manually edit package.json
cd your-project
nano package.json  # or your preferred editor

# Change this:
"name": "my-api-project"

# To this:
"name": "your-project"  # Use your actual project name
```

## 📚 Full v1.2.x Features

All v1.2.0 features are included:

- ✅ Complete JWT authentication system in all templates
- ✅ Access & refresh token management
- ✅ Password hashing with bcryptjs
- ✅ Rate limiting on auth routes
- ✅ Barrel export pattern for clean imports
- ✅ TypeScript ESM configuration fixes
- ✅ Testing infrastructure with Vitest
- ✅ ESLint + Prettier code quality tools
- ✅ **NEW**: Correct package.json naming

## 📖 Documentation

- **README**: <https://github.com/shahidraza-nas/polybase-core#readme>
- **CHANGELOG**: <https://github.com/shahidraza-nas/polybase-core/blob/main/CHANGELOG.md>
- **v1.2.0 Release Notes**: <https://github.com/shahidraza-nas/polybase-core/releases/tag/v1.2.0>
- **npm Package**: <https://www.npmjs.com/package/polycore-cli>

## 🙏 Thank You

Thanks for reporting issues and helping make Polycore better!

---

**Previous Version**: <https://github.com/shahidraza-nas/polybase-core/compare/v1.2.0...v1.2.1>

**Contributors**: [@shahidraza-nas](https://github.com/shahidraza-nas)
