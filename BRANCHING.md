# Git Branching Strategy

## Branch Structure

```
main (protected)              - Production-ready releases only
├── develop                   - Integration branch for features
├── feature/*                 - Feature development branches
├── bugfix/*                  - Bug fix branches
├── release/*                 - Release preparation branches
└── hotfix/*                  - Emergency production fixes
```

## Branch Descriptions

### `main`

- **Purpose**: Production-ready code only
- **Protection**: Protected branch, requires PR approval
- **Tags**: All releases are tagged here (v1.0.0, v1.1.0, etc.)
- **Merges from**: `release/*` and `hotfix/*` branches only

### `develop`

- **Purpose**: Integration branch for ongoing development
- **Status**: Latest development code, may be unstable
- **Merges from**: `feature/*` and `bugfix/*` branches
- **Merges to**: `release/*` branches for release preparation

### `feature/*`

- **Purpose**: New feature development
- **Naming**: `feature/descriptive-name` (e.g., `feature/auth-module`)
- **Branch from**: `develop`
- **Merge to**: `develop` via Pull Request
- **Examples**:
  - `feature/auth-module` - Add authentication system
  - `feature/testing-infrastructure` - Set up Vitest
  - `feature/rate-limiting` - Add rate limiting middleware

### `bugfix/*`

- **Purpose**: Non-critical bug fixes
- **Naming**: `bugfix/issue-description` (e.g., `bugfix/jwt-type-error`)
- **Branch from**: `develop`
- **Merge to**: `develop` via Pull Request
- **Examples**:
  - `bugfix/jwt-type-error` - Fix JWT signing type issue
  - `bugfix/template-copy-error` - Fix template file copying
  - `bugfix/missing-dependency` - Add missing package dependency

### `release/*`

- **Purpose**: Prepare for a new production release
- **Naming**: `release/vX.Y.Z` (e.g., `release/v1.2.0`)
- **Branch from**: `develop`
- **Merge to**: `main` and back to `develop`
- **Activities**:
  - Version bump in package.json
  - Update CHANGELOG.md
  - Final testing and bug fixes
  - Documentation updates

### `hotfix/*`

- **Purpose**: Emergency fixes for production issues
- **Naming**: `hotfix/critical-issue` (e.g., `hotfix/security-vulnerability`)
- **Branch from**: `main`
- **Merge to**: `main` AND `develop`
- **Tagged**: Immediately after merging to main
- **Examples**:
  - `hotfix/security-vulnerability` - Fix critical security issue
  - `hotfix/data-corruption` - Fix data loss bug

## Workflow Examples

### Feature Development Workflow

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/module-generator

# 3. Work on feature
git add .
git commit -m "feat: add module generation command"
git commit -m "feat: add module templates"

# 4. Push and create PR
git push origin feature/module-generator
# Create PR: feature/module-generator → develop

# 5. After PR approval and merge, delete branch
git branch -d feature/module-generator
git push origin --delete feature/module-generator
```

### Bug Fix Workflow

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create bugfix branch
git checkout -b bugfix/fix-prisma-import

# 3. Fix the bug
git add .
git commit -m "fix: correct Prisma client import path"

# 4. Push and create PR
git push origin bugfix/fix-prisma-import
# Create PR: bugfix/fix-prisma-import → develop
```

### Release Workflow

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.3.0

# 2. Prepare release
# - Update version in package.json
# - Update CHANGELOG.md
# - Run tests: npm test
# - Build: npm run build

git add .
git commit -m "chore: prepare release v1.3.0"

# 3. Push release branch
git push origin release/v1.3.0

# 4. Create PR: release/v1.3.0 → main
# After approval and merge to main:

# 5. Tag the release on main
git checkout main
git pull origin main
git tag -a v1.3.0 -m "Release v1.3.0"
git push origin v1.3.0

# 6. Merge back to develop
git checkout develop
git merge main
git push origin develop

# 7. Delete release branch
git branch -d release/v1.3.0
git push origin --delete release/v1.3.0
```

### Hotfix Workflow

```bash
# 1. Branch from main (production)
git checkout main
git pull origin main
git checkout -b hotfix/fix-critical-bug

# 2. Fix the issue
git add .
git commit -m "fix: resolve critical authentication bypass"

# 3. Push and create PR to main
git push origin hotfix/fix-critical-bug
# Create PR: hotfix/fix-critical-bug → main

# 4. After merge to main, tag immediately
git checkout main
git pull origin main
git tag -a v1.2.1 -m "Hotfix v1.2.1: Critical auth fix"
git push origin v1.2.1

# 5. Merge to develop
git checkout develop
git merge main
git push origin develop

# 6. Delete hotfix branch
git branch -d hotfix/fix-critical-bug
git push origin --delete hotfix/fix-critical-bug
```

## Commit Message Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code formatting (no logic change)
refactor: code refactoring
test: add or update tests
chore: build process, dependencies, etc.
perf: performance improvements
ci: CI/CD configuration changes
```

**Examples:**

```bash
git commit -m "feat: add JWT authentication to all templates"
git commit -m "fix: resolve TypeScript module resolution error"
git commit -m "docs: update README with installation instructions"
git commit -m "test: add unit tests for BaseService adapter"
git commit -m "chore: bump version to 1.2.0"
```

## Branch Protection Rules

### `main` Branch

- ✅ Require pull request reviews (minimum 1 approval)
- ✅ Require status checks to pass (build, tests)
- ✅ Require branches to be up to date
- ✅ No direct pushes (except for initial setup)
- ✅ Require signed commits (recommended)

### `develop` Branch

- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ⚠️ Allow direct pushes for documentation updates (optional)

## Quick Reference

| Task | Branch From | Branch To | Branch Name |
|------|-------------|-----------|-------------|
| New feature | `develop` | `develop` | `feature/name` |
| Bug fix | `develop` | `develop` | `bugfix/name` |
| Release prep | `develop` | `main` + `develop` | `release/vX.Y.Z` |
| Production fix | `main` | `main` + `develop` | `hotfix/name` |

## Current Branch Status

- **`main`**: v1.2.0 (released 2025-12-02)
- **`develop`**: Active development branch

## Tips

1. **Always pull before creating a new branch**

   ```bash
   git checkout develop && git pull origin develop
   ```

2. **Keep branches focused** - One feature/fix per branch

3. **Delete merged branches** - Clean up after merging to avoid clutter

4. **Sync develop with main after releases**

   ```bash
   git checkout develop
   git merge main
   git push origin develop
   ```

5. **Use descriptive branch names** - Make the purpose clear at a glance

6. **Regular commits** - Commit frequently with clear messages

7. **Test before PR** - Always run tests before creating a pull request

   ```bash
   npm run build && npm test
   ```
