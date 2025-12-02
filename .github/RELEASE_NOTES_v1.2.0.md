# Release v1.2.0 🎉

## 🎉 What's New

This is a **major feature release** that adds complete JWT authentication to all templates, implements barrel exports for cleaner code organization, fixes TypeScript ESM configuration issues, and establishes comprehensive testing infrastructure.

All 5 templates (sql-prisma, sql-sequelize, nosql, hybrid-prisma, hybrid-sequelize) now include production-ready authentication out of the box!

## ✨ Features

### 🔐 Complete JWT Authentication System

- **JWT Authentication Module** added to **ALL 5 templates**
  - Access tokens with 7-day expiration
  - Refresh tokens with 30-day expiration
  - Password hashing with bcryptjs (10 rounds)
  - Rate limiting on authentication routes (5 requests per 15 minutes)
  
- **Authentication Endpoints**
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `POST /api/auth/refresh` - Refresh access token
  - `POST /api/auth/logout` - Invalidate refresh token
  - `GET /api/auth/me` - Get current authenticated user

- **ORM-Specific Implementations**
  - Prisma implementation for sql-prisma and hybrid-prisma templates
  - Sequelize implementation for sql-sequelize and hybrid-sequelize templates
  - Mongoose implementation for nosql template

### 📦 Barrel Export Pattern

- **Clean Import Structure** with index.ts files
  - `src/core/errors/index.ts` - Error classes
  - `src/core/utils/index.ts` - Utility functions
  - `src/core/decorators/index.ts` - Decorators
  - `src/modules/auth/index.ts` - Auth module exports
  
- **Benefits**
  - Cleaner import statements
  - Easier refactoring
  - Better encapsulation
  - Improved IDE autocomplete

### 🧪 Testing Infrastructure

- **Vitest Test Framework** configured and ready
  - 11 unit tests (all passing)
  - Coverage reporting (80% target)
  - Interactive test UI (`npm run test:ui`)
  - Watch mode for development
  
- **Test Files**
  - `src/core/base.service.test.ts` - Service adapter tests
  - `src/utils/copy.test.ts` - Template copying tests
  - `src/cli/prompts.test.ts` - CLI prompt tests

### 🎨 Code Quality Tools

- **ESLint** - TypeScript linting with recommended rules
- **Prettier** - Consistent code formatting
- **Husky** - Git hooks (prepared for pre-commit checks)
- **Lint-staged** - Run linters on staged files

## 🔧 TypeScript Configuration Fixes

### Critical ESM Configuration Updates

- **Fixed `module` setting** - Changed from `ESNext` to `NodeNext` in all templates
- **Fixed `moduleResolution`** - Changed from `bundler` to `NodeNext` in all templates
- **Better IDE Navigation** - .js imports now properly resolve to .ts source files
- **Follows Official Standards** - Implements TypeScript's official ESM patterns

### Type Safety Improvements

- **JWT Type Assertions** - Fixed `jwt.sign()` with proper `SignOptions['expiresIn']` typing
- **Strict Mode Enabled** - All templates compile successfully with strict type checking
- **No Implicit Any** - Removed all implicit any types

## 🐛 Bug Fixes

- Fixed template copying to include auth module files
- Fixed TypeScript compilation errors in templates with strict mode
- Added missing utility classes (`ConflictError`, `validateRequest`, `ApiResponse.unauthorized`)
- Fixed auth middleware JWT verification error handling
- Removed accidental node_modules from template package

## 📝 Documentation

- **Updated README.md** with comprehensive v1.2.0 feature documentation
  - Authentication API endpoints with examples
  - Database modes with configuration examples
  - CLI commands reference
  - Project structure with auth module
  - Authentication middleware usage
  - Development setup instructions
  
- **Enhanced `.github/copilot-instructions.md`**
  - Added Git branching strategy
  - Added barrel export pattern explanation
  - Added TypeScript ESM configuration details
  - Added agent workflow instructions
  
