# Hybrid API Project

Backend API project with both SQL and NoSQL database support using Sequelize and Mongoose.

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

Update both DATABASE_URL and MONGODB_URI in `.env` with your database credentials.

### Database Setup

Run SQL migrations:

```bash
npm run db:migrate
```

Seed database (optional):

```bash
npm run db:seed
```

Make sure MongoDB is running on your system or use a cloud service like MongoDB Atlas.

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
- Mongoose (MongoDB ODM)
- PostgreSQL + MongoDB
