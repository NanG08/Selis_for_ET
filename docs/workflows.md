# Workflow Guide

Back to [Docs Home](README.md) | Related: [API Reference](api-reference.md)

## 1. Authentication

Entry points:

- Login/Register form: [frontend/src/components/Auth.tsx](../frontend/src/components/Auth.tsx)
- Routes and guards: [frontend/src/App.tsx](../frontend/src/App.tsx)

Flow:

1. User submits login/register form.
2. Frontend calls `api.auth.login` or `api.auth.register`.
3. Backend returns `token` and `user`.
4. Frontend stores both in `localStorage` as `selis_token` and `selis_user`.
5. Protected routes become available.

## 2. Dashboard and Overview

Reference: [frontend/src/components/Dashboard.tsx](../frontend/src/components/Dashboard.tsx)

Flow:

1. Dashboard loads transactions and budgets in parallel.
2. Client computes income, expenses, balance, and category chart data.
3. Plan-specific widgets render according to `user.plan`.
4. Recent transactions card links to full transaction page.

## 3. Transaction Management

Reference: [frontend/src/components/TransactionList.tsx](../frontend/src/components/TransactionList.tsx)

Flow:

1. Page fetches all transactions.
2. User can filter/search list client-side.
3. Add transaction modal posts to backend.
4. Optional Gemini-powered description suggestions are generated.
5. CSV export is generated in browser.

Current limitation:

- Delete action currently removes from local state only and does not call a backend endpoint.

## 4. Budget Management

Reference: [frontend/src/components/BudgetBuilder.tsx](../frontend/src/components/BudgetBuilder.tsx)

Flow:

1. Load budgets and transactions.
2. Add budget via form.
3. Compute spent amount per category from transactions.
4. Render progress bars and over-limit alerts.

## 5. Goal Tracking

Reference: [frontend/src/components/GoalTracker.tsx](../frontend/src/components/GoalTracker.tsx)

Flow:

1. Load goals from API.
2. Add new goal with target, current amount, and deadline.
3. Render completion progress and status badges.

## 6. Subscription Tracking

Reference: [frontend/src/components/PlanFeature.tsx](../frontend/src/components/PlanFeature.tsx)

Flow:

1. Subscriptions feature fetches subscription list.
2. User can add or delete subscriptions.
3. Monthly-equivalent total is computed for annual plans.

## 7. AI Assistant Workflow

References:

- Chat UI: [frontend/src/components/AIChat.tsx](../frontend/src/components/AIChat.tsx)
- Prompting logic: [frontend/src/lib/gemini.ts](../frontend/src/lib/gemini.ts)

Flow:

1. User sends a natural language prompt.
2. Frontend fetches transactions and budgets for context.
3. Context and plan are passed to Gemini with system instructions.
4. Assistant response is displayed in chat.

## Related Docs

- [Architecture](architecture.md)
- [API Reference](api-reference.md)
- [Integration Guide](integration-guide.md)
