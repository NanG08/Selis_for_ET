# Selis Documentation

Welcome to the official Selis project documentation.

## Quick Navigation

- [Architecture](architecture.md)
- [Design](design.md)
- [Workflow Guide](workflows.md)
- [API Reference](api-reference.md)
- [Integration Guide](integration-guide.md)
- [Deployment Guide](deployment-guide.md)

## Recommended Reading Order

1. [Architecture](architecture.md)
2. [Workflow Guide](workflows.md)
3. [API Reference](api-reference.md)
4. [Integration Guide](integration-guide.md)
5. [Deployment Guide](deployment-guide.md)
6. [Design](design.md)

## Scope

This docs set is based on the current code in `backend` and `frontend`, including:

- Express + MongoDB backend with JWT auth
- React + Vite frontend with plan-specific UI and routes
- Gemini integration for AI assistant and transaction suggestions

## Known Product Gaps (Current Code)

- Transaction delete currently updates UI state only in [frontend/src/components/TransactionList.tsx](../frontend/src/components/TransactionList.tsx).
- Invoice management currently uses mock data in [frontend/src/components/InvoiceManager.tsx](../frontend/src/components/InvoiceManager.tsx).
- A backend build script is not defined in [backend/package.json](../backend/package.json); use `npx tsc -p tsconfig.json`.

## Cross-Links

- Return to root overview: [Project README](../README.md)
- For backend runtime and API behavior: [API Reference](api-reference.md)
- For environment setup and service wiring: [Integration Guide](integration-guide.md)
