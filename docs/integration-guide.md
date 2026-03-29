# Integration Guide

Back to [Docs Home](README.md) | Related: [Deployment Guide](deployment-guide.md) | [Architecture](architecture.md)

This guide documents how all external services and internal modules are wired together in the Selis platform.

---

## Environment Variables

Reference baseline: [.env.example](../.env.example)

### Complete Variable Reference

| Variable | Required By | Default | Description |
|----------|-------------|---------|-------------|
| `JWT_SECRET` | Backend | `'selis-secret-key'` | Secret key for signing JWT tokens. **Must be changed in production** |
| `MONGODB_URI` | Backend | None | MongoDB connection string (e.g., `mongodb://localhost:27017/selis`) |
| `BACKEND_PORT` | Backend | `3000` | Port for the Express server |
| `VITE_GEMINI_API_KEY` | Frontend | None | Google Gemini API key for AI features |
| `VITE_API_URL` | Frontend | `/api` | Backend API base URL (for production builds) |
| `APP_URL` | Optional | None | Self-referential URL for deployed application |

### .env File Location

The `.env` file must be placed in the **project root** (`Selis_for_ET/`).

- Backend loads it via: `dotenv.config({ path: path.join(process.cwd(), '../.env') })`
- Frontend loads `VITE_*` variables via: Vite's `loadEnv(mode, '../..', 'VITE_')` in `vite.config.ts`

### Warning Behaviors

| Missing Variable | Behavior |
|-----------------|----------|
| `MONGODB_URI` | Console warning; auth routes return `503 Service Unavailable` |
| `VITE_GEMINI_API_KEY` | Console warning; AI features fail gracefully with fallback message |
| `JWT_SECRET` | Falls back to `'selis-secret-key'` (insecure for production) |

---

## Frontend ↔ Backend Integration

### API Client

Code: [frontend/src/lib/api.ts](../frontend/src/lib/api.ts)

The `fetchWithAuth` function provides:

1. **Automatic JWT Injection**: Reads `selis_token` from `localStorage` and adds `Authorization: Bearer <token>` header
2. **Content-Type**: Always sends `Content-Type: application/json`
3. **Smart URL Construction**:
   - If `VITE_API_URL` ends with `/api` → appends endpoint directly
   - Otherwise → inserts `/api` between base and endpoint
   - Default: `/api` (leverages Vite proxy in development)
4. **Error Enrichment**: Parses error JSON from backend and throws with `error` field message

### API Object Structure

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

### Dev Proxy Configuration

