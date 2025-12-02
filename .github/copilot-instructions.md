# Polycore - CLI Backend Generator

## Project Type
This is an **npm CLI tool** (`polycore-cli`) that generates Express/TypeScript boilerplate projects with flexible database support. The codebase consists of:
- CLI command handlers (`src/cli/commands/`)
- Template project files (`templates/`)
- Database adapter abstractions (`src/core/adapters/`)

**Do NOT** add Express routes, controllers, or business logic here—those belong in the generated templates.

---

## Git Branching Strategy

### Branch Structure
```
main (protected)              - Production-ready releases only
├── develop                   - Integration branch for features
├── feature/*                 - Feature development branches
├── bugfix/*                  - Bug fix branches
├── release/*                 - Release preparation branches
└── hotfix/*                  - Emergency production fixes
```

### Workflow Rules
1. **Never commit directly to `main`** - All changes via pull requests
2. **Feature development**: Branch from `develop`, merge back to `develop`
3. **Release process**: `develop` → `release/vX.Y.Z` → `main` (tagged)
4. **Hotfixes**: Branch from `main`, merge to both `main` and `develop`

### Branch Naming Conventions
- `feature/auth-module` - New features
- `feature/testing-infrastructure` - Major additions
- `bugfix/jwt-type-error` - Bug fixes
- `release/v1.2.0` - Release preparation
- `hotfix/critical-security-fix` - Production hotfixes

### Current Active Branches
- `main` - v1.2.0 (latest release)
- `develop` - Integration branch (create from main)

### Creating Feature Branches
```bash
/* From develop branch */
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

/* Work on feature */
git add .
git commit -m "feat: descriptive message"

/* Push and create PR to develop */
git push origin feature/your-feature-name
```

### Agent Instructions
**CRITICAL - STRICTLY ENFORCED**: Before starting ANY work:

1. **Check current branch**: `git branch --show-current`
2. **STOP if on main or develop** - Never commit directly to these branches
3. **Create feature branch FIRST**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
4. **Make ALL changes on the feature branch**
5. **Commit only to the feature branch**
6. **Push feature branch and create PR to develop**

**ABSOLUTE RULES - NO EXCEPTIONS**:
- ❌ NEVER `git commit` while on `main` branch
- ❌ NEVER `git commit` while on `develop` branch
- ✅ ALWAYS create a feature branch first
- ✅ ALWAYS work on feature/bugfix/hotfix/release branches

**Branch Selection Logic**:
- User requests new feature → `git checkout -b feature/descriptive-name`
- User reports bug → `git checkout -b bugfix/issue-description`
- Preparing release → `git checkout -b release/vX.Y.Z`
- Production emergency → `git checkout -b hotfix/critical-issue`

**Pre-commit hook enforces this** - Direct commits to main/develop will be rejected.

**Workflow Example**:
```bash
/* WRONG - Will be rejected by hook */
git checkout develop
git add .
git commit -m "feat: new feature"  # ❌ REJECTED!

/* CORRECT - Proper workflow */
git checkout develop
git checkout -b feature/my-new-feature
git add .
git commit -m "feat: new feature"  # ✅ Allowed
git push origin feature/my-new-feature
/* Then create PR on GitHub */
```

---

## Architecture Overview

### CLI Flow (Commander + Inquirer)
```
User runs: polycore init myapp
  ↓
1. initPrompts() asks: SQL/NoSQL/Hybrid → then ORM (Prisma/Sequelize if SQL/Hybrid) → git/install
2. Template selection: `templates/${dbType}-${orm}` (e.g., "sql-prisma", "nosql", "hybrid-sequelize")
3. fs-extra.copy() → copies entire template/ to target directory
4. Copies .env.example → .env
5. Optional: execSync('git init') and execSync('npm install')
```

**Key files:**
- `src/index.ts` - Commander program entry, defines all commands
- `src/cli/commands/init.ts` - Main init logic with ora spinners, template resolution
- `src/cli/commands/doctor.ts` - System health check (Node, npm, Git, TypeScript)
- `src/cli/commands/generate.ts` - Stub for future module scaffolding (Phase 4)
- `src/cli/prompts.ts` - Conditional Inquirer prompts (ORM choice only for SQL/Hybrid)
- `src/utils/copy.ts` - Simple fs-extra wrapper with `overwrite: false`
- `bin/cli.js` - Shebang entry point, imports `dist/index.js`

