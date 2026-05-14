# MIDAS STOCK BROKING WEBSITE REBUILD

## Frontend Architecture & Development Source of Truth

---

# 1. PROJECT OVERVIEW

## Goal

Rebuild the existing Midas Stock Broking website with:

* Modern UI/UX
* Institutional fintech design
* Responsive frontend
* Scalable architecture
* API-ready frontend structure
* Reusable component system
* Performance-focused implementation
* SEO-friendly structure

This phase focuses ONLY on frontend development.

Backend APIs, authentication, database, and business logic will be implemented later using Node.js.

---

# 2. TECH STACK

## Core Stack

* Next.js (App Router)
* React.js
* Tailwind CSS
* shadcn/ui
* Framer Motion
* Lucide React Icons

## Important Notes

### Use JavaScript NOT TypeScript

Current phase does not require TypeScript.

### Frontend Only

No backend implementation in this phase.

### Static Mock Data First

All data should initially come from local data files.

Later:

* Replace static data with APIs
* Keep component structure unchanged

---

# 3. WEBSITE DESIGN DIRECTION

## Design Identity

The website should feel:

* Trustworthy
* Institutional
* Premium fintech
* Professional
* Modern financial platform
* Clean and minimal

## Inspiration

* Zerodha
* Groww
* Robinhood
* Interactive Brokers

## Avoid

* Excessive gradients
* Startup SaaS appearance
* Crypto casino UI
* Flashy animations
* Over-glassmorphism
* Cluttered layouts

---

# 4. DESIGN PRINCIPLES

## Core Principles

### Trust First

Users are dealing with investments and financial services.
Design must communicate:

* Security
* Stability
* Professionalism
* Legitimacy

### Clarity

Users should instantly understand:

* Services
* Account opening process
* Trading process
* Support channels
* Platform access

### Minimalism

Use:

* Large spacing
* Strong typography
* Clean layouts
* Subtle motion
* Structured hierarchy

### Consistency

Everything must follow:

* Same spacing rhythm
* Same typography system
* Same color system
* Same card styles
* Same button patterns

---

# 5. WEBSITE STRUCTURE

## Main Pages

### Home

Route:

/app/page.js

### About

Routes:

/app/about/introduction/page.js
/app/about/mission/page.js
/app/about/why-trade/page.js

### Services

Routes:

/app/services/page.js
/app/services/downloads/page.js

### FAQ

Route:

/app/faq/page.js

### Contact

Route:

/app/contact/page.js

### Notices

Routes:

/app/notices/page.js
/app/notices/[id]/page.js

### Compliance

Routes:

/app/compliance/sanctions/[type]/page.js

---

# 6. HOMEPAGE STRUCTURE

## Homepage Flow

### 1. Header

* Top auth bar
* Navigation
* Mobile menu

### 2. Hero Section

* Main headline
* CTA buttons
* Trading dashboard preview
* Trust indicators

### 3. Market Statistics

* Broker number
* Companies listed
* Support availability

### 4. Account Types

* NEPSE account
* MIDAS account
* Demat account

### 5. Why Trade Shares

* Educational value propositions

### 6. Why Trade With MIDAS

* Trust-focused features

### 7. Trading Process

* Open account
* Verification
* Start trading

### 8. Latest Notices / News

* News cards
* Announcements

### 9. Newsletter

* Email subscription

### 10. Footer

* Links
* Contact details
* Regulatory ecosystem

---

# 7. PROJECT STRUCTURE

```txt
src/
│
├── app/
│   ├── page.js
│   ├── about/
│   ├── services/
│   ├── faq/
│   ├── contact/
│   ├── notices/
│   ├── compliance/
│   ├── layout.js
│   └── globals.css
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── home/
│   ├── cards/
│   └── ui/
│
├── data/
│   ├── navigation.js
│   ├── home.js
│   ├── services.js
│   ├── faq.js
│   └── footer.js
│
├── constants/
│   ├── colors.js
│   ├── config.js
│   └── site.js
│
├── lib/
│   ├── motions.js
│   └── utils.js
│
└── public/
```

---

# 8. COMPONENT ARCHITECTURE

## Layout Components

### Header

* Top auth buttons
* Navigation
* Sticky behavior
* Mobile responsive

### Footer

* Company details
* Quick links
* Regulatory links
* Contact information

### Container

Reusable layout wrapper.

### SectionWrapper

Consistent section spacing.

---

## Card Components

### FeatureCard

Used for:

* Why Trade
* Why MIDAS

### ServiceCard

Used for:

* Account types
* Services

### StatsCard

Used for:

* Market metrics
* Company statistics

### NewsCard

Used for:

* Notices
* News
* Announcements

---

## Shared Components

### SectionHeading

Reusable section title block.

