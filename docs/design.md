# Design System

Back to [Docs Home](README.md) | Related: [Architecture](architecture.md) | [Workflow Guide](workflows.md)

## Design Philosophy

Selis design prioritizes:

1. **Financial data readability** — Clean typography, high contrast for money values, clear color coding for income vs expense
2. **Low-friction data entry** — Modal forms with smart defaults, plan-aware category suggestions, AI-assisted descriptions
3. **Plan-adaptive UX** — Navigation, widgets, and feature pages dynamically adjust based on user plan
4. **Visual clarity** — Neutral surfaces with targeted emerald accents; no decorative clutter
5. **Smooth interactions** — Subtle entry animations and hover effects that feel premium without being distracting

---

## Visual Language

### Color Palette

| Role | Color | Tailwind Class | Usage |
|------|-------|---------------|-------|
| Primary Accent | Emerald 500 | `bg-emerald-500` | CTA buttons, active nav, progress bars |
| Primary Hover | Emerald 600 | `bg-emerald-600` | Button hover states |
| Success/Income | Emerald 600 | `text-emerald-600` | Income amounts, positive trends |
| Danger/Expense | Red 500/600 | `text-red-500` | Over-budget alerts, expense amounts, errors |
| Warning | Amber 600 | `text-amber-600` | Pending invoice status |
| Info | Blue 500/600 | `text-blue-600` | Location widget, cash flow runway, headcount |
| Purple | Purple 500 | `text-purple-500` | Family plan widgets |
| Surface 1 | White | `bg-white` | Cards, modals, sidebar |
| Surface 2 | Neutral 50 | `bg-neutral-50` | Page background, empty states |
| Border | Neutral 200 | `border-neutral-200` | Card borders, input borders |
| Text Primary | Neutral 900 | `text-neutral-900` | Headings, amounts, primary text |
| Text Secondary | Neutral 500 | `text-neutral-500` | Labels, descriptions |
| Text Muted | Neutral 400 | `text-neutral-400` | Timestamps, hints |

### Chart Colors

```typescript
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
// emerald, blue, amber, red, purple
```

### Typography

| Font | Stack | Usage |
|------|-------|-------|
| **Inter** | `"Inter", ui-sans-serif, system-ui, sans-serif` | All UI text |
| **JetBrains Mono** | `"JetBrains Mono", ui-monospace, SFMono-Regular, monospace` | Coordinates, code-like data |

Loaded via Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Type Scale

| Element | Classes | Usage |
|---------|---------|-------|
| Page Title | `text-2xl font-bold` | Feature page headings |
| Section Title | `text-xl font-bold` | Card headings, modal titles |
| Card Title | `font-semibold text-neutral-800` | Chart titles, section headers |
| Stat Value | `text-2xl font-bold` | Dashboard stat cards |
| Large Stat | `text-5xl font-black` or `text-4xl font-bold` | Discipline score, runway |
| Body Text | `text-sm text-neutral-600` | Descriptions, widget content |
| Label | `text-sm font-medium text-neutral-700` | Form labels |
| Caption | `text-xs text-neutral-500` | Secondary info, dates |
| Micro | `text-[10px]` | Suggestion chips, chart labels |
| Badge | `text-xs font-bold uppercase tracking-wider` | Status pills, section labels |

---

## Shape System

| Element | Border Radius | Notes |
|---------|--------------|-------|
| Cards | `rounded-2xl` | All content cards and modals |
| Buttons | `rounded-xl` | Primary and secondary actions |
| Inputs | `rounded-xl` | All form inputs and selects |
| Badges/Pills | `rounded-full` | Status badges, category pills |
| Avatars | `rounded-full` | User avatar, AI avatar |
| Progress Bars | `rounded-full` | Budget and goal progress |
| Sidebar | None (rectangular) | Full-height left panel |

### Shadow System

| Level | Class | Usage |
|-------|-------|-------|
| None | — | Most elements |
| SM | `shadow-sm` | Cards, buttons with emphasis |
| XL | `shadow-xl` | Modals |
| Custom | `shadow-sm shadow-blue-500/20` | Colored progress bars |

---

## Layout System

### App Shell

```

  
             Header (sticky, backdrop-blur) 
  Sidebar   
  (280px                                   
   or 80px)     Main Content Area          
                (max-w-7xl, p-8)           
                                           
                <AnimatePresence>           
                  <Outlet />               
                </AnimatePresence>          
                                           
  

```

- **Sidebar**: Collapsible between 280px (expanded) and 80px (collapsed)
- **Header**: Sticky with `backdrop-blur-md` glass effect
- **Content**: `max-w-7xl mx-auto` with 32px padding

### Grid Patterns

| Context | Grid | Breakpoint |
|---------|------|-----------|
| Stats cards | `grid-cols-1 md:grid-cols-3` | 3-column at md |
| Plan widgets | `grid-cols-1 md:grid-cols-3` | 3-column at md |
| Budget cards | `grid-cols-1 md:grid-cols-2` | 2-column at md |
| Goal cards | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | 3-column at lg |
| Main chart + sidebar | `grid-cols-1 lg:grid-cols-3` with `lg:col-span-2` | Chart takes 2/3 |
| Form fields | `grid-cols-1 md:grid-cols-3` or `grid-cols-2` | Context-dependent |

---

## Component Patterns

