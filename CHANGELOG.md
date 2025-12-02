# Changelog

All notable changes to Polycore CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.1] - 2025-12-02

### Fixed

- Fixed package.json name not being updated with actual project name during `polycore init <name>`
- Generated projects now correctly use the specified project name instead of hardcoded "my-api-project"

## [1.2.0] - 2025-12-02

### Added

- **Authentication Module in ALL Templates**: Complete JWT-based auth system
  - Authentication endpoints: register, login, refresh, logout, /me
  - JWT with access tokens (7d) and refresh tokens (30d)
  - Password hashing with bcryptjs (10 rounds)
  - Rate limiting on auth routes (5 requests per 15 minutes)
  - ORM-specific implementations for Prisma, Sequelize, and Mongoose
  - Implemented in all 5 templates (sql-prisma, sql-sequelize, nosql, hybrid-prisma, hybrid-sequelize)
- **Barrel Export Pattern**: Clean import structure
  - Index.ts files in all key directories (errors, utils, decorators, modules)
  - Simplified imports: `from '../../core/errors/index.js'`
  - Better encapsulation and easier refactoring
  - Applied across all 5 templates
- **Testing Infrastructure**: Vitest test framework with coverage reporting
  - Unit tests for `BaseService`, `copyTemplate` utility, prompts
  - Test coverage targets set to 80%
  - Vitest UI for interactive test debugging
  - All 11 tests passing
- **ESLint & Prettier**: Code quality and formatting tools
  - TypeScript ESLint with recommended rules
  - Prettier for consistent code formatting
  - Pre-commit hooks with Husky (prepared)
  - Lint-staged for efficient pre-commit linting
- **TypeScript Strict Mode**: Enhanced type safety
  - Enabled `strict: true` and additional strict checks
  - `noUncheckedIndexedAccess` for safer array/object access
  - `noImplicitReturns` and `noFallthroughCasesInSwitch`
- **Type-Safe Adapters**: Proper TypeScript interfaces
  - `DatabaseAdapter<T>` interface for all adapters
  - Generic `BaseService<T>` with full type inference
  - `QueryOptions` and `PaginationResult` types

### Changed

- **TypeScript ESM Configuration**: Fixed moduleResolution for better IDE support
  - Changed `module: "NodeNext"` (was `ESNext`) in all templates
  - Changed `moduleResolution: "NodeNext"` (was `bundler`) in all templates
  - Enables proper IDE navigation from .js imports to .ts source files
  - Follows official TypeScript ESM best practices
- **JWT Type Safety**: Fixed jwt.sign() type assertions
  - Proper `SignOptions['expiresIn']` type casting
  - Resolves strict mode compilation errors

### Fixed

- Template copying now includes all auth module files
- TypeScript compilation errors in templates with strict mode
- Missing utility classes (ConflictError, validateRequest, ApiResponse.unauthorized)
- Auth middleware JWT verification error handling
  - JWT-based authentication with access and refresh tokens
  - Register, login, refresh token, and logout endpoints
  - Auth middleware for protected routes
  - Password hashing with bcrypt
  - Type-safe DTOs with Zod validation
- **Rate Limiting**: Express rate limiter for all API routes
  - 100 requests per 15 minutes per IP
  - Configurable limits
  - Standard rate limit headers

### Changed

- **Prompts**: Refactored `initPrompts` with proper TypeScript types
  - `InitPromptAnswers` interface for type safety
  - Eliminated `any` types
- **Base Service**: Generic type parameter for entity types
  - Full type inference throughout service methods
  - Proper return types for all CRUD operations
- **Package Scripts**: Added comprehensive npm scripts
  - `test`, `test:ui`, `test:coverage` for testing
  - `lint`, `lint:fix` for code quality
  - `format`, `format:check` for code formatting

### Fixed

- Type safety issues in core files (no more `any` types)
- Missing return type annotations
- Inconsistent error handling patterns

## [1.1.0] - 2024-12-02

### Added

- Initial release with SQL, NoSQL, and Hybrid template support
- `init`, `generate`, and `doctor` commands
- Express.js boilerplate with TypeScript
- Prisma and Sequelize ORM support
- Mongoose ODM support
- Basic CRUD operations example

[Unreleased]: https://github.com/shahidraza-nas/polybase-core/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/shahidraza-nas/polybase-core/releases/tag/v1.1.0
