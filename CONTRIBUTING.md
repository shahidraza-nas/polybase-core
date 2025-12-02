# Contributing to Polycore CLI

First off, thank you for considering contributing to Polycore CLI! It's people like you that make Polycore such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind and courteous.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed** and **what you expected to see**
- **Include screenshots** if applicable
- **Include your environment**: OS, Node version, npm version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **Provide examples** of how it would work

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Write tests** for your changes
4. **Ensure the test suite passes** (`npm test`)
5. **Update documentation** if needed
6. **Create a pull request** with a clear description

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/polybase-core.git
cd polybase-core

# Install dependencies
npm install

# Build the project
npm run build

# Link for local testing
npm link

# Run tests
npm test

# Run tests with UI
npm run test:ui
```

### Project Structure

```
polybase-core/
├── src/                    # CLI source code
│   ├── cli/               # CLI commands and prompts
│   ├── core/              # Core utilities and adapters
│   └── utils/             # Utility functions
├── templates/             # Project templates (5 variants)
│   ├── sql-prisma/
│   ├── sql-sequelize/
│   ├── nosql/
│   ├── hybrid-prisma/
│   └── hybrid-sequelize/
├── tests/                 # Test files
└── docs/                  # Documentation
```

## Code Style Guidelines

### TypeScript

- **Use TypeScript strict mode** - no `any` types unless absolutely necessary
- **Define interfaces** for all data structures
- **Use generic types** where appropriate
- **Add JSDoc comments** for public APIs
- **Follow ESLint rules** - run `npm run lint` before committing

### Naming Conventions

- **Files**: lowercase with hyphens (e.g., `auth.service.ts`)
- **Classes**: PascalCase (e.g., `AuthService`)
- **Interfaces**: PascalCase (e.g., `DatabaseAdapter`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_PORT`)

### Code Examples

**Good:**

```typescript
import type { User } from './types.js';

export class UserService {
  /**
   * Get user by ID
   * @param userId - The user ID
   * @returns The user object or null
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.adapter.findOne('users', { id: userId });
  }
}
```

**Bad:**

```typescript
// No types, no docs, unclear naming
export class UserService {
  async get(id: any) {
    return this.adapter.findOne('users', { id });
  }
}
```

## Testing Guidelines

- **Write tests** for all new features
- **Maintain coverage** - aim for 80%+ code coverage
- **Use descriptive test names** - test should describe what it tests
- **Test edge cases** - not just happy paths
- **Mock external dependencies** - don't make real API calls in tests

### Test Example

```typescript
import { describe, it, expect } from 'vitest';

describe('AuthService', () => {
  it('should throw error when user already exists', async () => {
    const service = new AuthService();
    const userData = { email: 'test@example.com', password: 'password' };
    
    await service.register(userData);
    
    await expect(service.register(userData)).rejects.toThrow('User already exists');
  });
});
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(auth): add JWT authentication module

- Add AuthService with login/register
- Add auth middleware
- Add refresh token support

Closes #123
```

```
fix(init): handle existing directory error

Prevent crash when target directory already exists.
Show clear error message instead.

Fixes #456
```

## Pull Request Process

1. **Update README.md** with details of changes if applicable
2. **Update CHANGELOG.md** following Keep a Changelog format
3. **Ensure all tests pass** - `npm test`
4. **Ensure linting passes** - `npm run lint`
5. **Update documentation** if you're changing functionality
6. **Squash commits** if you have multiple small commits
7. **Link relevant issues** in the PR description

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests pass locally
- [ ] Linting passes
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] No breaking changes (or marked as such)

## Related Issues
Closes #123
```

## Adding a New Template

To add a new database template (e.g., `sql-drizzle`):

1. **Create directory**: `templates/sql-drizzle/`
2. **Copy structure** from existing template
3. **Update dependencies** in `package.json`
4. **Implement database config** in `src/config/database.config.ts`
5. **Update CRUD operations** in service files
6. **Add README** with setup instructions
7. **Test generated project** manually
8. **Update CLI docs** to mention new template

## Adding a New CLI Command

1. **Create command file**: `src/cli/commands/mycommand.ts`
2. **Export function**: `export default function myCommand() { ... }`
3. **Register in**: `src/index.ts`
4. **Write tests**: `src/cli/commands/mycommand.test.ts`
5. **Update README**: Document the new command
6. **Update CLI help**: Ensure `--help` shows it

## Questions?

Feel free to:

- Open an issue with the `question` label
- Reach out to maintainers
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
