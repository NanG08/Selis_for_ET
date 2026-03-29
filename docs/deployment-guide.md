# Deployment Guide

Back to [Docs Home](README.md) | Related: [Integration Guide](integration-guide.md) | [Architecture](architecture.md)

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 22+ | Required for ESM and modern APIs |
| npm | 10+ | Package manager |
| MongoDB | 6+ | Local instance or cloud (MongoDB Atlas) |
| Google Gemini API Key | — | Required for AI features |

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd Selis_for_ET
```

### Step 2: Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configure Environment

Create a `.env` file in the **project root** (`Selis_for_ET/.env`):

```env
# Authentication
JWT_SECRET=your-secure-random-string-here

# Database
MONGODB_URI=mongodb://localhost:27017/selis

# Backend Server
BACKEND_PORT=3000

# Frontend AI Features
VITE_GEMINI_API_KEY=your-gemini-api-key-from-ai-studio

# Frontend API URL (only needed for production)
VITE_API_URL=http://localhost:3000/api
```

> **Important**: The `.env` file is loaded from the project root by both backend (`dotenv` with path `../`) and frontend (`Vite loadEnv` from `../../`).

### Step 4: Start MongoDB

**Local MongoDB**:
```bash
mongod --dbpath /data/db
```

**MongoDB Atlas** (cloud):
- Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Set `MONGODB_URI` to your connection string:
  ```
  MONGODB_URI=mongodb+srv://you_username:your_password@cluster.mongodb.net/selis
  ```

### Step 5: Compile & Start Backend

**Terminal 1**:
```bash
cd backend
npx tsc -p tsconfig.json    # Compile TypeScript to dist/
npm start                     # Start server: node dist/server.js
```

Or use the dev script with auto-reload:
```bash
cd backend
npm run dev                   # Uses tsc-watch + auto-restart
```

**Expected output**:
```
Connected to MongoDB
Backend server running on http://localhost:3000
```

### Step 6: Start Frontend

**Terminal 2**:
```bash
cd frontend
npm run dev                   # Vite dev server
```

**Expected output**:
```
VITE v6.x.x  ready in XXXms

    Local:   http://localhost:5173/
```

### Step 7: Verify Setup

| Check | URL | Expected Response |
|-------|-----|-------------------|
| Frontend loads | `http://localhost:5173` | Login/Register page |
| Backend health | `http://localhost:3000/api/health` | `{"status":"ok","mongo":1}` |
| API proxy works | `http://localhost:5173/api/health` | Same as above (proxied) |

### Step 8: Test Core Flows

1. **Register**: Create an account with any plan
2. **Login**: Verify JWT token storage and redirect
3. **Dashboard**: Check stats cards and plan widgets load
4. **Add Transaction**: Create in modal, verify it appears in list
5. **AI Chat**: Send a message, verify Gemini responds
6. **Location Widget**: Allow geolocation, verify address appears

---

## Production Build

### Backend Build

```bash
cd backend
npx tsc -p tsconfig.json    # Compiles to backend/dist/
```

**Output**: `backend/dist/server.js` and `backend/dist/lib/models.js`

**Run**:
```bash
NODE_ENV=production node dist/server.js
```

### Frontend Build

```bash
cd frontend
npm run build                 # Vite production build
```

**Output**: `frontend/dist/` — static files ready for serving

**Preview locally**:
```bash
npm run preview               # Serves built files on port 4173
```

### Serving in Production

The frontend is a static SPA that needs:
1. A static file server (Nginx, Caddy, Vercel, etc.)
2. All routes must fallback to `index.html` for client-side routing
3. `VITE_API_URL` must point to the deployed backend

**Example Nginx config**:
```nginx
server {
    listen 80;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Deployment Checklist

### Environment

- [ ] `NODE_ENV=production` set on backend
- [ ] Strong, unique `JWT_SECRET` configured (not the default)
- [ ] `MONGODB_URI` pointing to production database
- [ ] `VITE_GEMINI_API_KEY` set for AI features
- [ ] `VITE_API_URL` set to deployed backend URL

### Security

- [ ] CORS allow-list updated in `backend/server.ts` with production origins
- [ ] HTTPS enabled on all endpoints
- [ ] MongoDB authentication enabled with strong credentials
- [ ] Environment variables stored securely (not in code)

### Performance

- [ ] MongoDB indexes verified for `email` (unique) and `userId` fields
- [ ] Frontend assets served with caching headers
- [ ] Gzip/Brotli compression enabled on static assets
- [ ] CDN configured for frontend static files (optional)

### Monitoring

- [ ] Health endpoint monitored: `GET /api/health`
- [ ] MongoDB connection state tracked (`mongo` field in health response)
- [ ] Error logging configured for backend (currently uses `console.error`)
- [ ] Frontend error tracking configured (e.g., Sentry)

---

## Runtime Verification

After deployment, verify each critical path:

| Test | Method | Expected |
|------|--------|----------|
| Health check | `GET /api/health` | `{"status":"ok","mongo":1}` |
| Registration | POST to `/api/auth/register` | `200` with token |
| Login | POST to `/api/auth/login` | `200` with token |
| Protected route | GET `/api/transactions` with Bearer | `200` with array |
| Unauthorized | GET `/api/transactions` without token | `401` |
| Frontend render | Open browser to frontend URL | Login page loads |
| Full flow | Register → Dashboard → Add Transaction → AI Chat | All work |

---

## Known Deployment Caveats

| Issue | Impact | Workaround |
|-------|--------|-----------|
| No `build` script in backend `package.json` | Must manually run `npx tsc -p tsconfig.json` | Add `"build": "tsc -p tsconfig.json"` to scripts |
| Invoice page uses mock data | Invoices show placeholder data | Acceptable for demo; backend endpoints needed for production |
| Transaction delete is UI-only | Deleted transactions reappear on refresh | Add `DELETE /api/transactions/:id` endpoint |
| JWT has no expiration | Tokens never expire | Add `expiresIn: '7d'` to `jwt.sign()` options |
| Gemini API key in client bundle | Key visible in browser DevTools | Move AI calls to backend proxy |
| Dashboard chart uses hardcoded data | Monthly cashflow chart is not real | Implement data aggregation endpoint |
| No database migrations | Schema changes require manual handling | Use a migration tool for production |

---

## Docker Deployment (Future)

A sample `docker-compose.yml` structure for containerized deployment:

```yaml
# Example structure (not currently implemented)
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/selis
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "80:80"

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## Related Docs

- [API Reference](api-reference.md) — Endpoint documentation
- [Integration Guide](integration-guide.md) — Service wiring details
- [Workflow Guide](workflows.md) — Feature verification steps
