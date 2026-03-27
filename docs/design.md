# Design

Back to [Docs Home](README.md) | Related: [Architecture](architecture.md)

## Design Goals

Selis design favors:

- Fast readability for financial data
- Low-friction data entry
- Plan-aware experiences for different user segments
- Visual clarity over decorative complexity

## Visual Language

Based on [frontend/src/index.css](../frontend/src/index.css) and component styles:

- Primary palette: neutral surfaces with emerald accents
- Typography:
  - Sans: Inter
  - Mono: JetBrains Mono
- Shape system: rounded cards (`rounded-2xl`) and soft borders
- Motion: subtle entry and hover animations via `motion`

## Layout System

- App shell with collapsible sidebar and sticky header: [frontend/src/components/Layout.tsx](../frontend/src/components/Layout.tsx)
- Content uses card grids and table patterns for high-density financial views
- Responsive breakpoints implemented through Tailwind utility classes

## Component Patterns

- Reusable card modules for stats and summaries
- Modal forms for add/create operations
- Data tables for transaction/invoice/subscription lists
- Filter/search actions close to table controls
- Local loading fallback sections per page

## Plan-Aware UX

The platform adapts menus and widgets by selected plan:

- Personal
- Family
- Freelancer
- Small Business
- Enterprise

References:

- Dynamic nav: [frontend/src/components/Layout.tsx](../frontend/src/components/Layout.tsx)
- Plan widgets: [frontend/src/components/Dashboard.tsx](../frontend/src/components/Dashboard.tsx)
- Plan-specific feature pages: [frontend/src/components/PlanFeature.tsx](../frontend/src/components/PlanFeature.tsx)

## AI Experience Design

- Conversation interface: [frontend/src/components/AIChat.tsx](../frontend/src/components/AIChat.tsx)
- Assistant persona and prompt framing: [frontend/src/lib/gemini.ts](../frontend/src/lib/gemini.ts)
- Guardrail note in UI warns users to verify important decisions

## Accessibility Notes

Current strengths:

- Semantic buttons/inputs and visible states
- Text alternatives for images
- High-contrast accent colors in most key controls

Current opportunities:

- Add explicit form validation messages for all submission failures
- Improve keyboard interaction for hover-based filter popovers
- Add ARIA labels for icon-only buttons in data tables

## Related Docs

- [Workflow Guide](workflows.md)
- [Integration Guide](integration-guide.md)
