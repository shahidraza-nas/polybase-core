# SQL API Project

A production-ready REST API built with Express, TypeScript, and Prisma.

## Features

- ✅ TypeScript with strict type checking
- ✅ Express.js with modular architecture
- ✅ Prisma ORM for SQL databases
- ✅ Request validation with Zod
- ✅ Error handling middleware
- ✅ Logging system
- ✅ CORS and security headers
- ✅ Environment configuration
- ✅ User CRUD module example

## Prerequisites

- Node.js 18+
- PostgreSQL/MySQL/SQLite database

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update `DATABASE_URL` with your database connection string.

### 3. Setup Database

Generate Prisma client:

```bash
npm run prisma:generate
```

Run migrations:

```bash
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Prisma schema
├── src/
│   ├── config/                # Configuration files
│   │   ├── database.config.ts # Database connection
│   │   └── env.config.ts      # Environment variables
│   ├── core/                  # Core utilities
│   │   ├── decorators/        # Utility decorators
│   │   ├── errors/            # Custom error classes
│   │   └── utils/             # Helper utilities
│   ├── middlewares/           # Express middlewares
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── validation.middleware.ts
│   ├── modules/               # Feature modules
│   │   └── user/              # User module
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       ├── user.dto.ts
│   │       └── user.routes.ts
│   └── routes.ts              # Main routes
├── app.ts                     # Express app setup
├── server.ts                  # Server entry point
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:push` - Push schema changes to database

## API Endpoints

### Health Check

- `GET /health` - Check API health

### Users

- `POST /api/users` - Create user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Example Requests

Create a user:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123"
  }'
```

Get all users:

```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

## Adding New Modules

Use the polycore CLI to generate new modules:

```bash
polycore module <module-name>
```

Or manually create module directory: `src/modules/<module-name>/` with:

- `<module>.dto.ts` - Validation schemas
- `<module>.service.ts` - Business logic
- `<module>.controller.ts` - Request handlers
- `<module>.routes.ts` - Route definitions

Then register routes in `src/routes.ts`.

## Database Schema

Edit `prisma/schema.prisma` to add or modify models:

```prisma
model Product {
  id        String   @id @default(uuid())
  name      String
  price     Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("products")
}
```

Then run:

```bash
npm run prisma:migrate
```

## License

MIT