- **Added BRANCHING.md** - Complete branching strategy guide
  - Branch structure and naming conventions
  - Workflow examples (features, bugfixes, releases, hotfixes)
  - Commit message conventions
  - Branch protection recommendations

- **Updated CHANGELOG.md** - Comprehensive v1.2.0 release notes

## 🔧 Internal Changes

- Implemented barrel exports in all 5 templates
- Added type definitions for database adapters (`src/core/adapters/types.ts`)
- Enhanced BaseService with proper TypeScript generics
- Updated all template tsconfig.json files for proper ESM support
- Improved error handling in auth services
- Added rate limiting middleware to all templates

## 💥 Breaking Changes

**None** - This is a backward-compatible release. Existing projects generated with v1.1.0 will continue to work without modifications.

## 📦 Installation

```bash
# Install globally
npm install -g polycore-cli@1.2.0

# Or update existing installation
npm update -g polycore-cli

# Verify installation
polycore --version
# Should output: 1.2.0
```

## 🚀 Quick Start

```bash
# Create a new project with authentication
polycore init my-awesome-api

# Choose your database mode
? Choose database type: SQL / NoSQL / Hybrid
? Choose SQL ORM: Prisma / Sequelize

# Start development
cd my-awesome-api
npm run dev

# Your API with auth is now running at http://localhost:3000
```

## 🎯 Migration Guide

If you have an existing project from v1.1.0 or earlier:

### Adding Authentication to Existing Projects

1. **Copy the auth module** from the appropriate template:
   - `templates/sql-prisma/src/modules/auth/` (for Prisma projects)
   - `templates/sql-sequelize/src/modules/auth/` (for Sequelize projects)
   - `templates/nosql/src/modules/auth/` (for Mongoose projects)

2. **Install dependencies**:
   ```bash
   npm install jsonwebtoken bcryptjs express-rate-limit
   npm install -D @types/jsonwebtoken @types/bcryptjs
   ```

3. **Update .env** with JWT configuration:
   ```bash
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Register auth routes** in `src/routes.ts`:
   ```typescript
   import { authRoutes } from './modules/auth/index.js';
   router.use('/auth', authRoutes);
   ```

5. **Add rate limiting** in `app.ts` (see template for implementation)

### Updating TypeScript Configuration

If you want the improved ESM configuration:

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

## 📊 Statistics

- **122 files changed**
- **11,609 insertions**
- **1,416 deletions**
- **11/11 tests passing**
- **5 templates updated**
- **Package size: 43.7 kB** (unpacked: 277.9 kB)

## 📚 Documentation

- **README**: https://github.com/shahidraza-nas/polybase-core#readme
- **CHANGELOG**: https://github.com/shahidraza-nas/polybase-core/blob/main/CHANGELOG.md
- **Contributing**: https://github.com/shahidraza-nas/polybase-core/blob/main/CONTRIBUTING.md
- **Branching**: https://github.com/shahidraza-nas/polybase-core/blob/main/BRANCHING.md
- **npm Package**: https://www.npmjs.com/package/polycore-cli

## 🙏 Acknowledgments

Thank you to everyone testing the beta versions and providing feedback!

Special thanks to:
- The TypeScript team for excellent ESM documentation
- The Vitest team for the amazing testing framework
- All contributors to Prisma, Sequelize, and Mongoose

## 🐛 Known Issues

None at this time. If you encounter any issues, please [report them](https://github.com/shahidraza-nas/polybase-core/issues).

## 🔮 What's Next (v1.3.0)

- [ ] Module generation command (`polycore generate module <name>`)
- [ ] Role-based access control (RBAC)
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] API documentation generation
- [ ] Docker support
- [ ] GitHub Actions CI/CD templates

---

**Full Changelog**: https://github.com/shahidraza-nas/polybase-core/compare/v1.0.2...v1.2.0

**Contributors**: [@shahidraza-nas](https://github.com/shahidraza-nas)

---

**Made with ❤️ by [Shahid Raza](https://github.com/shahidraza-nas)**

If you find this project helpful, please ⭐ the repository on GitHub!