### CTAButton

Primary and secondary button variants.

### Badge

Small status/label indicators.

### NoticeTicker

Scrolling or animated notice area.

---

# 9. STATIC DATA STRATEGY

## IMPORTANT RULE

Never hardcode content directly inside components.

## BAD

```jsx
<h1>Own Your Shares Today</h1>
```

## GOOD

```jsx
<HeroSection data={heroData} />
```

---

# 10. DATA STRUCTURE STRATEGY

## Example

```js
export const heroData = {
  title: '',
  description: '',
  primaryButton: {},
  secondaryButton: {},
  stats: []
}
```

## Why This Matters

Later:

```js
const heroData = await fetch('/api/home')
```

Components remain unchanged.

This is the correct scalable architecture.

---

# 11. TAILWIND DESIGN SYSTEM

## Design System Goal

Centralize:

* Colors
* Typography
* Shadows
* Radius
* Spacing
* Container widths
* Animation timing

Everything should come from:

* tailwind.config.js
* globals.css

---

# 12. RECOMMENDED COLOR SYSTEM

## Primary Colors

Deep navy for trust and finance identity.

## Secondary Colors

Emerald green for growth and gains.

## Accent Colors

Muted gold for premium feel.

## Neutral Colors

Slate gray and off-white.

---

# 13. RECOMMENDED TYPOGRAPHY

## Fonts

Use:

* Inter
* Geist
* Manrope

## Typography Style

* Large headlines
* Clean body text
* Strong hierarchy
* Generous spacing

---

# 14. RESPONSIVE STRATEGY

## Mobile First

Always design mobile-first.

## Breakpoints

```txt
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## Important

Most Nepal users will likely access the site from mobile devices.

Mobile optimization is critical.

---

# 15. ANIMATION STRATEGY

## Use Subtle Motion

Good:

* Fade animations
* Staggered cards
* Hover elevation
* Smooth transitions
* Counter animations

Avoid:

* Heavy parallax
* Constant motion
* Flashy interactions
* Excessive floating effects

---

# 16. SEO STRATEGY

## Important SEO Features

### Semantic HTML

Use:

* main
* section
* article
* nav
* footer

### Metadata

Use Next.js metadata API.

### Image Optimization

Always use:

next/image

### Performance

Optimize:

* LCP
* CLS
* accessibility
* mobile performance

---

# 17. CONTENT INVENTORY

## Important Business Content

### Core Services

* NEPSE trading access
* Demat services
* MIDAS account access
* Trading support
* Market notices

### Trust Content

* Broker number
* Regulatory references
* Grievance officer
* Office locations
* Contact numbers

### Important CTAs

* Register Now
* Open Account
* NEPSE Login
* MIDAS Login
* Demat Login
* Download Forms

---

# 18. IMPORTANT FRONTEND RULES

## Rule 1

Keep UI separate from data.

## Rule 2

Create reusable sections.

## Rule 3

Do not duplicate styling.

## Rule 4

All colors/fonts/spacings must come from design system.

## Rule 5

Keep components modular.

## Rule 6

Use mock data first.

## Rule 7

Optimize mobile layouts heavily.

## Rule 8

Do not overengineer current phase.

---

# 19. DEVELOPMENT PHASES

## Phase 1

Project setup.

## Phase 2

Tailwind design system.

## Phase 3

Layout components.

## Phase 4

Reusable cards/components.

## Phase 5

Homepage sections.

## Phase 6

Internal pages.

## Phase 7

Responsive optimization.

## Phase 8

Animation polish.

## Phase 9

SEO optimization.

---

# 20. BEST CLAUDE WORKFLOW

## Good Prompt Example

```txt
Use existing design system and existing component architecture.
Generate only HeroSection component.
```

## Avoid

```txt
Generate complete website.
```

---

# 21. TOKEN OPTIMIZATION STRATEGY

## IMPORTANT

Do NOT resend:

* full code
* full layouts
* repeated design explanations

Instead say:

```txt
Use existing design system.
Use existing architecture.
Continue from previous component.
```

This reduces token usage massively.

---

# 22. FINAL ENGINEERING RECOMMENDATIONS

## Prioritize

* consistency
* spacing
* typography
* responsive layouts
* trust-focused design
* reusable architecture

## Avoid Premature Complexity

Do NOT add yet:

* Redux
* Zustand
* complex state management
* backend logic
* authentication system
* websocket architecture
* overengineered APIs

Current goal:

Build a premium frontend foundation first.

---

# 23. FINAL OBJECTIVE

The final website should:

* feel premium
* build financial trust
* look modern
* remain scalable
* support future API integration
* maintain clean architecture
* perform well on mobile
* be easy to maintain
* reduce future development complexity

---

# END OF DOCUMENT