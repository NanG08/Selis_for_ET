# Selis Documentation Hub

Welcome to the official Selis project documentation. Selis is an AI-powered, multi-plan financial management platform built with React, Express, MongoDB, and Google Gemini.

## Quick Navigation

| Document | Description |
|----------|-------------|
| [Architecture](architecture.md) | System design, data flow, runtime architecture, and module map |
| [API Reference](api-reference.md) | Complete REST API documentation with request/response schemas |
| [Workflow Guide](workflows.md) | End-to-end user flows for every major feature |
| [Design System](design.md) | UI/UX principles, visual language, component patterns, and plan-aware UX |
| [Integration Guide](integration-guide.md) | Third-party services, environment variables, and wiring details |
| [Deployment Guide](deployment-guide.md) | Local development, production builds, and deployment checklists |
| [SRS Document](../SRS.md) | Software Requirements Specification — comprehensive system requirements |

## Recommended Reading Order

1. **[Architecture](architecture.md)** — Start here to understand how the system is structured
2. **[Design System](design.md)** — Understand the UI philosophy and component patterns
3. **[Workflow Guide](workflows.md)** — Follow how each feature works end-to-end
4. **[API Reference](api-reference.md)** — Dive into the backend endpoints and data contracts
5. **[Integration Guide](integration-guide.md)** — Learn how external services are wired in
6. **[Deployment Guide](deployment-guide.md)** — Get the app running locally or in production

## Scope

This documentation set covers the complete Selis platform as implemented in the current codebase:

### Backend (`backend/`)
- Express 4 REST API server with TypeScript (ESM modules)
- MongoDB database with Mongoose ODM (5 collections: User, Transaction, Budget, Goal, Subscription)
- JWT-based authentication with bcryptjs password hashing
- CORS-protected endpoints with environment-based configuration

### Frontend (`frontend/`)
- React 19 SPA with TypeScript, built with Vite 6
- Tailwind CSS 4 design system with Inter and JetBrains Mono typography
- 9 component modules covering dashboard, transactions, budgets, goals, subscriptions, invoices, AI chat, and plan-specific features
- Google Gemini integration for AI financial assistant ("Sally") and AI-powered transaction description suggestions
- Recharts for data visualization (area charts, pie charts)
- Framer Motion for smooth animations and page transitions
- React Router DOM 7 for client-side routing with auth guards
- Browser Geolocation API + Nominatim reverse geocoding for location widget
- CSV export functionality for transactions

### Plan Architecture (5 plans)
- **Personal** — Spending discipline score, emergency fund tracker, subscription management
- **Family** — Kid allowance tracking, joint expense splitting, shared goals
- **Freelancer** — Cash flow gap detection, income smoothing, tax estimation, retirement planning, invoice management
- **Small Business** — Cash flow runway, GST tracking, vendor management
- **Enterprise** — Department budgets, spend policy enforcement, approval workflows, audit trails

## Known Product Gaps (Current Code)

| Gap | Location | Status |
|-----|----------|--------|
| Transaction delete is UI-only (no backend endpoint) | [TransactionList.tsx](../frontend/src/components/TransactionList.tsx) | Frontend filters locally |
| Invoice management uses mock data | [InvoiceManager.tsx](../frontend/src/components/InvoiceManager.tsx) | Backend endpoints pending |
| No explicit `build` script in backend `package.json` | [package.json](../backend/package.json) | Use `npx tsc -p tsconfig.json` |
| Plan-specific features (vendors, approvals, reports, retirement) use mock/placeholder data | [PlanFeature.tsx](../frontend/src/components/PlanFeature.tsx) | Backend endpoints pending |
| Budget and Goal delete operations not implemented | BudgetBuilder.tsx, GoalTracker.tsx | Delete buttons are non-functional |
| "Add Funds" button in GoalTracker is non-functional | [GoalTracker.tsx](../frontend/src/components/GoalTracker.tsx) | UI placeholder only |
| Dashboard chart data is hardcoded | [Dashboard.tsx](../frontend/src/components/Dashboard.tsx) | Monthly cashflow chart uses static mock data |
| Settings modal only updates display name locally | [Layout.tsx](../frontend/src/components/Layout.tsx) | No backend endpoint for user profile updates |

## Cross-Links

- Return to root overview: [Project README](../README.md)
- Complete system requirements: [SRS Document](../SRS.md)
- For backend runtime and API behavior: [API Reference](api-reference.md)
- For environment setup and service wiring: [Integration Guide](integration-guide.md)
