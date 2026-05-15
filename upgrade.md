# MIDAS Stock Broking — UI/UX, CMS Responsiveness & Design System Upgrade

> **You are an expert Senior Front-End Developer specialising in Next.js, Tailwind CSS, and production-grade design systems.** The MIDAS Stock Broking application (Next.js App Router, Tailwind CSS, shadcn/ui) is fully deployed. Now apply the following upgrades across the **entire codebase** — both the public-facing website and the Admin CMS. Every change must be consistent, production-grade, and applied globally — no one-off inline fixes.

---

## Part 1: Global Design Token System (tailwind.config.js)

### 1.1 Objective

Centralise **every** design decision — colors, typography, spacing, border radius, shadows, and animation durations — as named tokens in `tailwind.config.js`. No hardcoded hex values, font sizes, or spacing values anywhere in the codebase. Every component uses only these tokens via Tailwind utility classes.

### 1.2 Full tailwind.config.js Target Structure

Replace your current `tailwind.config.js` with the following structure (fill in values as specified):

```js
// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: {
    extend: {

      // ─── COLOR TOKENS ────────────────────────────────────────────────
      colors: {
        // Brand palette — use these names everywhere, never raw hex
        brand: {
          DEFAULT:   '#fb923c',   // orange-400 — primary brand / accent
          light:     '#fed7aa',   // orange-200 — hover tints, backgrounds
          dark:      '#c2410c',   // orange-700 — pressed states, dark mode accents
          muted:     '#fff7ed',   // orange-50  — subtle backgrounds
        },

        // Neutral surface palette
        surface: {
          DEFAULT:   '#ffffff',   // white — primary card/page background
          secondary: '#f9fafb',   // gray-50  — secondary background
          tertiary:  '#f3f4f6',   // gray-100 — input backgrounds, sidebar
          inverse:   '#111827',   // gray-900 — dark backgrounds
        },

        // Text palette
        text: {
          primary:   '#111827',   // gray-900
          secondary: '#6b7280',   // gray-500
          muted:     '#9ca3af',   // gray-400
          inverse:   '#f9fafb',   // gray-50 — text on dark backgrounds
          brand:     '#fb923c',   // orange-400 — brand-coloured text
        },

        // Border palette
        border: {
          DEFAULT:   '#e5e7eb',   // gray-200 — default borders
          strong:    '#d1d5db',   // gray-300 — emphasis borders
          muted:     '#f3f4f6',   // gray-100 — subtle dividers
          brand:     '#fb923c',   // orange-400 — active / focused borders
        },

        // Semantic status colors
        success: {
          DEFAULT:   '#16a34a',   // green-600
          light:     '#dcfce7',   // green-100
          text:      '#14532d',   // green-900
        },
        warning: {
          DEFAULT:   '#d97706',   // amber-600
          light:     '#fef3c7',   // amber-100
          text:      '#78350f',   // amber-900
        },
        danger: {
          DEFAULT:   '#dc2626',   // red-600
          light:     '#fee2e2',   // red-100
          text:      '#7f1d1d',   // red-900
        },
        info: {
          DEFAULT:   '#2563eb',   // blue-600
          light:     '#dbeafe',   // blue-100
          text:      '#1e3a8a',   // blue-900
        },

        // CMS-specific (admin sidebar, nav)
        cms: {
          sidebar:   '#1a1f2e',   // deep navy — admin sidebar background
          'sidebar-hover':  '#252b3b',
          'sidebar-active': '#2e3650',
          'sidebar-border': '#2a3045',
          'sidebar-text':   '#94a3b8',
          'sidebar-text-active': '#f1f5f9',
        },
      },

      // ─── TYPOGRAPHY TOKENS ───────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', ...fontFamily.sans],
        heading: ['Cal Sans', 'Inter', ...fontFamily.sans],
        mono: ['JetBrains Mono', 'var(--font-mono)', ...fontFamily.mono],
      },

      fontSize: {
        // Named scale — use these, never arbitrary sizes
        'xs':   ['0.75rem',  { lineHeight: '1rem',    letterSpacing: '0.01em' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],
        'base': ['1rem',     { lineHeight: '1.625rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.875rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem',    letterSpacing: '-0.01em' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.015em' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.5rem',  letterSpacing: '-0.02em' }],
        '5xl':  ['3rem',     { lineHeight: '1',        letterSpacing: '-0.025em' }],
        '6xl':  ['3.75rem',  { lineHeight: '1',        letterSpacing: '-0.03em' }],
      },

      fontWeight: {
        normal:   '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
      },

      // ─── SPACING TOKENS ──────────────────────────────────────────────
      // Extends Tailwind default — add named semantic spacing
      spacing: {
        'page':   '1.5rem',     // standard page horizontal padding (mobile)
        'page-lg':'2.5rem',     // standard page horizontal padding (desktop)
        'section':'4rem',       // vertical gap between page sections
        'card':   '1.5rem',     // card internal padding
        'sidebar':'16rem',      // sidebar width (desktop)
        'sidebar-sm': '4rem',   // sidebar icon-only collapsed width (not used on mobile)
      },

      // ─── BORDER RADIUS TOKENS ────────────────────────────────────────
      borderRadius: {
        'none':  '0',
        'sm':    '0.25rem',
        'DEFAULT':'0.5rem',
        'md':    '0.5rem',
        'lg':    '0.75rem',
        'xl':    '1rem',
        '2xl':   '1.5rem',
        'full':  '9999px',
        // Component-specific aliases
        'btn':   '0.5rem',
        'card':  '0.75rem',
        'badge': '9999px',
        'input': '0.5rem',
      },

      // ─── BOX SHADOW TOKENS ───────────────────────────────────────────
      boxShadow: {
        'none':   'none',
        'sm':     '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT':'0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md':     '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg':     '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'brand':  '0 4px 14px 0 rgb(251 146 60 / 0.35)',   // brand glow
        'card':   '0 2px 8px 0 rgb(0 0 0 / 0.06)',
        'input-focus': '0 0 0 3px rgb(251 146 60 / 0.2)',  // focus ring
      },

      // ─── ANIMATION & TRANSITION TOKENS ───────────────────────────────
      transitionDuration: {
        'fast':   '100ms',
        'base':   '150ms',
        'slow':   '250ms',
        'slower': '400ms',
        'page':   '300ms',
      },

      transitionTimingFunction: {
        'bounce-in':  'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth':     'cubic-bezier(0.4, 0, 0.2, 1)',
        'in':         'cubic-bezier(0.4, 0, 1, 1)',
        'out':        'cubic-bezier(0, 0, 0.2, 1)',
      },

      keyframes: {
        // Page / element entrances
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%':   { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Looping / ambient
        'pulse-brand': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(251 146 60 / 0.4)' },
          '50%':       { boxShadow: '0 0 0 8px rgb(251 146 60 / 0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'ticker': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'number-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'accordion-down': {
          '0%':   { height: '0' },
          '100%': { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          '0%':   { height: 'var(--radix-accordion-content-height)' },
          '100%': { height: '0' },
        },
        'drawer-in': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'drawer-out': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'modal-in': {
          '0%':   { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'toast-in': {
          '0%':   { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      animation: {
        // Entrance animations
        'fade-in':        'fade-in 300ms ease-out both',
        'fade-up':        'fade-up 400ms cubic-bezier(0, 0, 0.2, 1) both',
        'fade-down':      'fade-down 300ms cubic-bezier(0, 0, 0.2, 1) both',
        'slide-in-left':  'slide-in-left 300ms cubic-bezier(0, 0, 0.2, 1) both',
        'slide-in-right': 'slide-in-right 300ms cubic-bezier(0, 0, 0.2, 1) both',
        'scale-in':       'scale-in 200ms cubic-bezier(0, 0, 0.2, 1) both',
        // Staggered entrance helpers (apply delay via style prop)
        'fade-up-1':      'fade-up 400ms 100ms cubic-bezier(0, 0, 0.2, 1) both',
        'fade-up-2':      'fade-up 400ms 200ms cubic-bezier(0, 0, 0.2, 1) both',
        'fade-up-3':      'fade-up 400ms 300ms cubic-bezier(0, 0, 0.2, 1) both',
        'fade-up-4':      'fade-up 400ms 400ms cubic-bezier(0, 0, 0.2, 1) both',
        // Looping
        'pulse-brand':    'pulse-brand 2s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'spin-slow':      'spin-slow 3s linear infinite',
        'ticker':         'ticker 30s linear infinite',
        'number-up':      'number-up 300ms ease-out both',
        // UI components
        'accordion-down': 'accordion-down 200ms ease-out',
        'accordion-up':   'accordion-up 200ms ease-out',
        'drawer-in':      'drawer-in 300ms cubic-bezier(0, 0, 0.2, 1)',
        'drawer-out':     'drawer-out 250ms cubic-bezier(0.4, 0, 1, 1)',
        'modal-in':       'modal-in 250ms cubic-bezier(0, 0, 0.2, 1)',
        'toast-in':       'toast-in 300ms cubic-bezier(0, 0, 0.2, 1)',
      },

      // ─── Z-INDEX SCALE ────────────────────────────────────────────────
      zIndex: {
        'below':    '-1',
        'base':      '0',
        'raised':   '10',
        'dropdown': '20',
        'sticky':   '30',
        'overlay':  '40',
        'modal':    '50',
        'toast':    '60',
        'tooltip':  '70',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

### 1.3 Global CSS Variables (`src/app/globals.css`)

Add the following CSS custom properties so tokens are available for non-Tailwind contexts (shadcn/ui, inline styles, Radix UI):

```css
@layer base {
  :root {
    --brand:            theme('colors.brand.DEFAULT');
    --brand-light:      theme('colors.brand.light');
    --brand-dark:       theme('colors.brand.dark');
    --brand-muted:      theme('colors.brand.muted');

    --surface:          theme('colors.surface.DEFAULT');
    --surface-secondary:theme('colors.surface.secondary');
    --surface-tertiary: theme('colors.surface.tertiary');

    --text-primary:     theme('colors.text.primary');
    --text-secondary:   theme('colors.text.secondary');
    --text-muted:       theme('colors.text.muted');
    --text-brand:       theme('colors.text.brand');

    --border:           theme('colors.border.DEFAULT');
    --border-strong:    theme('colors.border.strong');
    --border-brand:     theme('colors.border.brand');

    --radius-btn:       theme('borderRadius.btn');
    --radius-card:      theme('borderRadius.card');
    --radius-input:     theme('borderRadius.input');

    --shadow-brand:     theme('boxShadow.brand');
    --shadow-card:      theme('boxShadow.card');
    --shadow-focus:     theme('boxShadow.input-focus');

    --duration-fast:    theme('transitionDuration.fast');
    --duration-base:    theme('transitionDuration.base');
    --duration-slow:    theme('transitionDuration.slow');
    --duration-page:    theme('transitionDuration.page');
  }

  /* Focus ring — brand colored, keyboard only */
  :focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 2px;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### 1.4 Enforcement Rules

- **Delete** all `text-orange-400`, `bg-orange-400`, `border-orange-400`, and any raw hex color from every component. Replace with `text-brand`, `bg-brand`, `border-brand`, etc.
- **Delete** all hardcoded `text-[14px]`, `text-[1rem]`, `gap-[24px]` arbitrary values. Replace with the named token (`text-sm`, `gap-6`).
- Create a `src/lib/cn.js` utility (if not already present) using `clsx` + `tailwind-merge` for conditional class merging. Use this in every component — never raw string concatenation.
- **shadcn/ui components** in `src/components/ui/` must be updated so their variant classes reference the new token names. Specifically: primary button variant must use `bg-brand hover:bg-brand-dark`, ring/focus states must use `ring-brand`, and destructive variant uses `bg-danger`.

---

## Part 2: CMS Admin Sidebar — Mobile Behaviour Fix

### 2.1 Problem Statement

The current CMS sidebar supports collapse/expand toggling on mobile, which causes UX issues on small screens. The required behaviour is:

| Screen Size | Sidebar Behaviour |
|---|---|
| Desktop (`lg:` and above, ≥ 1024px) | Sidebar is always visible, fixed to the left, 256px (`w-sidebar`) wide. Collapse/expand toggle is permitted. |
| Mobile / Tablet (below `lg:`, < 1024px) | Sidebar is **never shown inline**. It is **only accessible as a full-height overlay drawer** triggered by a hamburger button. It must be closable by tapping the overlay backdrop or a close button. There is no collapse or partial-width state on mobile. |

### 2.2 Implementation: `src/components/admin/AdminLayout.jsx`

```jsx
'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, session }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change (mobile navigation)
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="flex h-screen bg-surface-secondary overflow-hidden">

      {/* ── DESKTOP SIDEBAR (always visible, lg+) ─────────────────── */}
      <aside className="hidden lg:flex lg:flex-col w-sidebar flex-shrink-0 bg-cms-sidebar border-r border-cms-sidebar-border">
        <AdminSidebar session={session} onClose={() => {}} />
      </aside>

      {/* ── MOBILE DRAWER OVERLAY (only below lg) ─────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-overlay bg-black/60 lg:hidden animate-fade-in"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE SIDEBAR DRAWER (slides in from left) ───────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-modal w-72 bg-cms-sidebar
          flex flex-col border-r border-cms-sidebar-border
          transition-transform duration-slow ease-smooth
          lg:hidden
          ${drawerOpen ? 'translate-x-0 animate-drawer-in' : '-translate-x-full'}
        `}
        aria-label="Admin navigation"
        aria-hidden={!drawerOpen}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setDrawerOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md text-cms-sidebar-text hover:text-cms-sidebar-text-active hover:bg-cms-sidebar-hover transition-colors duration-fast"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
        <AdminSidebar session={session} onClose={() => setDrawerOpen(false)} />
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-surface border-b border-border sticky top-0 z-sticky">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors duration-fast"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-text-primary">MIDAS Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 2.3 AdminSidebar Component Requirements

