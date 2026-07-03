# Job Portal Backend

MERN stack backend for a scalable job portal platform.

## Prerequisites

- Node.js 18 or later
- MongoDB Atlas cluster
- npm or yarn

## Setup

1. Clone the repository and navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment template and fill in your values:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB Atlas connection string and other credentials.

## Running the Server

Development (with auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

## Environment Variables

See `.env.example` for all supported variables. Required for local development:

- `MONGODB_URI` — MongoDB Atlas connection string
- `PORT` — Server port (default: `5000`)

## Testing

```bash
npm test
```

## Project Structure

```
src/
├── config/         # Database and third-party integrations
├── constants/      # App-wide constants
├── controllers/    # Request handlers
├── middlewares/    # Express middleware
├── models/         # Mongoose schemas
├── routes/         # Route definitions
├── services/       # Business logic layer
├── utils/          # Shared utilities
├── validators/     # Request validation schemas
├── jobs/           # Background jobs (future)
├── seeds/          # Database seed scripts (future)
└── tests/          # Test suites
```
