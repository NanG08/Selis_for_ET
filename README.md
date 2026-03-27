# Selis

AI-powered personal and business finance workspace with plan-aware dashboards, budgeting, transactions, goals, subscriptions, and assistant-guided insights.

## Highlights

- Multi-plan UX: personal, family, freelancer, small_business, enterprise
- Full-stack TypeScript architecture (React + Express + MongoDB)
- JWT-secured API with user-scoped financial records
- Gemini-powered assistant and smart transaction description suggestions
- Responsive card + table UI with animated transitions

## Documentation Hub

All project docs live in [docs/README.md](docs/README.md).

- Architecture: [docs/architecture.md](docs/architecture.md)
- Design: [docs/design.md](docs/design.md)
- Workflows: [docs/workflows.md](docs/workflows.md)
- API Reference: [docs/api-reference.md](docs/api-reference.md)
- Integration Guide: [docs/integration-guide.md](docs/integration-guide.md)
- Deployment Guide: [docs/deployment-guide.md](docs/deployment-guide.md)

## Tech Stack

- Frontend: React 19, Vite 6, TypeScript, Tailwind CSS, Recharts, Motion
- Backend: Express 4, TypeScript, Mongoose, JWT, bcryptjs, CORS, dotenv
- AI: `@google/genai` with Gemini model integration
- Database: MongoDB

## Project Layout

```text
Selis_for_ET/
  backend/
    server.ts
    lib/models.ts
  frontend/
    src/
      App.tsx
      components/
      lib/
  docs/
    README.md
    architecture.md
    design.md
    workflows.md
    api-reference.md
    integration-guide.md
    deployment-guide.md
```

## Quick Start

### 1. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure environment

Copy [.env.example](.env.example) to `.env` in the project root and set values.

### 3. Start backend

```bash
cd backend
npx tsc -p tsconfig.json
npm start
```

### 4. Start frontend

```bash
cd frontend
npm run dev
```

Frontend default: `http://localhost:5173`.

## Core Source References

- Backend API and middleware: [backend/server.ts](backend/server.ts)
- Backend data schemas: [backend/lib/models.ts](backend/lib/models.ts)
- Frontend routing shell: [frontend/src/App.tsx](frontend/src/App.tsx)
- Frontend API client: [frontend/src/lib/api.ts](frontend/src/lib/api.ts)
- Gemini integration: [frontend/src/lib/gemini.ts](frontend/src/lib/gemini.ts)

## Current Known Gaps

- Transaction delete is UI-only in [frontend/src/components/TransactionList.tsx](frontend/src/components/TransactionList.tsx).
- Invoice manager currently uses mock entries in [frontend/src/components/InvoiceManager.tsx](frontend/src/components/InvoiceManager.tsx).
- Backend has no dedicated `build` script in [backend/package.json](backend/package.json).

## Contribution

1. Fork the repository.
2. Create a feature branch.
3. Commit with clear messages.
4. Open a pull request with test notes.

## License

Licensed under Apache 2.0. See [LICENSE](LICENSE).