In [vite.config.ts](../frontend/vite.config.ts):

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path,  // No path rewriting
    },
  },
}
```

This means:
- Frontend dev server: `localhost:5173`
- API requests to `/api/*` are proxied to `localhost:3000/api/*`
- No CORS issues during development

---

## Backend ↔ MongoDB Integration

### Connection

Code: [backend/server.ts](../backend/server.ts) (lines 54-63)

```typescript
if (MONGODB_URI) {
  await mongoose.connect(MONGODB_URI);
} else {
  console.warn('MONGODB_URI not found...');
}
```

- Connection is attempted once at server startup
- No retry logic or reconnection handling
- Health endpoint reports connection state: `mongoose.connection.readyState`

### Models

Code: [backend/lib/models.ts](../backend/lib/models.ts)

5 Mongoose models with schemas:

| Model | Collection | Key Indexes |
|-------|-----------|-------------|
| `User` | `users` | `email` (unique) |
| `Transaction` | `transactions` | `userId` (ref: User) |
| `Budget` | `budgets` | `userId` (ref: User) |
| `Goal` | `goals` | `userId` (ref: User) |
| `Subscription` | `subscriptions` | `userId` (ref: User) |

All models use `{ timestamps: true }` for automatic `createdAt` and `updatedAt`.

### Data Scoping

All financial data queries are scoped to the authenticated user:
```typescript
Transaction.find({ userId: req.user.id })
```

This ensures complete tenant isolation at the query level.

---

## Gemini AI Integration

### Configuration

Code: [frontend/src/lib/gemini.ts](../frontend/src/lib/gemini.ts)

```typescript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'dummy-key' });
```

- SDK: `@google/genai` v1.29.0+
- Model: `gemini-3-flash-preview`
- Called directly from the frontend (no backend proxy)

### AI Chat System Prompt

The system instruction is dynamically built per-plan:

```
You are Sally, a financial assistant for Selis.
You provide concise, helpful financial advice based on the user's plan ([plan]) and financial data.
Plan Focus: [plan-specific guidance]
Keep responses under 120 words. Be conversational but professional.
User context: [transactions + budgets JSON]
```

### Transaction Description Suggestions

Code: [frontend/src/components/TransactionList.tsx](../frontend/src/components/TransactionList.tsx)

Uses Gemini with structured output (JSON schema):

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: `Suggest 3 short common transaction descriptions for category "${category}" and type "${type}".`,
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  }
});
```

### Error Handling

- Missing API key: Console warning, `GoogleGenAI` initialized with `'dummy-key'`
- API failure: Returns fallback message — "I'm sorry, I'm having trouble connecting to my brain right now."

---

## Geolocation Integration

### Browser Geolocation API

Code: [frontend/src/components/Dashboard.tsx](../frontend/src/components/Dashboard.tsx) — `LocationWidget`

**Flow**:
1. Check `navigator.geolocation` support
2. Call `navigator.geolocation.getCurrentPosition()`
3. On success: extract `latitude` and `longitude`
4. On error: display error message (e.g., "User denied Geolocation")

### Nominatim Reverse Geocoding

**Endpoint**: `https://nominatim.openstreetmap.org/reverse`

**Parameters**:
```
format=json&lat=${latitude}&lon=${longitude}
```

**Response used**: `data.display_name` — full formatted address string

**No API key required** — Nominatim is a free OpenStreetMap service. However, it has usage limits; for production, consider self-hosting or using a commercial geocoding service.

---

## CSV Export Integration

Code: [frontend/src/components/TransactionList.tsx](../frontend/src/components/TransactionList.tsx)

**Implementation**: Client-side CSV generation
- Creates CSV string with headers: `Description, Category, Date, Amount, Type`
- Wraps text fields in quotes to handle commas
- Creates a `Blob` with MIME type `text/csv;charset=utf-8;`
- Triggers download via temporary `<a>` element
- Filename format: `transactions_YYYY-MM-DD.csv`

No server interaction required.

---

## Authentication Integration

### JWT Token Flow

| Step | Action | Storage |
|------|--------|---------|
| 1 | User logs in / registers | — |
| 2 | Backend generates JWT with `{id, email, plan}` | — |
| 3 | Frontend receives `{token, user}` | — |
| 4 | Token stored | `localStorage.selis_token` |
| 5 | User data stored | `localStorage.selis_user` |
| 6 | Subsequent API calls | `Authorization: Bearer <token>` |
| 7 | Backend verifies token | `jwt.verify(token, JWT_SECRET)` |

### Password Security

- Hashing: `bcryptjs` with 10 salt rounds
- Comparison: `bcrypt.compare(plainText, hashedPassword)`
- Plain passwords are never stored or transmitted after initial registration

### CORS Security

Production CORS allow-list (hardcoded in `server.ts`):
```
http://localhost:5173
http://localhost:3000
https://8qvhlfbw-5173.inc1.devtunnels.ms
http://127.0.0.1:5173
http://127.0.0.1:3000
```

Development mode (`NODE_ENV !== 'production'`): All origins allowed

### Security Considerations

| Aspect | Current State | Recommendation |
|--------|--------------|----------------|
| JWT Storage | `localStorage` | Consider `httpOnly` cookies for XSS protection |
| JWT Expiry | No expiration set | Add `expiresIn` option to `jwt.sign()` |
| Rate Limiting | None | Add `express-rate-limit` for auth endpoints |
| Input Validation | Minimal | Add `express-validator` or `zod` for request validation |
| HTTPS | Not enforced | Enable in production deployment |
| Gemini API Key | Exposed in client bundle | Move to backend proxy route |

---

## Related Docs

- [Architecture](architecture.md) — System design overview
- [API Reference](api-reference.md) — Endpoint specifications
- [Deployment Guide](deployment-guide.md) — Production setup