- Use `text-cms-sidebar-text` for inactive nav items and `text-cms-sidebar-text-active bg-cms-sidebar-active` for the active route.
- Active route detection: compare `usePathname()` with each nav item's `href`.
- Brand logo / wordmark at the top must use `text-brand` for the accent character.
- Bottom section: show current user avatar (initials fallback), name, role badge. Role badge: `SUPER_ADMIN` = `bg-brand/20 text-brand`, `EDITOR` = `bg-info/20 text-info`.
- Logout button uses `text-danger hover:bg-danger/10` color.

---

## Part 3: CMS Pages — Full Mobile Responsiveness

Apply the following responsive fixes to every admin page. Use the token names from Part 1 only.

### 3.1 Page Layout Pattern

Every admin page must follow this responsive shell:

```jsx
// Standard admin page layout
export default function AdminPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Page Title</h1>
          <p className="text-sm text-text-secondary mt-0.5">Subtitle or description</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Action buttons — stack on mobile, row on sm+ */}
        </div>
      </div>

      {/* Stats / summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* StatCard components */}
      </div>

      {/* Filters + search bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Search input: full width on mobile, max-w-xs on desktop */}
        {/* Filter selects: full width on mobile, w-auto on sm+ */}
      </div>

      {/* Data table (see 3.2) */}
    </div>
  );
}
```

