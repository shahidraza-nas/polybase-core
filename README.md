# Polycore CLI

[![npm version](https://img.shields.io/npm/v/polycore-cli.svg)](https://www.npmjs.com/package/polycore-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

A powerful CLI tool for generating production-ready Node.js + TypeScript backend boilerplates with **flexible database support** (SQL, NoSQL, or Hybrid) and **built-in JWT authentication**.

## ✨ Features

### 🔐 Authentication (v1.2.0+)
- **JWT Authentication** - Access tokens (7d) and refresh tokens (30d)
- **Complete Auth Module** - Register, login, refresh, logout, /me endpoints
- **Password Security** - bcryptjs hashing with 10 rounds
- **Rate Limiting** - 5 requests per 15 minutes on auth routes
- **ORM-Specific** - Implementations for Prisma, Sequelize, and Mongoose

### 🗄️ Database Support
- **Multiple database modes**: SQL, NoSQL, or Hybrid
- **SQL ORMs**: Prisma or Sequelize (PostgreSQL, MySQL, SQLite)
- **NoSQL ODM**: Mongoose (MongoDB)
- **Hybrid Mode**: Combine SQL and NoSQL in one project

### 🚀 Production-Ready
- **TypeScript + ESM** - Modern module system with proper configuration
- **Express.js** - Fast, minimalist web framework
- **Error Handling** - Custom error classes and global error middleware
- **Validation** - Zod schema validation
- **Logging** - Structured logging with custom logger
- **Security** - Helmet, CORS, rate limiting
- **Health Checks** - Built-in /health endpoint

### 📦 Code Organization
- **Barrel Exports** - Clean import structure with index.ts files
- **Module Pattern** - Organized by feature/domain
- **Middleware Layer** - Authentication, validation, error handling
- **Type Safety** - TypeScript strict mode enabled

## 📥 Installation

```bash
npm install -g polycore-cli
```

## 🚀 Quick Start

### 1. Create a New Project

```bash
polycore init my-app
```

You'll be prompted to choose:
- **Database type**: SQL, NoSQL, or Hybrid
- **ORM** (if SQL/Hybrid): Prisma or Sequelize
- **Git initialization**: Yes/No
- **Dependency installation**: Yes/No

### 2. Configure Environment

```bash
cd my-app
# Edit .env file with your database credentials
```

Example `.env`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
JWT_SECRET="your-secret-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=3000
```

### 3. Database Setup

**For Prisma (SQL/Hybrid):**
```bash
npx prisma migrate dev --name init
```

**For Sequelize (SQL/Hybrid):**
```bash
# Sequelize auto-syncs on first run
npm run dev
```

**For Mongoose (NoSQL/Hybrid):**
```bash
# Just ensure MongoDB is running
npm run dev
```

### 4. Start Development

```bash
npm run dev
```

Your API is now running at `http://localhost:3000`!

## 📚 API Endpoints

### Authentication Endpoints

```bash
# Register a new user
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}

# Refresh access token
POST /api/auth/refresh
{
  "refreshToken": "your-refresh-token"
}

# Get current user (requires authentication)
GET /api/auth/me
Authorization: Bearer <access-token>

# Logout (invalidate refresh token)
POST /api/auth/logout
{
  "refreshToken": "your-refresh-token"
}
```

### User Endpoints

```bash
# Get all users
GET /api/users

# Get user by ID
GET /api/users/:id

# Create user
POST /api/users
{
  "email": "user@example.com",
  "name": "John Doe"
}

# Update user
PUT /api/users/:id

# Delete user
DELETE /api/users/:id
```

### Health Check

```bash
GET /health
```

## 🛠️ CLI Commands

### `polycore init <project-name>`

Create a new project with interactive prompts.

```bash
polycore init my-awesome-api
```

### `polycore doctor`

Check system requirements and dependencies.

```bash
polycore doctor
```

Verifies:
- Node.js version (>=18.0.0)
- npm installation
- Git availability
- TypeScript installation

### `polycore generate <type> <name>` *(Coming Soon)*

Generate modules, controllers, services, and models.

```bash
polycore generate module posts
polycore generate controller auth
```

## 📁 Project Structure

Generated projects follow this structure:

```text
my-app/
├── src/
│   ├── config/              # Database & environment config
│   │   ├── database.config.ts
│   │   └── env.config.ts
│   ├── core/
│   │   ├── errors/          # Custom error classes
│   │   ├── utils/           # Helper utilities
│   │   └── decorators/      # Async handler decorator
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # JWT authentication
│   │   ├── error.middleware.ts      # Global error handler
│   │   ├── logger.middleware.ts     # Request logging
│   │   └── validation.middleware.ts # Zod validation
│   ├── modules/
│   │   ├── auth/            # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.dto.ts
│   │   │   └── index.ts
│   │   └── user/            # User CRUD module
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       ├── user.routes.ts
│   │       ├── user.dto.ts
│   │       ├── user.model.ts (Sequelize/Mongoose)
│   │       └── index.ts
│   └── routes.ts            # Main API router
├── prisma/                  # Prisma schema (SQL modes)
│   └── schema.prisma
├── app.ts                   # Express app configuration
├── server.ts                # Server entry point
├── package.json
├── tsconfig.json
├── .env
├── .env.example
└── README.md
```

## 🗄️ Database Modes

### SQL Mode

Use relational databases with your choice of ORM.

**ORMs:**
- **Prisma** - Type-safe ORM with auto-generated client
- **Sequelize** - Traditional ORM with model definitions

**Supported Databases:**
- PostgreSQL
- MySQL
- SQLite

```bash
# Prisma example
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# MySQL example
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# SQLite example
DATABASE_URL="file:./dev.db"
```

### NoSQL Mode

Use MongoDB with Mongoose ODM.

```bash
DATABASE_URL="mongodb://localhost:27017/mydb"
# Or MongoDB Atlas
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/mydb"
```

**Features:**
- Schema validation
- Middleware hooks
- Virtuals and methods
- Population (relationships)

### Hybrid Mode

Combine both SQL and NoSQL databases in one project.

**Use Cases:**
- User data in PostgreSQL + Session data in MongoDB
- Relational data in SQL + Document store in NoSQL
- Flexible architecture for complex applications

```bash
# .env for Hybrid mode
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
MONGODB_URL="mongodb://localhost:27017/mydb"
```

## 🔒 Authentication

All templates include a complete JWT authentication system:

### Features

- **Access Tokens** - Short-lived (7 days default)
- **Refresh Tokens** - Long-lived (30 days default)
- **Password Hashing** - bcryptjs with 10 rounds
- **Rate Limiting** - Prevents brute force attacks
- **Token Refresh** - Seamless token renewal
- **Logout** - Token invalidation

### Middleware Usage

Protect routes with the `authenticate` middleware:

```typescript
import { authenticate } from './middlewares/auth.middleware.js';
import { Router } from 'express';

const router = Router();

/* Public routes */
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

/* Protected routes */
router.get('/auth/me', authenticate, authController.getCurrentUser);
router.get('/users', authenticate, userController.getAll);
```

### Accessing User in Controllers

```typescript
import { Request, Response } from 'express';

export class UserController {
  async getCurrentUser(req: Request, res: Response) {
    /* User info is attached by authenticate middleware */
    const userId = req.user?.userId;
    const email = req.user?.email;
    
    /* Your logic here */
  }
}
```

## 🧪 Development

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/shahidraza-nas/polybase-core.git
cd polybase-core

# Install dependencies
npm install

# Build the CLI
npm run build

# Link for local testing
npm link

# Now you can use it globally
polycore init test-project
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🌿 Branching Strategy

This project follows a structured Git workflow:

- **`main`** - Production releases only
- **`develop`** - Integration branch
- **`feature/*`** - New features
- **`bugfix/*`** - Bug fixes
- **`release/*`** - Release preparation
- **`hotfix/*`** - Emergency fixes

See [BRANCHING.md](./BRANCHING.md) for detailed workflow.

## 📦 What's New

### v1.2.0 (2025-12-02)

**Major Features:**
- ✨ Complete JWT authentication in all 5 templates
- 📦 Barrel export pattern for clean imports
- 🔧 TypeScript ESM configuration fixes (module: NodeNext)
- ✅ Testing infrastructure with Vitest
- 🎨 ESLint + Prettier code quality tools

**Authentication:**
- JWT with access & refresh tokens
- Register, login, refresh, logout, /me endpoints
- Rate limiting on auth routes
- ORM-specific implementations

**Code Quality:**
- 11/11 tests passing
- TypeScript strict mode
- Barrel exports in all key directories
- Better IDE navigation for .js imports

See [CHANGELOG.md](./CHANGELOG.md) for full release history.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request to `develop` branch

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and development process.

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add new feature
fix: bug fix
docs: documentation changes
style: code formatting
refactor: code refactoring
test: add or update tests
chore: build process, dependencies
```

## 📄 License

MIT © [Shahid Raza](https://github.com/shahidraza-nas)

See [LICENSE](./LICENSE) for more information.

## 🔗 Links

- **GitHub**: [shahidraza-nas/polybase-core](https://github.com/shahidraza-nas/polybase-core)
- **npm**: [polycore-cli](https://www.npmjs.com/package/polycore-cli)
- **Issues**: [Report a bug](https://github.com/shahidraza-nas/polybase-core/issues)
- **Discussions**: [Ask questions](https://github.com/shahidraza-nas/polybase-core/discussions)

## 💖 Support

If you find this project helpful, please give it a ⭐️ on GitHub!

---

**Made with ❤️ by [Shahid Raza](https://github.com/shahidraza-nas)**
