# API Reference

Back to [Docs Home](README.md) | Related: [Workflow Guide](workflows.md)

Base URL:

- Dev (frontend): `/api` via Vite proxy
- Direct backend: `http://localhost:3000/api`

Auth header for protected routes:

- `Authorization: Bearer <jwt>`

## Health

### GET /health

Returns server status and Mongo connection state.

Response:

```json
{
  "status": "ok",
  "mongo": 1
}
```

## Authentication

### POST /auth/register

Body:

```json
{
  "email": "user@example.com",
  "password": "secret",
  "name": "Alex",
  "plan": "personal"
}
```

Response:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "email": "user@example.com",
    "name": "Alex",
    "plan": "personal"
  }
}
```

### POST /auth/login

Body:

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

Response: same shape as register.

Common errors:

- `401` invalid credentials
- `503` DB connection not established

## Transactions

### GET /transactions

Returns all transactions for authenticated user (newest first).

### POST /transactions

Body:

```json
{
  "amount": 1200,
  "category": "Food",
  "date": "2026-03-27",
  "description": "Groceries",
  "type": "expense",
  "planContext": "personal"
}
```

## Budgets

### GET /budgets

Returns all budgets for authenticated user.

### POST /budgets

Body:

```json
{
  "category": "Food",
  "limitAmount": 15000,
  "planContext": "personal"
}
```

## Goals

### GET /goals

Returns all goals for authenticated user.

### POST /goals

Body:

```json
{
  "name": "Emergency Fund",
  "targetAmount": 100000,
  "currentAmount": 25000,
  "deadline": "2026-12-31",
  "planContext": "personal"
}
```

## Subscriptions

### GET /subscriptions

Returns all subscriptions for authenticated user.

### POST /subscriptions

Body:

```json
{
  "name": "Netflix",
  "amount": 649,
  "frequency": "monthly",
  "nextBillingDate": "2026-04-15",
  "planContext": "personal"
}
```

### DELETE /subscriptions/:id

Deletes a subscription by id for authenticated user.

Response:

```json
{
  "success": true
}
```

## Error Shape

Most API errors return:

```json
{
  "error": "message"
}
```

## Source of Truth

- API implementation: [backend/server.ts](../backend/server.ts)
- Data models: [backend/lib/models.ts](../backend/lib/models.ts)
