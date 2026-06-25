# Open Design Request Guide — Unified Real Estate Analytics Platform (Estate OS)

> Purpose: a ready-to-use brief for requesting the unified-app design from Open Design.
> Hand the relevant sections (or the copy-paste prompt at the bottom) to the tool.

---

## 0. How to ask (read first)

Generative design tools live or die by **how much structure you give them**. Recommended flow:

1. **Attach 2 current screenshots** (one light, one dark). State clearly: "Keep this structure, upgrade only the aesthetics."
2. **Split into 2 stages**: ① first the *design system* (color/typography/spacing/component kit) → ② after approval, *per-screen mockups*. Doing everything in one shot destroys consistency.
3. **Desktop-first**, fixed resolutions: base **1440px**, wide **1920px**. (This is a data dashboard; mobile is lower priority.)
4. **Lead with the single most complex screen** — "KB Time Series Analysis" (a grid of 6+ charts). Get that right and the simpler modules fall in line.
5. Use **reference products**, not vague adjectives: Linear, Vercel Dashboard, Stripe Dashboard, Retool, Bloomberg Terminal (for density) — not "make it modern."

---

## 1. One-line product definition

> **A desktop analytics platform (Estate OS) that unifies multiple independent real-estate analysis apps (time series, KB prices, listings, transactions, subscriptions, reviews, etc.) as "module tabs" under a single left-nav shell.** Users log in, and access to each tab (module) is permission-gated.

## 2. Hard constraints (non-negotiable for the designer)

- **Fixed shell**: the left navigation + top breadcrumb are **identical and stable across every module**. Switching modules swaps only the main content area; the shell never shifts.
- **High-density data UI**: a single screen carries 6–8 charts and tables with dozens of rows. No excessive whitespace, no oversized cards. **Density first**, but with clean hierarchy.
- **Light + dark parity**: token-based; both are first-class.
- **Korean typography**: Pretendard. Numbers use **tabular-nums** (no digit jitter, aligned columns).
- **Responsive = fluid within desktop** (including collapse/expand of the sidebar). A dedicated mobile layout is a later phase.

## 3. Information architecture (shell skeleton)

```
┌──────────────┬─────────────────────────────────────────────┐
│  Left nav     │  Top header: breadcrumb (Modules › Module LIVE)│
│  (brand,      │             + right actions (status/save/export/analyze)│
│   module      ├─────────────────────────────────────────────┤
│   list,       │  [Filter panel]   │   [Module content / chart+table view]│
│   account/    │  (collapsible)    │   (scrolls)                  │
│   role)       │                   │                              │
└──────────────┴─────────────────────────────────────────────┘
```

- Left nav: design **both** collapsed (icons only) and expanded states.
- Content area differs per module. The shared pattern = **left filter/search panel (collapsible) + right results view (KPI strip → charts/tables)**.

## 4. Module (tab) list and states

Design these **three states** so they are visually distinct:

| State | Meaning | Visual treatment requested |
|---|---|---|
| **LIVE** | Built, usable | lit dot + emphasis |
| **Soon** | In development | dimmed + "coming soon" tooltip on hover |
| **Locked** | No permission | lock icon + "permission required" |

Modules: `KB Time Series (LIVE)`, `KB Prices`, `Listings`, `Transactions`, `Subscriptions by Region`, `Resident Reviews`, `Agent Extraction`, `Commercial Facilities`, `Location Analysis`, `School Districts`, `Development Plans` / System: `Member Approval`, `Settings`.

> Tell the designer: "Module count grows to 12+, so the nav needs **grouping / dividers / scroll**, and an icon system that stays legible even in the collapsed state."

## 5. Design system (stage-1 deliverable) — request these

- **Color tokens**: background / surface (3 levels) / border (2 levels) / text (fg, fg-2, muted, muted-2) / primary accent / status colors (**keep the Korean real-estate convention: up = red, down = blue**) / chart palette (up to 5 series, with sufficient contrast in both light and dark).
- **Type scale**: Pretendard. Title 25 / subtitle 20 / body 15–16 / label 13–14; numerals tabular.
- **Spacing, radius, elevation**: 8px grid; r-sm/md/lg; soft/glass shadows in 1–2 steps.
- **Component kit (required)**: nav item (3 states), breadcrumb, segmented tabs, select/dropdown, range slider, chips/tags, KPI card, **data table (sortable, sticky header, compact/comfortable density)**, chart card (with Y-axis controls in the header), buttons (primary/ghost/icon), toast/modal, empty states, loading (skeleton).
- **Motion**: panel collapse / tab switch 0.2–0.3s; no gratuitous animation.