### 3.2 Responsive Data Tables

All data tables in the CMS must implement a **card-list view on mobile** (< 640px) and the standard table on desktop. Never use horizontal scroll as the primary mobile strategy.

```jsx
// Pattern: responsive table with card fallback
function ResponsiveTable({ data, columns }) {
  return (
    <>
      {/* Mobile: card list */}
      <div className="sm:hidden space-y-3">
        {data.map(row => (
          <div key={row.id} className="bg-surface rounded-card border border-border p-card shadow-card animate-fade-up">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-base text-text-primary truncate">{row.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{row.category}</p>
              </div>
              <StatusBadge status={row.isActive} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{formatDate(row.createdAt)}</span>
              <RowActions row={row} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: standard table */}
      <div className="hidden sm:block overflow-hidden rounded-card border border-border bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, i) => (
              <tr key={row.id} className="hover:bg-surface-secondary transition-colors duration-fast animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                {/* row cells */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```

### 3.3 Responsive Forms (Dialogs / Sheets)

- All create/edit forms must use a **shadcn Sheet** (full-height side panel) on mobile and a **Dialog** on desktop (`sm:` breakpoint switch).
- Form fields inside dialogs/sheets must be full-width on mobile and grid-based (`grid grid-cols-2 gap-4`) on `sm+` where appropriate.
- Buttons inside forms: full-width (`w-full`) on mobile, auto-width (`sm:w-auto`) on desktop.
- Never use `overflow: hidden` on the form container without `overflow-y: auto` — long forms on mobile must scroll.

