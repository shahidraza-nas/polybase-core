# Polycore

A powerful CLI tool for generating production-ready Node.js + TypeScript backend boilerplates with flexible database support (SQL, NoSQL, or Hybrid).

## Features

- Multiple database modes: SQL, NoSQL, or Hybrid
- TypeScript + ESM modules
- Express.js server setup
- Prisma for SQL databases
- Mongoose for MongoDB
- Production-ready project structure
- Auto-generate modules and models
- System health checks

## Installation

```bash
npm install -g polycore-cli
```

## Usage

### Initialize a New Project

```bash
polycore init my-project
```

You will be prompted to:

- Choose database type (SQL, NoSQL, or Hybrid)
- Initialize Git repository
- Install dependencies

### Generate Resources

```bash
# Generate command (coming soon)
polycore generate module users
```

*Note: Module generation feature is planned for a future release.*

### System Check

```bash
polycore doctor
```

## Project Structure

Generated projects follow this structure:

```
my-project/
├── src/
│   ├── config/              # Database & environment config
│   ├── core/                # Utilities, errors, decorators
│   ├── middlewares/         # Error handler, logger, validation
│   ├── modules/
│   │   └── user/            # Example CRUD module
│   └── routes.ts            # API routes
├── prisma/                  # Prisma schema (SQL modes)
├── app.ts                   # Express app configuration
├── server.ts                # Server entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Database Modes

### SQL Mode

- Choose between Prisma or Sequelize as ORM
- Supports PostgreSQL, MySQL, SQLite
- Includes migration tools

### NoSQL Mode

- Uses Mongoose as ODM
- MongoDB support
- Schema validation

### Hybrid Mode

- Combines both SQL and NoSQL
- Choose your SQL ORM (Prisma or Sequelize)
- Use the right database for the right data
- Unified service layer

## Development

```bash
# Install dependencies
npm install

# Build the CLI
npm run build

# Test locally
npm link

# Run tests
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
