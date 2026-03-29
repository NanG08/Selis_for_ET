# API Reference

Back to [Docs Home](README.md) | Related: [Workflow Guide](workflows.md) | [Architecture](architecture.md)

## Overview

The Selis backend exposes a RESTful API built on Express 4. All financial endpoints require JWT authentication. The API follows a consistent pattern of user-scoped data access.

### Base URLs

| Environment | URL | Notes |
|-------------|-----|-------|
| Dev (via Vite proxy) | `/api` | Frontend proxy at `localhost:5173` → `localhost:3000` |
| Direct backend | `http://localhost:3000/api` | For Postman/cURL testing |
| Production | `${VITE_API_URL}` | Configurable via environment variable |

### Authentication

All protected routes require the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

The JWT payload contains:
```json
{
  "id": "<mongodb-objectid>",
  "email": "user@example.com",
  "plan": "personal"
}
```

### Standard Error Response

All API errors return a consistent shape:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (e.g., duplicate email) |
| 401 | No token provided |
| 403 | Invalid or expired token |
| 500 | Internal server error |
| 503 | Database connection not established |

---

## Health Check

### `GET /api/health`

Returns server status and MongoDB connection readiness.

**Auth Required**: No

**Response `200`**:
```json
{
  "status": "ok",
  "mongo": 1
}
```

