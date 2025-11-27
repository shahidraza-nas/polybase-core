# Polycore - CLI Backend Generator

## Project Type
This is an **npm CLI tool** (`polycore-cli`) that generates Express/TypeScript boilerplate projects with flexible database support. The codebase consists of:
- CLI command handlers (`src/cli/commands/`)
- Template project files (`templates/`)
- Database adapter abstractions (`src/core/adapters/`)

**Do NOT** add Express routes, controllers, or business logic here—those belong in the generated templates.

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

### ESM Requirements
- **Package is strict ESM**: `"type": "module"` in package.json
- All imports MUST use `.js` extension: `import foo from './bar.js'` (even for `.ts` files)
- No `require()` - only `import`/`export`
- `__dirname` doesn't exist - use: `path.dirname(fileURLToPath(import.meta.url))`

**Why `.js` extensions:** TypeScript with ESM requires explicit file extensions in imports, but they reference the compiled output (`.js`), not source (`.ts`). This is a TypeScript ESM constraint.

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
1. `npm run build` or `tsc` - compiles `src/` → `dist/` (tsconfig.json: `outDir: "dist"`)
2. `npm link` - symlinks `polycore` to global npm, uses `bin/cli.js` → `dist/index.js`
3. `polycore init test-app` - test command in any directory
4. Make changes → `npm run build` (changes reflected immediately via symlink)
5. `npm unlink -g polycore-cli` - cleanup when done

**Entry point flow:** User runs `polycore` → `bin/cli.js` (shebang) → imports `dist/index.js` (compiled Commander setup)

**Publishing:** `npm publish` includes only `dist/`, `bin/`, `templates/` (see package.json `files` field)

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

### Directory already exists error
CLI checks target directory before copying. If exists, exits with error.  
**Workaround:** Delete or rename existing directory, or change project name.

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