## 6. Reference module spec — "KB Time Series Analysis" (the most complex)

If the designer nails this one screen, the rest derive from it. Convey the functionality verbatim:

- **Filter panel**: weekly/monthly sync toggle → region cascade (large: province/aggregate → mid: city/district → small) → period (presets 1/3/5/10y + all, plus a two-handle drag slider) → index base-date select → **comparison basket (up to 5 items, color dot + remove)** → "Compare" button.
- **Results view**: title at top + segmented controls top-right (Weekly/Monthly · Price/Trade/Market) → **2-column chart grid** (sale index / lease index / sale change / lease change / cumulative change…), each chart card has **inline chart-type + Y-axis min/max controls in its header**, with a base-date reference line.
- **Header right actions**: latest-data/record-count pill, **Save (slots)**, **Export (Excel/JSON)**, **Analyze (AI analysis modal)**.

> Request points: "Keep the **inline controls from looking cluttered**," "make the 5-series legend readable in a narrow width," "consistent alignment and spacing across chart cards."

## 7. Login / per-tab permissions (design now, or you'll redo the shell later)

Even though it's wired up later, **request the design now**. Otherwise the shell has to be redrawn.

- **Login / signup screens**: standalone screens that keep brand consistency.
- **Permission-driven nav states**: request mockups for **both** policies — `locked` (lock icon) and `hidden` (removed entirely). Define the click behavior ("request access").
- **Account / role area**: bottom-left avatar + role badge (e.g., Admin / Analyst / Viewer).
- **Member approval (admin) screen**: pending-signup list + approve/reject + a **per-user module-permission matrix (users × modules checkbox grid)**.
- **Direct entry into a no-permission module**: a locked empty state in the content area (empty + "request access" CTA).

## 8. Improvements vs. the current design (concretize "make it prettier")

Pointing at the current weaknesses gets dramatically better results:

- The filter panel has a **redundant header** ("Search Conditions" + "Region Select") — consolidate, clarify section hierarchy.
- The chart cards' **inline Y-axis controls are noisy** → group them in one place or reveal on hover.
- 12+ nav items feel monotonous → stronger **grouping / icon consistency / active emphasis**.
- Overall, unify **whitespace rhythm, surface elevation, and shadows** to move from a "toy" feel to a "product" feel.

## 9. Deliverables format to request

1. **Design system page** (tokens + component kit, light & dark).
2. **Key screens**: ① KB Time Series Analysis (light + dark) ② simple module template (search + table) ③ login ④ member approval / permission matrix ⑤ collapsed nav state ⑥ permission-locked empty state.
3. If possible, **dev-ready tokens** (CSS variables / JSON) alongside the visuals.

---

## 10. Copy-paste prompt (condensed)

> **Design the unified shell for a desktop real-estate analytics platform, "Estate OS."** It unifies multiple independent analysis apps (time series, prices, listings, transactions, subscriptions, reviews, etc.) as "module tabs" under a left navigation. From the attached screenshots, **keep the structure (fixed left nav + top breadcrumb + left filter panel / right chart-and-table view) and upgrade only the aesthetics to feel premium.**
> Requirements: ① Deliver a light/dark token-based design system FIRST (color, Pretendard typography, 8px spacing, shadows, a 5-series chart palette). ② High-density data UI (grids of 6–8 charts, sortable tables with sticky headers, tabular-nums numbers); no exaggerated whitespace. ③ Present 12+ nav modules with grouping/dividers and a collapsed (icons-only) state; each module has **LIVE / Coming-soon / Permission-locked (lock icon)** states. ④ Include **login + per-tab permissions**: login screen, locked/hidden tabs for no-permission, a role badge bottom-left, and an admin "Member Approval + users×modules permission matrix" screen. ⑤ Keep the Korean real-estate convention (up = red, down = blue). 
> Tone: a calm, well-ordered data product like Linear / Vercel Dashboard. Base resolution 1440px. 
> Deliverables: a design system page + screen mockups (KB Time Series light & dark / simple module template / login / member approval & permission matrix / collapsed nav / permission-locked empty state) + dev-ready tokens.
