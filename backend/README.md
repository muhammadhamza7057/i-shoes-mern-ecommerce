# I.Shoes Backend API

Express backend for the I.Shoes e-commerce platform, backed by Supabase PostgreSQL.

## Stack

Node.js, Express, Supabase PostgreSQL, JWT (access + refresh cookie), bcrypt, Zod, Helmet, CORS, express-rate-limit, Pino.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT secrets, CLIENT_ORIGIN
npm run seed:admin
npm run dev
```

Server: `http://localhost:5000`  
API base: `http://localhost:5000/api/v1`

## Supabase database setup

1. In the Supabase SQL editor, run `supabase/migrations/001_initial_schema.sql`.
2. Set `SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY` in `.env`.
3. Run `npm run verify:supabase`.

Do not put the service role key in the frontend or commit `.env`.

## Frontend integration

Set in frontend `.env`:

```
VITE_API_URL=http://localhost:5000/api/v1
```

Backend CORS uses `CLIENT_ORIGIN` (default `http://localhost:5173`).

Auth:
- Login/register return `{ success, data: { user, accessToken }, message }`
- Send `Authorization: Bearer <accessToken>` on protected routes
- Refresh token is an httpOnly cookie on `/api/v1/auth/refresh` (POST, credentials included)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with file watch |
| `npm start` | Production start |
| `npm run seed:admin` | Idempotent admin seed |
| `npm run verify:supabase` | Verify the configured Supabase connection |
| `npm test` | Integration tests (requires a configured Supabase project) |

## Modules

- `auth` — register, login, logout, refresh, me
- `users` — profile + password
- `categories` — public list/detail
- `products` — catalog with variants, featured, filters
- `cart` — server-side cart with stock checks
- `orders` — COD checkout, cancel, status lifecycle
- `inventory` — transactional reserve / release / sell
- `admin` — products, categories, orders, users list, dashboard

## Inventory rules

- Add to cart: checks `stock - reservedStock >= qty` (no write to reserved)
- Order placed: `reservedStock += qty` (transaction)
- Order cancelled: `reservedStock -= qty` (transaction)
- Order delivered: `stock -= qty`, `reservedStock -= qty`, `soldStock += qty` (transaction)

## Tests

```bash
npm test
```

The default test verifies the API health endpoint. Run the full auth, catalog, cart, and order flow against a configured Supabase project after applying the SQL migration and adding test data.