### 3.4 CMS-Specific Responsive Fixes (Apply Page-by-Page)

**Dashboard (`/admin`)**
- Stats grid: `grid-cols-2 lg:grid-cols-4` — 2 columns on mobile, 4 on desktop.
- Recent activity list: full width, no sidebar-within-sidebar patterns.
- Chart/graph areas: minimum height `h-48` on mobile, `h-64` on desktop. Use `ResponsiveContainer` from recharts.

**Notices (`/admin/notices`)**
- Search input: `w-full sm:max-w-xs`.
- Category filter dropdown: `w-full sm:w-auto`.
- "New Notice" button: `w-full sm:w-auto` with brand styling.
- Table → card-list pattern per §3.2.
- Notice form: use Sheet on mobile. Rich text editor must constrain height on mobile (`max-h-48 overflow-y-auto`).

**FAQs (`/admin/faqs`)**
- FAQ list: card-list on mobile. Each card shows question (truncated), category badge, order number, and actions.
- Drag-to-reorder: disable on touch devices (mobile); show up/down arrow buttons instead.

**Users (`/admin/users`)**
- Table → card-list on mobile. Each card shows avatar, name, role badge, email, last login.
- Invite/create user dialog: full-screen sheet on mobile.

**Settings (`/admin/settings`)**
- Settings form: single-column stack on mobile, two-column `grid grid-cols-2 gap-6` on `md+`.
- Section headings: `text-base font-semibold text-text-primary border-b border-border pb-2 mb-4`.

