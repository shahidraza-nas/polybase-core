# Polycore - CLI Backend Generator

## Project Type
This is an **npm CLI tool** (`polycore`) that generates Express/TypeScript boilerplate projects. The codebase consists of:
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
1. initPrompts() asks: SQL/NoSQL/Hybrid → then ORM (Prisma/Sequelize) → git/install
2. Template selection: `templates/${dbType}-${orm}` (e.g., "sql-prisma", "hybrid-sequelize")
3. fs-extra.copy() → copies template/ to target directory
4. Optional: execSync('git init') and execSync('npm install')
```

**Key files:**
- `src/index.ts` - Commander program entry
- `src/cli/commands/init.ts` - Main init logic with ora spinners
- `src/cli/prompts.ts` - Conditional Inquirer prompts (ORM choice only for SQL/Hybrid)
- `src/utils/copy.ts` - Simple fs-extra wrapper

### Template Structure
5 template directories in `templates/`: `sql-prisma`, `sql-sequelize`, `nosql`, `hybrid-prisma`, `hybrid-sequelize`

Each contains:
- `app.ts` - Express setup with `/health` endpoint
- `server.ts` - Entry point (imports app, starts server)
- `routes.ts` - Router boilerplate
- `package.json` - Dependencies vary by ORM (Prisma vs Mongoose vs both)
- `tsconfig.json` - ESM config for generated project

**Templates are NOT compiled** - they're copied as-is. No variable substitution yet.

### Database Adapter Pattern
**Problem:** Generated projects need unified CRUD regardless of Prisma/Mongoose choice.

**Solution:** Adapter + BaseService abstraction
- `src/core/adapters/sql.adapter.ts` - Wraps Prisma client, takes table name as first param
- `src/core/adapters/nosql.adapter.ts` - Wraps Mongoose model, no table param needed
- `src/core/base.service.ts` - Generic service delegates to adapter

**Critical design:**
```typescript
// SqlAdapter takes table name per call (Prisma pattern)
adapter.create('user', data) → prisma.user.create({ data })

// NoSqlAdapter bound to model at construction (Mongoose pattern)  
adapter.create(data) → UserModel.create(data)

// BaseService normalizes both
class BaseService {
  constructor(private adapter, private model) {}
  create(data) { return this.adapter.create(this.model, data) }
}
```

**These adapters live in generated projects** (future work), not in CLI package dependencies.

---

## Critical Conventions

### ESM Requirements
- **Package is strict ESM**: `"type": "module"` in package.json
- All imports MUST use `.js` extension: `import foo from './bar.js'` (even for `.ts` files)
- No `require()` - only `import`/`export`
- `__dirname` doesn't exist - use: `path.dirname(fileURLToPath(import.meta.url))`

### Path Resolution After Build
```typescript
// In src/cli/commands/init.ts after compilation to dist/:
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Templates at: path.join(__dirname, '../../../templates', templateName)
// Compiles from dist/cli/commands/init.js → back to templates/ at root
```

### Build & Test Workflow
1. `npm run build` or `tsc` - compiles `src/` → `dist/`
2. `npm link` - installs CLI globally for local testing
3. `polycore init test-app` - test command
4. `npm unlink -g polycore` - cleanup

**Entry point:** `bin/cli.js` (shebang) → imports `dist/index.js` (compiled output)

### File Naming Patterns
- Commands: lowercase (e.g., `init.ts`, `doctor.ts`)
- Adapters: `*.adapter.ts` suffix
- Template directories: `{dbType}-{orm}` format (e.g., `sql-prisma`, `hybrid-sequelize`)

### Dependency Boundaries
**CLI package dependencies:** commander, inquirer, fs-extra, chalk, ora
**NOT in CLI:** @prisma/client, mongoose, express (those go in template package.json files)

Templates are static files copied as-is - they contain their own dependencies in their `package.json` files.

---

## Common Tasks

### Adding a New Command
1. Create `src/cli/commands/{name}.ts` with default export function
2. Add to `src/index.ts`: `program.command('{name}').action(commandFunc)`
3. Remember `.js` extension in import: `import cmd from './cli/commands/{name}.js'`

### Adding a New Template
1. Create directory: `templates/{dbType}-{orm}/`
2. Add files: `app.ts`, `server.ts`, `routes.ts`, `package.json`, `tsconfig.json`
3. Template selection in `init.ts` automatically handles it via `${dbType}-${orm}` string interpolation

### Modifying Prompts
Edit `src/cli/prompts.ts` - uses sequential `inquirer.prompt()` calls for conditional logic.
Pattern: Ask broad question first, then conditionally prompt based on `answers.{field}`.

---

## Troubleshooting

### "Cannot find module" with .ts extensions
Wrong: `import foo from './bar'` or `import foo from './bar.ts'`  
Right: `import foo from './bar.js'` (TypeScript resolves to compiled .js)

### Templates not copying
Check `__dirname` resolution - templates must be found relative to compiled `dist/` output, not `src/`.
Use: `path.join(__dirname, '../../../templates')` from `dist/cli/commands/`

### WSL + Windows Path Issues
- Clone to native WSL filesystem (`~/workspace/`) not Windows mounts (`/mnt/c/`)
- Run all commands in WSL terminal, not Windows terminal
- Use `wsl` command to enter WSL shell if needed
