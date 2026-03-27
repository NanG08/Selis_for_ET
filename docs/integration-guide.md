# Integration Guide

Back to [Docs Home](README.md) | Related: [Deployment Guide](deployment-guide.md)

## Environment Variables

Reference baseline: [/.env.example](../.env.example)

Required for backend:

- `JWT_SECRET`
- `MONGODB_URI`
- `BACKEND_PORT` (optional, default 3000)

Required for frontend AI features:

- `VITE_GEMINI_API_KEY`

Optional for frontend API target:

- `VITE_API_URL`

## Frontend <-> Backend Integration

Code: [frontend/src/lib/api.ts](../frontend/src/lib/api.ts)

Behavior:

- Adds `Authorization` header using `selis_token` from `localStorage`
- Constructs API URL from `VITE_API_URL` or `/api`
- Throws enriched errors using backend JSON `error` field where available

Dev proxy setup:

- [frontend/vite.config.ts](../frontend/vite.config.ts) proxies `/api` to `http://localhost:3000`

## Backend <-> MongoDB Integration

Code:

- Connection and route handlers: [backend/server.ts](../backend/server.ts)
- Schemas and models: [backend/lib/models.ts](../backend/lib/models.ts)

Notes:

- If `MONGODB_URI` is missing or connection fails, auth routes return `503`.
- All financial records are user-scoped by `userId`.

## Gemini Integration

Code:

- Chat prompt wrapper: [frontend/src/lib/gemini.ts](../frontend/src/lib/gemini.ts)
- Chat UI flow: [frontend/src/components/AIChat.tsx](../frontend/src/components/AIChat.tsx)
- Transaction description suggestions: [frontend/src/components/TransactionList.tsx](../frontend/src/components/TransactionList.tsx)

Notes:

- If `VITE_GEMINI_API_KEY` is missing, warnings are logged and fallback behavior appears.
- Model currently used: `gemini-3-flash-preview`.

## External Service Integrations

- Browser geolocation and reverse geocoding (Nominatim) in dashboard location widget.
- CSV file export generated in browser on transactions page.

## Security and Data Notes

- JWT tokens are stored in browser `localStorage`.
- Passwords are hashed with `bcryptjs`.
- CORS allow-list is enforced in production mode.

## Related Docs

- [Architecture](architecture.md)
- [API Reference](api-reference.md)