**Audit Log (`/admin/audit-log`)**
- Table: on mobile, show only Action, User, and Time columns. Hide Before/After diff columns — add a "View details" button that opens a bottom sheet with the full diff.

---

## Part 4: Website Public Pages — Animation & Premium Feel

Apply animations using the keyframe tokens defined in Part 1. All animations must respect `prefers-reduced-motion` (handled globally in `globals.css`).

### 4.1 Page Transition Wrapper

Create `src/components/PageTransition.jsx`:

```jsx
export default function PageTransition({ children, className = '' }) {
  return (
    <div className={`animate-fade-up ${className}`}>
      {children}
    </div>
  );
}
```

Wrap the `{children}` in every public layout with `<PageTransition>`.

### 4.2 Public Page Animation Targets

**Hero Section**
- Headline: `animate-fade-up` with no delay.
- Subheadline: `animate-fade-up-1` (100ms delay).
- CTA buttons: `animate-fade-up-2` (200ms delay).
- Hero image / illustration: `animate-slide-in-right` with 150ms delay.
- Brand accent elements (orange lines, dots): `animate-pulse-brand`.

**Navbar**
- On scroll past 60px: add `shadow-card bg-surface/95 backdrop-blur-sm` via `useEffect` + `scroll` event listener.
- Active link: `text-brand border-b-2 border-brand`.
- Hamburger → mobile menu: `animate-drawer-in` for the menu panel.

**Stock Ticker / Market Data Bar**
- Scrolling ticker: use `animation-ticker` on the inner duplicate-content container.
- Up arrows: `text-success`, down arrows: `text-danger`.

**Services / Features Section**
- Use `IntersectionObserver` (or Framer Motion `whileInView`) to trigger `animate-fade-up` as each card scrolls into view.
- Card hover: `hover:shadow-md hover:-translate-y-1 transition-all duration-slow` — subtle lift.
- Active/featured card: `border-brand shadow-brand`.

**Notices / Announcements Section**
- Each notice card: `animate-fade-up` with staggered delays (`animate-fade-up-1`, `-2`, `-3`).
- New/unread badge: `animate-pulse-brand`.

