# Deployment Guide

Back to [Docs Home](README.md) | Related: [Integration Guide](integration-guide.md)

## Prerequisites

- Node.js 22+
- npm 10+
- MongoDB instance

## Local Development

### 1. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure environment

Create a root `.env` file from [/.env.example](../.env.example) and set real values.

### 3. Run backend

Current backend scripts:

- `npm run dev` uses `tsc-watch` + `npm start`
- `npm start` runs `node dist/server.js`

Compile backend once before `start`:

```bash
cd backend
npx tsc -p tsconfig.json
npm start
```

### 4. Run frontend

```bash
cd frontend
npm run dev
```

Frontend runs on Vite default `5173` and proxies `/api` to backend.

## Production Build

### Backend

```bash
cd backend
npx tsc -p tsconfig.json
node dist/server.js
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

Output is generated in `frontend/dist`.

## Deployment Checklist

- Set `NODE_ENV=production`
- Set secure `JWT_SECRET`
- Set reachable `MONGODB_URI`
- Set frontend `VITE_API_URL` to deployed backend base URL
- Set `VITE_GEMINI_API_KEY` for AI features
- Verify CORS allow-list in [backend/server.ts](../backend/server.ts)

## Runtime Verification

- Health endpoint: `GET /api/health`
- Login flow: verify token issuance and protected route access
- AI chat: verify Gemini response path
- Critical pages: dashboard, transactions, budgets, goals, subscriptions

## Known Deployment Caveats

- Backend package currently has no explicit `build` script.
- Invoices page currently serves mock data.
- Transaction delete is not wired to backend delete endpoint.

## Related Docs

- [API Reference](api-reference.md)
- [Workflow Guide](workflows.md)