### CLI Implementation Details
**Commander setup** (`src/index.ts`):
- Version synced with package.json (`1.1.0`)
- Three commands: `init <projectName>`, `generate <type> <name>`, `doctor`
- Each command imports handler from `src/cli/index.js` (re-exported from commands/)

**User experience patterns:**
- `ora` spinners for long operations with `.start()`, `.succeed()`, `.fail()`, `.warn()`
- `chalk` colors: blue for info, green for success, red for errors, yellow for warnings
- `inquirer` for interactive prompts (sequential, not all-at-once)
- `execSync` with `stdio: 'ignore'` for silent git init, `stdio: 'inherit'` for visible npm install

**Error handling:**
- Try-catch wraps entire init flow
- Spinner stops before prompts, restarts after
- `process.exit(1)` on critical failures (directory exists, template not found)
- Graceful degradation (git init fails → warn, continue; npm install fails → show manual steps)

### Template Structure
5 template directories in `templates/`: `sql-prisma`, `sql-sequelize`, `nosql`, `hybrid-prisma`, `hybrid-sequelize`

Each contains a complete Express app structure:
- `app.ts` - Express setup with helmet, cors, `/health` endpoint, error handlers
- `server.ts` - Entry point (imports app, starts server)
- `src/routes.ts` - API router (mounted at `/api`)
- `src/config/` - database.config.ts (Prisma singleton or Mongoose connection), env.config.ts
- `src/middlewares/` - error.middleware.ts, logger.middleware.ts, validation.middleware.ts
- `src/modules/user/` - Example CRUD module with controller/service/model pattern
- `src/core/` - Shared utils, errors, decorators
- `package.json` - Dependencies vary by mode (Prisma, Mongoose, or both for Hybrid)
- `tsconfig.json` - ESM config with `"type": "module"`
- `.env.example` - Template environment variables
- `prisma/schema.prisma` - Only in SQL/Hybrid templates

**Templates are static files copied as-is** - no variable substitution or transformation occurs.

### Database Adapter Pattern
**Problem:** Generated projects need unified CRUD regardless of Prisma/Mongoose choice.

**Solution:** Adapter + BaseService abstraction (defined in `src/core/adapters/`)
- `sql.adapter.ts` - Wraps Prisma client, takes table name as first param
- `sequelize.adapter.ts` - Wraps Sequelize models
- `nosql.adapter.ts` - Wraps Mongoose model, no table param needed
- `base.service.ts` - Generic service delegates to adapter

**Critical design:**
```typescript
// SqlAdapter takes table name per call (Prisma dynamic property pattern)
adapter.create('user', data) → prisma.user.create({ data })

// NoSqlAdapter bound to model at construction (Mongoose instance pattern)  
adapter.create(data) → UserModel.create(data)

// BaseService normalizes both
class BaseService {
  constructor(private adapter, private model) {}
  create(data) { return this.adapter.create(this.model, data) }
}
```

**These adapters are planned for generated projects** (future work), not currently in CLI dependencies.

---

## Critical Conventions

### Code Style - IMPORTANT
**Always use multiline comment syntax** (`/* */`) instead of single-line (`//`) for all comments:
```typescript
/* Good - multiline syntax */
const foo = 'bar';

/* 
 * Good - multiline syntax for longer comments
 * Multiple lines are fine
 */
const baz = 'qux';

// Bad - avoid single-line comments
const bad = 'example';
```

**Barrel Exports Pattern** - REQUIRED for all modules:
Use index.ts files to create clean import paths and better code organization:

```typescript
/* src/core/errors/index.ts - Barrel export */
export * from './app-error.js';

/* src/core/utils/index.ts - Barrel export */
export * from './logger.util.js';
export * from './response.util.js';

/* src/modules/auth/index.ts - Barrel export */
export * from './auth.dto.js';
export * from './auth.service.js';
export * from './auth.controller.js';
export { default as authRoutes } from './auth.routes.js';

/* Usage in other files - Clean imports */
import { UnauthorizedError, ConflictError } from '../../core/errors/index.js';
import { ApiResponse } from '../../core/utils/index.js';
import { authRoutes } from './modules/auth/index.js';
```

**Benefits of barrel exports:**
- Cleaner import statements (no deep path traversal)
- Easier refactoring (change internals without updating all imports)
- Better encapsulation (control what gets exported)
- Improved IDE autocomplete
- Single source of truth for module exports