**FAQs Section**
- Accordion open/close: uses `animate-accordion-down` / `animate-accordion-up` (already wired via shadcn Accordion — confirm `tailwindcss-animate` is installed).

**Call-to-Action / Contact Section**
- Background: use `bg-brand-muted` (not a hardcoded color).
- Heading: `text-brand-dark font-bold`.
- Button: `bg-brand hover:bg-brand-dark text-white shadow-brand hover:shadow-brand transition-all duration-slow`.

**Footer**
- Brand logo accent: `text-brand`.
- Link hover: `hover:text-brand transition-colors duration-fast`.
- Social icons: `hover:text-brand hover:scale-110 transition-all duration-fast`.

### 4.3 Loading States (Skeleton Screens)

Create `src/components/ui/Skeleton.jsx` using the shimmer animation:

```jsx
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`
        bg-surface-tertiary rounded-md overflow-hidden relative
        before:absolute before:inset-0
        before:bg-gradient-to-r before:from-transparent before:via-surface/60 before:to-transparent
        before:animate-shimmer before:bg-[length:200%_100%]
        ${className}
      `}
    />
  );
}
```

Use `Skeleton` in every data-fetching component while loading.

---

## Part 5: CMS UI Animations (Premium Admin Feel)

### 5.1 Table Row Entrance

Every table row must animate in on initial load with staggered delays:

```jsx
// Apply to each <tr> or card:
style={{ animationDelay: `${index * 30}ms` }}
className="animate-fade-in"
```

### 5.2 Stats Cards (Dashboard)

Numbers must animate upward on mount using a count-up effect:

```jsx
// CountUp component
'use client';
import { useEffect, useState } from 'react';

export function CountUp({ end, duration = 1000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span className="animate-number-up">{prefix}{count.toLocaleString()}{suffix}</span>;
}
```

### 5.3 Form Interactions

- Input focus: `focus:ring-2 focus:ring-brand/30 focus:border-brand transition-shadow duration-fast`
- Button active press: `active:scale-95 transition-transform duration-fast`
- Success state (after save): button momentarily shows a checkmark icon before returning to label. Use a 1.5s `setTimeout` to reset.
- Error shake: add a `shake` keyframe animation triggered on validation failure:

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
```

Register as `animation: { shake: 'shake 400ms ease-in-out' }` in `tailwind.config.js`.

### 5.4 Dialog / Modal Animations

shadcn Dialog must use `animate-modal-in` on the content panel. Add to `src/components/ui/dialog.jsx`:

```jsx
// In DialogContent className:
"animate-modal-in data-[state=closed]:animate-fade-out"
```

### 5.5 Toast Notifications

Configure `sonner` in `src/app/layout.jsx`:

```jsx
<Toaster
  position="bottom-right"
  toastOptions={{
    className: 'animate-toast-in font-sans text-sm',
    style: { borderRadius: 'var(--radius-card)', border: '0.5px solid var(--border)' },
    success: { style: { borderLeft: '3px solid var(--brand)' } },
    error:   { style: { borderLeft: '3px solid var(--danger)' } },
  }}