### Stat Card

```

 [icon]         [+12.5%]    ← icon in neutral bg, trend badge
                          
 text-sm label              ← e.g., "Total Current Balance"
 text-2xl ₹XX,XXX          ← formatted currency value

```

Hover effect: `whileHover={{ y: -4 }}` (Motion lift animation)

### Modal Form

```

 Title                [X]   ← header with close button

                          
   Form fields...           ← rounded-xl inputs
                          
   [Cancel]  [Primary]      ← flex gap-3, full width buttons

```

Container: `fixed inset-0 z-[100]` with `bg-black/50 backdrop-blur-sm`
Content: Motion animated with scale `0.95 → 1`

### Data Table

```

 Header Row (neutral-50 bg)           

 Row with hover:bg-neutral-50         
 Actions visible on group-hover       

 Row with hover:bg-neutral-50         

```

- Headers: `text-xs font-semibold uppercase tracking-wider`
- Row hover: `hover:bg-neutral-50 transition-colors group`
- Action buttons: `opacity-0 group-hover:opacity-100`

### Progress Bar

```
 Container (h-2 or h-3) 
                                                 
 (green if under / red if over)        bg-neutral-100        

```

- Container: `h-2 bg-neutral-100 rounded-full overflow-hidden`
- Fill: `bg-emerald-500 rounded-full` or `bg-red-500` if over limit
- Goal progress uses Motion `initial={{ width: 0 }}` animation

### Chat Bubble

```
User message:                 AI message:
                 
               emerald      neutral  
               bg, white    bg, dark 
               text         text     
               rounded      rounded  
               -tr-none     -tl-none 
                 
                     [avatar]   [avatar]
```

---

## Animation System

| Animation | Library | Trigger | Effect |
|-----------|---------|---------|--------|
| Page transition | Motion | Route change | Fade + slide (y: 10→0) with `AnimatePresence` |
| Card entry | Motion | Component mount | `opacity: 0→1, scale: 0.95→1` |
| Stat card hover | Motion | Mouse enter | `y: 0→-4` (lift effect) |
| Modal | Motion | Open/close | `scale: 0.95→1, opacity: 0→1` with exit animation |
| Chat message | Motion | New message | `opacity: 0→1, y: 10→0, scale: 0.95→1` |
| Progress bar | Motion | Mount | `width: 0→N%` with `duration: 1, ease: easeOut` |
| Sidebar logo | Motion | Toggle | `opacity: 0→1, y: -10→0` |
| Active nav indicator | Motion | Route change | `layoutId="active"` shared layout animation |
| Sidebar width | Motion | Toggle | Animated `width: 280→80` or `80→280` |

---

## Plan-Aware UX

### Dynamic Navigation

Each plan shows a different set of navigation items in the sidebar:

| Plan | Nav Items |
|------|-----------|
| Personal | Dashboard, Budgets, Transactions, Subscriptions, Goals, AI Assistant |
| Family | Dashboard, Budgets, Transactions, Allowance, Goals, AI Assistant |
| Freelancer | Dashboard, Invoices, Income Tracker, Tax Estimator, Retirement, AI Assistant |
| Small Business | Dashboard, Invoices, Expenses, GST Tracker, Vendors, AI Assistant |
| Enterprise | Dashboard, Dept Budgets, Approvals, P&L Reports, Audit Trail, AI Assistant |

### Plan Icons

| Plan | Icon |
|------|------|
| Personal | `<User>` |
| Family | `<Users>` |
| Freelancer | `<Briefcase>` |
| Small Business | `<Building2>` |
| Enterprise | `<Building2>` |

### Adaptive Labels

Dashboard stat cards change labels based on plan:
- Balance: "Total Current Balance" → "Total Dept Balance" (enterprise)
- Income: "Monthly Total Income" → "Projected Income" (freelancer)
- Expenses: "Monthly Total Expenses" → "Operating Expenses" (small_business)

---

## Currency Formatting

All monetary values use Indian Rupee (INR) formatting:

```typescript
// Formatted via Intl.NumberFormat
new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
}).format(amount);

// Result: "₹1,23,456.78" (Indian numbering system)
```

---

## Custom Scrollbar

Applied via `.custom-scrollbar` class:
- Width: 4px
- Track: transparent
- Thumb: `#e5e7eb` (neutral-200) with 10px border-radius
- Thumb hover: `#d1d5db` (neutral-300)

---

## Accessibility Notes

### Current Strengths
- Semantic `<button>`, `<input>`, `<form>`, `<table>` elements throughout
- Alt text on all logo/avatar images
- High-contrast emerald accent on white backgrounds
- Visible focus states via `focus:ring-2 focus:ring-emerald-500/20`
- Form validation via HTML5 `required` attributes

### Areas for Improvement
- Add explicit `aria-label` attributes to icon-only buttons (delete, settings, send)
- Add form field error messages for server-side validation failures
- Improve keyboard navigation for hover-triggered filter dropdowns
- Add `role="alert"` to error message containers
- Provide skip-to-content link for keyboard users
- Ensure chart data is accessible to screen readers
- Test with color blindness simulations (red/green for income/expense)

---

## Related Docs

- [Workflow Guide](workflows.md) — How features work end-to-end
- [Integration Guide](integration-guide.md) — External service setup
- [Architecture](architecture.md) — Technical foundation