**When to create barrel exports:**
- Every module directory (e.g., `src/modules/auth/`)
- Shared utility directories (e.g., `src/core/errors/`, `src/core/utils/`)
- Decorator/helper directories (e.g., `src/core/decorators/`)
- NOT needed for single-file directories

### ESM Requirements
- **Package is strict ESM**: `"type": "module"` in package.json
- All imports MUST use `.js` extension: `import foo from './bar.js'` (even for `.ts` files)
- No `require()` - only `import`/`export`
- `__dirname` doesn't exist - use: `path.dirname(fileURLToPath(import.meta.url))`

**TypeScript Configuration for ESM:**
```json
{
  "compilerOptions": {
    "module": "NodeNext",             /* CRITICAL: Must be NodeNext when using moduleResolution: NodeNext */
    "moduleResolution": "NodeNext",   /* CRITICAL: Must be NodeNext or Node16, NOT bundler */
    "target": "ES2020"
  }
}
```

**Why `.js` extensions in TypeScript files:**
When using TypeScript with ESM (`"type": "module"`), you MUST use `.js` extensions in import statements, even though your source files are `.ts`. This is because:
1. TypeScript doesn't transform import paths during compilation
2. The imports reference what will exist at runtime (the compiled `.js` files)
3. Node.js ESM requires explicit file extensions
4. This is an official TypeScript ESM design decision

**IDE Navigation:**
With `"moduleResolution": "NodeNext"`, VS Code will correctly resolve `.js` imports to the corresponding `.ts` source files, allowing "Go to Definition" to work properly.

Example:
```typescript
/* ✅ CORRECT - Use .js even though the file is auth.service.ts */
import { AuthService } from './auth.service.js';
import { UnauthorizedError } from '../core/errors/index.js';

/* ❌ WRONG - TypeScript won't compile with NodeNext resolution */
import { AuthService } from './auth.service.ts';
import { AuthService } from './auth.service';
```

**Source:** https://www.typescriptlang.org/docs/handbook/modules/theory.html#typescript-imitates-the-hosts-module-resolution-but-with-types

### Path Resolution After Build
```typescript
// In src/cli/commands/init.ts after compilation to dist/:
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Templates at: path.join(__dirname, '../../../templates', templateName)
// Compiles: src/cli/commands/init.ts → dist/cli/commands/init.js
// Resolution: dist/cli/commands/ + ../../../ = root/templates/
```

**Critical:** Templates are NOT compiled - they stay at project root. The npm `files` field includes `dist`, `bin`, and `templates` for publishing.

### Build & Test Workflow
1. **Build:** `npm run build` or `tsc` - compiles `src/` → `dist/` (tsconfig.json: `outDir: "dist"`)
   - Windows shortcut: `build.bat` (uses `npx tsc` with error handling)
2. **Link for testing:** `npm link` - symlinks `polycore` to global npm
   - Uses `bin/cli.js` → `dist/index.js` entry point
3. **Test CLI:** `polycore init test-app` - test command in any directory
4. **Iterate:** Make changes → `npm run build` (changes reflected immediately via symlink)
5. **Cleanup:** `npm unlink -g polycore-cli` when done

**Entry point flow:** User runs `polycore` → `bin/cli.js` (shebang) → imports `dist/index.js` (compiled Commander setup)

**Publishing workflow:**
- `npm publish` includes only `dist/`, `bin/`, `templates/` (see package.json `files` field)
- Pre-publish: Update author/repository in package.json, test with `npm pack --dry-run`
- Version bumps: `npm version patch|minor|major` (creates git tags automatically)
- See `PUBLISH.md` for complete checklist

### File Naming Patterns
- Commands: lowercase `{name}.ts` (e.g., `init.ts`, `doctor.ts`, `generate.ts`)
- Adapters: `*.adapter.ts` suffix (e.g., `sql.adapter.ts`, `nosql.adapter.ts`)
- Template directories: `{dbType}-{orm}` format for SQL/Hybrid, just `{dbType}` for NoSQL
  - Examples: `sql-prisma`, `sql-sequelize`, `nosql`, `hybrid-prisma`, `hybrid-sequelize`

### Dependency Boundaries
**CLI package dependencies:** commander, inquirer, fs-extra, chalk, ora  
**Template dependencies (inside template package.json):** express, @prisma/client, mongoose, tsx, zod, helmet, cors, bcryptjs