/>
```

---

## Part 6: Additional Upgrades & Improvements

### 6.1 Dark Mode Support

- All color tokens in `tailwind.config.js` must have `dark:` variants declared.
- CMS admin portal: default to `dark` class on the `<html>` element for the admin layout only (most professional admin portals use dark sidebars). Public website follows system preference.
- Toggle: add a theme toggle button in the CMS topbar.

### 6.2 Typography Consistency

- All headings on public pages: `font-heading` (Cal Sans or Inter with tight tracking).
- Body text: `font-sans text-base text-text-primary leading-relaxed`.
- All monetary values / stock prices: `font-mono text-text-primary` for fixed-width alignment.
- Apply `@tailwindcss/typography` (`prose prose-slate`) to Notice detail pages (rich text rendering).

### 6.3 Focus & Accessibility

- All interactive elements must have visible `:focus-visible` styles using `var(--brand)` outline (set globally in `globals.css` — already in Part 1).
- CMS navigation: add `aria-current="page"` to the active sidebar item.
- All icon-only buttons must have `aria-label`.
- Images must have meaningful `alt` text. Decorative images use `alt=""` and `aria-hidden="true"`.

### 6.4 Performance

- All public-facing page animations must be `will-change: transform, opacity` on the animated element to hint GPU compositing.
- Lazy-load images below the fold using `loading="lazy"` and `next/image`.
- Animate only `transform` and `opacity` — never `width`, `height`, `top`, or `left` (layout-triggering properties).
- Use `React.memo` on CMS table row components to prevent re-renders during list updates.

### 6.5 Component Library Gaps to Fill

| Missing Component | Where Needed | Implementation |
|---|---|---|
| `<StatusBadge status={isActive}>` | All CMS tables | `bg-success-light text-success-text` / `bg-danger-light text-danger-text`, `rounded-badge`, `text-xs font-medium px-2.5 py-0.5` |
| `<RoleBadge role={role}>` | Users table, sidebar footer | SUPER_ADMIN: `bg-brand/15 text-brand`, EDITOR: `bg-info-light text-info-text` |
| `<EmptyState icon title description action>` | All list pages when data is empty | Centered icon + heading + subtext + optional CTA button |
| `<PageLoader />` | Route transitions | Full-page centered spinner using `animate-spin-slow text-brand` |
| `<ConfirmDialog>` | All delete actions | Wraps shadcn AlertDialog with danger styling and loading state on confirm button |
| `<DataTable>` | All CMS lists | Unified component combining responsive card/table pattern from §3.2, pagination, search, sort |

### 6.6 What to Build Next (Roadmap Suggestions)

The following features would meaningfully improve the system without architectural changes:

1. **Global search** (`Cmd+K` command palette) — search across Notices, FAQs, and Users from anywhere in the CMS. Use `cmdk` library + shadcn Command component.
2. **Bulk actions** — select multiple rows in tables → bulk activate/deactivate/delete. Requires checkbox column and a floating action bar.
3. **Rich text preview** — live side-by-side markdown preview in the Notice editor (use `react-markdown` with `remark-gfm`).
4. **Activity feed widget** on the dashboard — recent AuditLog entries formatted as human-readable sentences.
5. **Export to CSV** — Notices and FAQs table data exportable as CSV (browser-side using `papaparse`, no server needed).
6. **Image alt text field** — when uploading via Cloudinary widget, prompt for alt text before saving to the Notice record.
7. **Scheduled publish** — add `publishAt: Date` field to Notices; a Vercel Cron job checks every hour and flips `isActive` for due notices.
8. **Email notifications** — on new Notice publish, send an email digest using Resend (`resend.com`). One API call, no infra.
9. **Two-factor authentication** — add TOTP-based 2FA for SUPER_ADMIN accounts using `otplib`.
10. **Vercel Analytics + Speed Insights** — add `@vercel/analytics` and `@vercel/speed-insights` to both public and admin layouts for production performance monitoring.

---

## Part 7: Build Order

Apply changes in this sequence to avoid breaking the running application:

1. `tailwind.config.js` + `globals.css` — token system (no UI changes yet, just config).
2. Find-and-replace all `text-orange-400` / `bg-orange-400` etc. with `text-brand` / `bg-brand` across the entire codebase.
3. shadcn/ui component variants — update button, input, badge to use new token names.
4. `AdminLayout.jsx` — mobile drawer sidebar fix (non-breaking, isolated to admin).
5. `AdminSidebar.jsx` — responsive styling updates.
6. CMS pages responsive fixes — page by page (Notices → FAQs → Users → Settings → Audit Log).
7. `globals.css` animation classes + `PageTransition` wrapper — public pages.
8. Public page section animations (Hero → Navbar → Services → Notices → FAQs → CTA → Footer).
9. CMS animation polish (table rows → stats countup → form interactions → toasts).
10. Missing components (`StatusBadge`, `RoleBadge`, `EmptyState`, `DataTable`, `ConfirmDialog`).
11. Accessibility pass — focus styles, aria labels, alt text audit.
12. Performance pass — `will-change`, `React.memo`, lazy loading.