The `mongo` field maps to [Mongoose connection states](https://mongoosejs.com/docs/api/connection.html#Connection.prototype.readyState):
- `0` = disconnected
- `1` = connected
- `2` = connecting
- `3` = disconnecting

---

## Authentication

### `POST /api/auth/register`

Creates a new user account with the specified plan.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "Alex Kumar",
  "plan": "personal"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | Yes | Must be unique |
| `password` | string | Yes | Hashed with bcryptjs (10 salt rounds) |
| `name` | string | Yes | Display name |
| `plan` | string | No | Defaults to `'personal'`. Values: `personal`, `family`, `freelancer`, `small_business`, `enterprise` |

**Response `200`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "660a1b2c3d4e5f6789012345",
    "email": "user@example.com",
    "name": "Alex Kumar",
    "plan": "personal"
  }
}
```

**Error `400`**:
```json
{
  "error": "Email already exists or registration failed"
}
```

**Error `503`**:
```json
{
  "error": "Database connection not established. Please check your MONGODB_URI secret."
}
```

---

### `POST /api/auth/login`

Authenticates an existing user with email and password.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**Response `200`**: Same shape as register response.

**Error `401`**:
```json
{
  "error": "Invalid credentials"
}
```

**Error `503`**: Same as register.

---

## Transactions

### `GET /api/transactions`

Returns all transactions for the authenticated user, sorted by date (newest first).

**Auth Required**: Yes

**Response `200`**:
```json
[
  {
    "id": "660a1b2c3d4e5f6789012345",
    "_id": "660a1b2c3d4e5f6789012345",
    "userId": "660a1b2c3d4e5f6789012346",
    "amount": 1200,
    "category": "Food",
    "date": "2026-03-27",
    "description": "Weekly groceries",
    "type": "expense",
    "planContext": "personal",
    "createdAt": "2026-03-27T10:00:00.000Z",
    "updatedAt": "2026-03-27T10:00:00.000Z"
  }
]
```

---

### `POST /api/transactions`

Creates a new transaction for the authenticated user.

**Auth Required**: Yes

**Request Body**:
```json
{
  "amount": 1200,
  "category": "Food",
  "date": "2026-03-27",
  "description": "Weekly groceries",
  "type": "expense",
  "planContext": "personal"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `amount` | number | Yes | Transaction amount |
| `category` | string | Yes | Category name |
| `date` | string | Yes | ISO date string (YYYY-MM-DD) |
| `description` | string | No | Human-readable description |
| `type` | string | Yes | Must be `'income'` or `'expense'` |
| `planContext` | string | No | User's plan at time of creation |

**Response `200`**: Created transaction object with `id` field.

---

## Budgets

### `GET /api/budgets`

Returns all budgets for the authenticated user.

**Auth Required**: Yes

**Response `200`**:
```json
[
  {
    "id": "660a1b2c3d4e5f6789012345",
    "_id": "660a1b2c3d4e5f6789012345",
    "userId": "660a1b2c3d4e5f6789012346",
    "category": "Food",
    "limitAmount": 15000,
    "planContext": "personal",
    "createdAt": "2026-03-27T10:00:00.000Z",
    "updatedAt": "2026-03-27T10:00:00.000Z"
  }
]
```

---

### `POST /api/budgets`

Creates a new budget for the authenticated user.

**Auth Required**: Yes

**Request Body**:
```json
{
  "category": "Food",
  "limitAmount": 15000,
  "planContext": "personal"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `category` | string | Yes | Budget category name |
| `limitAmount` | number | Yes | Monthly spending limit |
| `planContext` | string | No | User's plan context |

**Response `200`**: Created budget object with `id` field.

---

## Goals

### `GET /api/goals`

Returns all financial goals for the authenticated user.

**Auth Required**: Yes

**Response `200`**:
```json
[
  {
    "id": "660a1b2c3d4e5f6789012345",
    "_id": "660a1b2c3d4e5f6789012345",
    "userId": "660a1b2c3d4e5f6789012346",
    "name": "Emergency Fund",
    "targetAmount": 100000,
    "currentAmount": 25000,
    "deadline": "2026-12-31",
    "planContext": "personal",
    "createdAt": "2026-03-27T10:00:00.000Z",
    "updatedAt": "2026-03-27T10:00:00.000Z"
  }
]
```

---

### `POST /api/goals`

Creates a new financial goal for the authenticated user.

**Auth Required**: Yes

**Request Body**:
```json
{
  "name": "Emergency Fund",
  "targetAmount": 100000,
  "currentAmount": 25000,
  "deadline": "2026-12-31",
  "planContext": "personal"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | Goal name |
| `targetAmount` | number | Yes | Target savings amount |
| `currentAmount` | number | No | Defaults to `0` |
| `deadline` | string | No | ISO date string |
| `planContext` | string | No | User's plan context |

**Response `200`**: Created goal object with `id` field.

---

## Subscriptions

### `GET /api/subscriptions`

Returns all subscriptions for the authenticated user.

**Auth Required**: Yes

**Response `200`**:
```json
[
  {
    "id": "660a1b2c3d4e5f6789012345",
    "_id": "660a1b2c3d4e5f6789012345",
    "userId": "660a1b2c3d4e5f6789012346",
    "name": "Netflix",
    "amount": 649,
    "frequency": "monthly",
    "nextBillingDate": "2026-04-15",
    "planContext": "personal",
    "createdAt": "2026-03-27T10:00:00.000Z",
    "updatedAt": "2026-03-27T10:00:00.000Z"
  }
]
```

---

### `POST /api/subscriptions`

Creates a new subscription for the authenticated user.

**Auth Required**: Yes

**Request Body**:
```json
{
  "name": "Netflix",
  "amount": 649,
  "frequency": "monthly",
  "nextBillingDate": "2026-04-15",
  "planContext": "personal"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | Yes | Service name |
| `amount` | number | Yes | Subscription cost |
| `frequency` | string | Yes | Must be `'monthly'` or `'annual'` |
| `nextBillingDate` | string | No | Next billing date (YYYY-MM-DD) |
| `planContext` | string | No | User's plan context |

**Response `200`**: Created subscription object with `id` field.

---

### `DELETE /api/subscriptions/:id`

Deletes a subscription by its ID for the authenticated user.

**Auth Required**: Yes

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId of the subscription |

**Response `200`**:
```json
{
  "success": true
}
```

---

## Frontend API Client

The frontend API client ([api.ts](../frontend/src/lib/api.ts)) provides a typed wrapper:

```typescript
api.auth.login(credentials)        // POST /auth/login
api.auth.register(userData)        // POST /auth/register
api.transactions.getAll()          // GET /transactions
api.transactions.create(data)      // POST /transactions
api.budgets.getAll()               // GET /budgets
api.budgets.create(data)           // POST /budgets
api.goals.getAll()                 // GET /goals
api.goals.create(data)             // POST /goals
api.subscriptions.getAll()         // GET /subscriptions
api.subscriptions.create(data)     // POST /subscriptions
api.subscriptions.delete(id)       // DELETE /subscriptions/:id
```

### URL Construction

The API client constructs URLs dynamically:
- If `VITE_API_URL` ends with `/api`: appends the endpoint directly
- Otherwise: inserts `/api` between base URL and endpoint
- Default fallback: `/api` (uses Vite proxy in development)

---

## Source of Truth

- API implementation: [backend/server.ts](../backend/server.ts)
- Data models: [backend/lib/models.ts](../backend/lib/models.ts)
- Frontend API client: [frontend/src/lib/api.ts](../frontend/src/lib/api.ts)