**NOT in CLI:** @prisma/client, mongoose, express, sequelize (those go in template package.json files)

**Why:** Templates are copied as-is with their own dependencies. Installing these in CLI would bloat the package and cause version conflicts.

---

## Common Tasks

### Adding a New Command
1. Create `src/cli/commands/{name}.ts` with default export function:
   ```typescript
   export default function myCommand(arg: string) {
     console.log(chalk.blue(`Processing: ${arg}`));
     // Implementation
   }
   ```
2. Add to `src/index.ts`:
   ```typescript
   import myCommand from './cli/commands/{name}.js'; // Note .js extension
   program.command('{name} <arg>').description('...').action(myCommand);
   ```
3. Build and test: `npm run build` → `polycore {name} test`

### Adding a New Template
1. Create directory: `templates/{dbType}-{orm}/` (e.g., `templates/sql-drizzle/`)
2. Copy structure from existing template (easiest: duplicate `sql-prisma/`)
3. Modify files:
   - `package.json` - Update dependencies for new ORM
   - `src/config/database.config.ts` - Implement new ORM connection
   - `src/modules/user/` - Update model/service/controller for new ORM
4. Template selection in `init.ts` automatically handles it via `${dbType}-${orm}` interpolation
5. **No code changes needed in CLI** - template name is dynamic

### Modifying Prompts
Edit `src/cli/prompts.ts` - uses sequential `inquirer.prompt()` calls for conditional logic.

**Pattern:** 
1. Ask broad question first
2. Conditionally prompt based on `answers.{field}`
3. Merge all answers at end

Example:
```typescript
const answers = await inquirer.prompt([{ name: 'dbType', ... }]);
if (answers.dbType === 'SQL') {
  const ormChoice = await inquirer.prompt([{ name: 'sqlOrm', ... }]);
  answers.sqlOrm = ormChoice.sqlOrm;
}
return answers;
```

### Template Dependency Management
When adding dependencies to templates:
- **SQL templates:** Include Prisma or Sequelize + `@prisma/client` or `sequelize`
- **NoSQL templates:** Include Mongoose (`mongoose` package)
- **Hybrid templates:** Include BOTH SQL ORM and Mongoose
- **All templates:** Always include express, tsx (for dev), typescript, zod, helmet, cors

Scripts pattern (all templates):
```json
{
  "dev": "tsx watch server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### Testing Template Changes
1. Modify template files
2. No rebuild needed (templates aren't compiled)
3. `polycore init test-app` → select appropriate mode
4. `cd test-app && npm install && npm run dev`
5. Test generated project

---

## Troubleshooting

### "Cannot find module" with .ts extensions
**Wrong:** `import foo from './bar'` or `import foo from './bar.ts'`  
**Right:** `import foo from './bar.js'` (TypeScript resolves to compiled .js)

**Why:** ESM + TypeScript requires explicit extensions, but they reference compiled output.

### Templates not copying
**Symptom:** Error: `Template not found: sql-prisma`

**Cause:** `__dirname` resolution incorrect - templates must be found relative to compiled `dist/` output.

**Fix:** In `src/cli/commands/init.ts`:
```typescript
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.join(__dirname, '../../../templates', templatePath);
// dist/cli/commands/init.js → ../../../ → root/templates/
```

**Template validation:** Init command checks `fs.pathExists(templateDir)` before copying - template name must match exactly.

### Directory already exists error
CLI checks target directory before copying with `fs.pathExists()`. If exists, exits with error code 1.  
**Workaround:** Delete or rename existing directory, or change project name.  
**Implementation:** See `src/cli/commands/init.ts` line ~20 for pre-flight check pattern.

### npm install fails in generated project
**Common causes:**
1. Network issues - retry `npm install`
2. Node version < 18 - check `node --version`, upgrade if needed
3. Missing `package.json` in template - verify template structure

### WSL + Windows Path Issues
**Best practices:**
- Clone to native WSL filesystem (`~/workspace/`) NOT Windows mounts (`/mnt/c/`)
- Run all commands in WSL terminal, not Windows Command Prompt
- If mixing: Use `wsl` command to enter WSL shell
- UNC paths (`\\wsl.localhost\...`) work in VS Code but may fail in some tools

**If encountering path errors:**
```bash
wsl
cd ~/workspace/polybase-core
npm install
npm run build
npm link
```
