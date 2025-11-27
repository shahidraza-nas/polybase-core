# SQL API Project

Backend API project with SQL database support using Sequelize.

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Copy the environment example file:

```bash
cp .env.example .env
```

Update the DATABASE_URL in `.env` with your database credentials.

### Database Setup

Run migrations:

```bash
npm run db:migrate
```

Seed database (optional):

```bash
npm run db:seed
```

### Development

Start the development server:

```bash
npm run dev
```

The server will start on http://localhost:3000

### Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API information

## Tech Stack

- Node.js + TypeScript
- Express.js
- Sequelize (SQL ORM)
- PostgreSQL (or your preferred SQL database)
