# NeuroLearn — Design System & Frontend Guide

> **Aesthetic Direction:** Scientific Precision meets Cognitive Warmth  
> **Theme:** Dark-first · Teal-emerald accent · Editorial typography  
> **Stack:** Next.js 15 · Tailwind CSS v4 · shadcn/ui · Framer Motion  
> **Philosophy:** Every pixel serves memory. No decoration without function.

---

## Reference Websites — Study These Before Building Anything

These are the products whose design craft is worth studying deeply.
Do not copy them. Understand *why* they feel premium, then apply that thinking.

### Tier 1 — Core References (Study Every Detail)

| Product | URL | What to Study |
|---------|-----|---------------|
| **Linear** | linear.app | Sidebar navigation, command palette, keyboard shortcuts, motion curves, dark surfaces |
| **Vercel** | vercel.com | Grid texture backgrounds, Geist typography, spacing precision, hover states |
| **Raycast** | raycast.com | Focus states, command UI, dark mode depth, micro-animations |
| **Supabase** | supabase.com | Dashboard layout, data tables, sidebar structure, teal/green accent on dark |
| **Notion** | notion.so | Breadcrumb navigation, sidebar tree, content density, hover reveals |
| **Stripe** | stripe.com/docs | Documentation typography, tabular data, tinted neutrals, form design |

### Tier 2 — Mood & Aesthetic References

| Product | URL | What to Study |
|---------|-----|---------------|
| **Resend** | resend.com | Minimal dark UI, monospace type, code aesthetics |
| **Liveblocks** | liveblocks.io | Dark mode landing, subtle animations, gradient accents |
| **Planetscale** | planetscale.com | Dashboard charts, deep charcoal palette, clean data viz |
| **Framer** | framer.com | Animation language, scroll storytelling, bold typography |
| **Pitch** | pitch.com | Playful-professional balance, card-based UI, color use |

### Tier 3 — Inspiration Galleries (Bookmark These)

| Site | URL | Purpose |
|------|-----|---------|
| **Dribbble** | dribbble.com | UI concepts, color palettes, component ideas |
| **Mobbin** | mobbin.com | Real app UI patterns from Stripe, Airbnb, Notion |
| **Cosmos** | cosmos.so | Minimal product UI curation |
| **Muzli** | muz.li | Dashboard design examples, data viz |
| **Awwwards** | awwwards.com | Exceptional web experiences, animation references |
| **Behance** | behance.net/search?q=saas+dashboard | SaaS dashboard concepts |
| **Lapa Ninja** | lapa.ninja | SaaS landing pages by category |
| **Designvault** | designvault.io | Screenshot library of premium products |

---

## Design Philosophy

### The One Rule That Makes a UI Feel Premium

> *"Never use a pure neutral. Not #FFFFFF. Not #000000. Not #F5F5F5.  
> Every surface carries a trace of the brand hue.  
> Every shadow leans into the same temperature.  
> The brand color does not sit on top of the design — it runs through it."*  
> — Observed in Linear, Stripe, Vercel, Raycast

**For NeuroLearn:** Our brand hue is a deep teal-emerald (`#0D9488`). This color must bleed into every surface, border, shadow, and muted text. The backgrounds are not gray — they are teal-gray. The borders are not slate — they are teal-slate.

### Three Core Tensions to Balance

1. **Scientific rigor ↔ Cognitive warmth** — The platform is neuroscience-based (precision) but serves students under stress (needs warmth). Cold clinical = bad. Warm educational = good.
2. **Information density ↔ Working memory limits** — Study sessions must be minimal (one card, nothing else). Dashboards can be dense. Know which surface you are designing for.
3. **Engaging ↔ Non-distracting** — Animations must feel satisfying, not attention-stealing. If an animation makes the user look at the effect instead of the content, remove it.

---

## Color System

### Design Token Philosophy

Every color is defined as a CSS variable on `:root`. No hardcoded hex values anywhere in component code. Ever.

### Primary Palette — Teal-Emerald Brand

This is not a generic green. It is a scientific teal — precise, not playful.

```css
:root {
  /* ── Brand Teal-Emerald ─────────────────────── */
  --brand-50:   #F0FDFA;   /* near-white surface tint */
  --brand-100:  #CCFBF1;   /* subtle background highlights */
  --brand-200:  #99F6E4;   /* light border accents */
  --brand-300:  #5EEAD4;   /* disabled/muted elements */
  --brand-400:  #2DD4BF;   /* secondary interactive states */
  --brand-500:  #14B8A6;   /* ← PRIMARY INTERACTIVE (buttons, links, focus) */
  --brand-600:  #0D9488;   /* ← BRAND ANCHOR (logo, key accents) */
  --brand-700:  #0F766E;   /* hover states on primary */
  --brand-800:  #115E59;   /* deep accent borders */
  --brand-900:  #134E4A;   /* darkest decorative accents */
}
```

### Dark Mode Surfaces (Dark-First — The Default)

**Critical:** All surfaces use teal-tinted dark, not pure gray or black.

```css
:root[data-theme="dark"] {
  /* ── Base Surfaces ──────────────────────────── */
  --surface-void:    #060A09;  /* page background — near-black with teal undertone */
  --surface-base:    #0B1210;  /* primary content area (cards, panels) */
  --surface-raised:  #121C1A;  /* raised cards, sidebars */
  --surface-overlay: #19271F;  /* modals, dropdowns, popovers */
  --surface-hover:   #1F312D;  /* hover state on any surface */

  /* ── Borders ─────────────────────────────────── */
  --border-subtle:   rgba(20, 184, 166, 0.06);  /* barely visible structural lines */
  --border-default:  rgba(20, 184, 166, 0.12);  /* standard card / section borders */
  --border-strong:   rgba(20, 184, 166, 0.24);  /* emphasized borders, focus rings */
  --border-brand:    rgba(20, 184, 166, 0.50);  /* interactive element borders */

  /* ── Text ────────────────────────────────────── */
  --text-primary:    #E8F5F3;  /* main body text — warm white with teal tint */
  --text-secondary:  #9BBFBB;  /* secondary labels, descriptions */
  --text-tertiary:   #5C8A85;  /* placeholders, timestamps, metadata */
  --text-disabled:   #3A5C58;  /* disabled states */
  --text-brand:      #2DD4BF;  /* interactive text links */

  /* ── Shadows (tinted with brand hue) ─────────── */
  --shadow-sm:  0 1px 2px rgba(14, 165, 153, 0.08);
  --shadow-md:  0 4px 12px rgba(14, 165, 153, 0.12), 0 1px 3px rgba(14, 165, 153, 0.06);
  --shadow-lg:  0 12px 32px rgba(14, 165, 153, 0.16), 0 4px 8px rgba(14, 165, 153, 0.08);
  --shadow-glow: 0 0 24px rgba(20, 184, 166, 0.20);  /* brand glow on key elements */
}
```

### Light Mode Surfaces (Optional — Secondary Theme)

```css
:root[data-theme="light"] {
  --surface-void:    #F7FFFE;  /* warm teal-white page background */
  --surface-base:    #FFFFFF;  /* cards, panels */
  --surface-raised:  #F0FDFB;  /* subtle raised elements */
  --surface-overlay: #FFFFFF;  /* modals */
  --surface-hover:   #E6FAF7;  /* hover on any surface */

  --border-subtle:   rgba(13, 148, 136, 0.06);
  --border-default:  rgba(13, 148, 136, 0.12);
  --border-strong:   rgba(13, 148, 136, 0.24);

  --text-primary:    #0D1F1C;
  --text-secondary:  #3A6B65;
  --text-tertiary:   #6B9E99;
  --text-brand:      #0D9488;

  --shadow-sm:  0 1px 2px rgba(13, 148, 136, 0.06);
  --shadow-md:  0 4px 12px rgba(13, 148, 136, 0.10);
  --shadow-lg:  0 12px 32px rgba(13, 148, 136, 0.12);
}
```

### Semantic Colors — Status & Mastery

```css
:root {
  /* ── Mastery Level Colors (Neural Map nodes) ── */
  --mastery-unseen:   #2A3530;  /* dark muted gray-teal: never studied */
  --mastery-weak:     #4A1A1A;  /* deep muted red: struggling */
  --mastery-learning: #3A2A0A;  /* deep amber: in progress */
  --mastery-strong:   #0A2A20;  /* deep teal: solid knowledge */
  --mastery-mastered: #134E4A;  /* richest teal: mastered */

  --mastery-unseen-text:   #6B8A85;
  --mastery-weak-text:     #F87171;
  --mastery-learning-text: #FBBF24;
  --mastery-strong-text:   #34D399;
  --mastery-mastered-text: #2DD4BF;

  /* ── Feedback States ──────────────────────── */
  --success-bg:  rgba(16, 185, 129, 0.08);
  --success-text: #34D399;
  --success-border: rgba(16, 185, 129, 0.20);

  --error-bg:    rgba(239, 68, 68, 0.08);
  --error-text:  #F87171;
  --error-border: rgba(239, 68, 68, 0.20);

  --warning-bg:  rgba(245, 158, 11, 0.08);
  --warning-text: #FBBF24;
  --warning-border: rgba(245, 158, 11, 0.20);

  --info-bg:     rgba(59, 130, 246, 0.08);
  --info-text:   #60A5FA;
  --info-border: rgba(59, 130, 246, 0.20);
}
```

---

## Typography

### Font Selection — Why These Fonts

**Do NOT use:** Inter, Roboto, Arial, system-ui, sans-serif defaults. These are generic and signal "AI-generated."

**Our stack:**
- **Display / Headings:** `Syne` — geometric, modern, slightly condensed. Scientific authority without coldness.
- **Body / UI:** `DM Sans` — warm, readable, humanist. Counterbalances Syne's geometry.
- **Monospace / Code / Data:** `JetBrains Mono` — developer-grade, beautiful ligatures, readable at small sizes.

### Font Import (Next.js)

```typescript
// app/layout.tsx
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
```

### Type Scale

```css
:root {
  /* Font families */
  --font-display: 'Syne', var(--font-fallback-sans);
  --font-body:    'DM Sans', var(--font-fallback-sans);
  --font-mono:    'JetBrains Mono', var(--font-fallback-mono);
  --font-fallback-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-fallback-mono: 'SF Mono', 'Fira Code', monospace;

  /* ── Type Scale (fluid — clamp for responsive) ── */
  --text-xs:   0.75rem;    /* 12px — timestamps, badges */
  --text-sm:   0.875rem;   /* 14px — secondary UI, table data */
  --text-base: 1rem;       /* 16px — body copy, card content */
  --text-lg:   1.125rem;   /* 18px — card questions (study session) */
  --text-xl:   1.25rem;    /* 20px — section headings */
  --text-2xl:  1.5rem;     /* 24px — page titles */
  --text-3xl:  clamp(1.75rem, 3vw, 2rem);    /* major headings */
  --text-4xl:  clamp(2rem, 4vw, 2.5rem);     /* hero / display */
  --text-5xl:  clamp(2.5rem, 5vw, 3.5rem);   /* landing page hero */

  /* ── Line Heights ─────────────────────────────── */
  --leading-tight:  1.2;   /* display headings */
  --leading-snug:   1.35;  /* card titles */
  --leading-normal: 1.5;   /* body text */
  --leading-relaxed: 1.7;  /* long-form theory content */

  /* ── Letter Spacing ───────────────────────────── */
  --tracking-tight:  -0.025em;  /* large display headings */
  --tracking-normal: -0.010em;  /* body — slightly tighter than default */
  --tracking-wide:   0.05em;    /* badges, labels, uppercase elements */
  --tracking-wider:  0.10em;    /* ALL CAPS section labels */
}
```

### Typography Usage Rules

```
DISPLAY (Syne):
  Use for: Page titles, basket/subject names, session headers
  Weight: 700–800 for impact, 500–600 for supporting headings
  Letter-spacing: -0.025em for 2xl+, -0.015em for xl
  Never use for: body copy, UI labels, table data

BODY (DM Sans):
  Use for: All UI labels, button text, sidebar items, form fields,
           card metadata, analytics descriptions
  Weight: 400 for body, 500 for labels, 600 for emphasis
  Never use for: code, data tables, monospace content

MONO (JetBrains Mono):
  Use for: Card IDs, statistics numbers, code snippets in node details,
           confidence ratings, FSRS intervals ("Next: 7d"), breadcrumb paths
  Never use for: body copy or UI labels
  Special: Use for all numbers that users compare (scores, days, counts)
           — tabular number alignment is critical for scanability
```

### Readability Rules for Study Context

The study session card text must follow these rules without exception:

- Minimum question text size: `--text-lg` (18px) — never smaller
- Line height on question cards: `--leading-relaxed` (1.7) — this is for reading, not scanning
- Maximum line length on study cards: 60–65 characters — beyond this, reading speed drops
- Explanation text (elaboration panel): `--text-base` (16px), `--leading-relaxed` (1.7)
- High contrast mode: minimum contrast ratio 7:1 (WCAG AAA) for study text

---

## Spacing System

Based on a 4px base unit. All spacing values are multiples of 4.

```css
:root {
  --space-0:  0;
  --space-1:  4px;    /* micro gaps */
  --space-2:  8px;    /* tight component padding */
  --space-3:  12px;   /* default inline padding */
  --space-4:  16px;   /* standard padding */
  --space-5:  20px;   /* comfortable padding */
  --space-6:  24px;   /* section gaps */
  --space-8:  32px;   /* large section padding */
  --space-10: 40px;   /* component separation */
  --space-12: 48px;   /* major section breaks */
  --space-16: 64px;   /* page-level spacing */
  --space-20: 80px;   /* hero sections */
  --space-24: 96px;   /* maximum spacing */
}
```

### Border Radius

```css
:root {
  --radius-sm:   4px;   /* badges, tags, inline code */
  --radius-md:   8px;   /* buttons, inputs, small cards */
  --radius-lg:   12px;  /* standard cards, panels */
  --radius-xl:   16px;  /* feature cards, modals */
  --radius-2xl:  24px;  /* large highlighted cards (study card) */
  --radius-full: 9999px; /* pills, avatars, circular badges */
}
```

---

## Layout Architecture

### App Shell

```
┌─────────────────────────────────────────────────────┐
│ TOPBAR (48px fixed)                                  │
│  [Logo] [Breadcrumb: CS > OS > Unit 1]  [User menu] │
├────────────┬────────────────────────────────────────┤
│            │                                         │
│  SIDEBAR   │         MAIN CONTENT AREA               │
│  (240px)   │         (fluid, min 600px)              │
│            │                                         │
│  fixed     │         scrollable                      │
│  dark      │                                         │
│            │                                         │
├────────────┴────────────────────────────────────────┤
│  (No footer in app — only on landing page)           │
└─────────────────────────────────────────────────────┘
```

### Sidebar Structure

```
SIDEBAR (240px, fixed, --surface-raised)
│
├── Logo + wordmark (32px height)
├── ─────────────────────────────
├── PULSE (today's queue count badge)
├── ─────────────────────────────
├── BASKETS
│   ├── 📁 Computer Science        [3 subjects]
│   │   ├── 💡 Operating Systems   [active ←]
│   │   ├── 💡 Networking
│   │   └── 💡 Programming
│   └── 📁 NEET Biology            [2 subjects]
│       ├── 💡 Cell Biology
│       └── 💡 Genetics
├── ─────────────────────────────
├── Analytics
├── Sleep
└── Settings
```

**Sidebar rules:**
- Width: 240px on desktop, slide-over on mobile
- Active state: left 2px border in `--brand-500`, background `--surface-hover`
- Hover: background transitions to `--surface-hover` in 120ms
- Nested items: 20px left indent, 13px font size
- Expand/collapse on basket click — animated with height transition
- Collapse to icon-only at 768px breakpoint

### Breadcrumb (Always Visible in Topbar)

```
Computer Science  /  Operating Systems  /  Unit 1
[clickable]           [clickable]           [current, not clickable]
```

- Font: `--font-mono`, `--text-sm`, `--text-tertiary`
- Separator: `/` in `--text-disabled`
- Current page: `--text-primary`, not linked
- Each ancestor is a navigation link — clicking navigates back

### Content Grid

```css
.content-area {
  display: grid;
  grid-template-columns: 1fr;          /* single column default */
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  gap: var(--space-6);
}

/* Dashboard: 3-column bento grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
}

/* Playlist page: full viewport canvas (Neural Map) */
.canvas-page {
  width: 100%;
  height: calc(100vh - 48px);   /* minus topbar */
  overflow: hidden;
  position: relative;
}
```

---

## Component Design Specifications

### 1. Buttons

```css
/* Primary Button — brand action */
.btn-primary {
  background: var(--brand-600);
  color: white;
  border: 1px solid var(--brand-700);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: background 120ms ease, box-shadow 120ms ease;
}
.btn-primary:hover {
  background: var(--brand-700);
  box-shadow: var(--shadow-glow);
}
.btn-primary:focus-visible {
  outline: 2px solid var(--brand-400);
  outline-offset: 2px;
}

/* Ghost Button — secondary action */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
}
.btn-ghost:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
  border-color: var(--border-strong);
}
```

### 2. Cards

```css
/* Standard card */
.card {
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

/* Study session card — largest, most important surface */
.study-card {
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-12);
  box-shadow: var(--shadow-lg);
  max-width: 680px;
  margin: 0 auto;
  /* NO hover effect — this is not interactive on the outside */
}
```

### 3. Neural Map Node Styles

```css
/* Base node — applied via inline style from React */
.xy-node {
  border-radius: var(--radius-lg);
  border: 1.5px solid transparent;
  padding: var(--space-3) var(--space-4);
  min-width: 140px;
  max-width: 220px;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
  user-select: none;
}
.xy-node:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.xy-node.selected {
  border-color: var(--brand-500);
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.20), var(--shadow-md);
}

/* Mastery level backgrounds */
.xy-node[data-mastery="unseen"]   { background: var(--mastery-unseen);   color: var(--mastery-unseen-text);   }
.xy-node[data-mastery="weak"]     { background: var(--mastery-weak);     color: var(--mastery-weak-text);     }
.xy-node[data-mastery="learning"] { background: var(--mastery-learning); color: var(--mastery-learning-text); }
.xy-node[data-mastery="strong"]   { background: var(--mastery-strong);   color: var(--mastery-strong-text);   }
.xy-node[data-mastery="mastered"] { background: var(--mastery-mastered); color: var(--mastery-mastered-text); }
```

### 4. Confidence Slider

The slider is the most important UI element in a study session. It must feel deliberate and satisfying.

```
Design spec:
  - 5 distinct clickable segments (not a drag slider — clicking is faster)
  - Labels: "Blank" / "Vague" / "Recall" / "Clear" / "Instant"
  - Colors: Red → Orange → Yellow → Teal → Emerald (left to right)
  - Selected state: filled background, white text, slight scale-up (transform: scale(1.05))
  - Unselected: dark surface, muted label text
  - Transition: 100ms ease on all states
  - Width: full width of study card (no scrolling, no overflow)
  - Height: 52px per segment — large enough for thumbs on mobile
```

### 5. Mastery Progress Ring

Used on dashboard and playlist headers to show overall mastery %.

```
Design spec:
  - SVG circle ring (not a bar)
  - Stroke: --brand-500 for filled portion, --border-default for empty
  - Center text: percentage in --font-display bold
  - Ring thickness: 6px for small (48px diameter), 10px for large (120px)
  - Animation: stroke-dashoffset animated from 0 to target % on mount (800ms ease-out)
```

### 6. Badges & Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
}

/* Variants */
.badge-brand   { background: rgba(20,184,166,0.12); color: var(--brand-400); border: 1px solid rgba(20,184,166,0.20); }
.badge-success { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-border); }
.badge-error   { background: var(--error-bg);   color: var(--error-text);   border: 1px solid var(--error-border);   }
.badge-warning { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); }
.badge-mono    { font-family: var(--font-mono);  /* for FSRS intervals: "7d", "New", etc */ }
```

---

## Animation & Motion System

### Core Principle

> *"Density is in the behavior, not the pixels."* — Linear design philosophy

Animations must be purposeful. Every transition must answer: **What does this motion communicate to the user?** If the answer is "nothing — it just looks cool," remove it.

### Approved Animation Events

| Event | Animation | Duration | Easing |
|-------|-----------|----------|--------|
| Card reveal (answer shown) | Fade up: `opacity 0→1, translateY 8px→0` | 220ms | `ease-out` |
| Session transition (next card) | Slide left: `translateX 0→-20px, opacity 1→0` then new card `+20px→0` | 180ms each | `ease-in-out` |
| Correct answer | Green flash on card border: `border-color → --success-border` | 400ms | `ease-out` |
| Wrong answer | Red flash + subtle shake: `border-color + translateX ±4px` | 400ms | `ease-out` |
| Sidebar expand | Height: `0 → auto` via max-height trick | 200ms | `ease-out` |
| Node hover on map | `translateY -1px, box-shadow` | 150ms | `ease-out` |
| Node selected | Ring glow appear | 150ms | `ease-out` |
| Mastery level change | Node background color transition | 600ms | `ease-in-out` |
| Confidence selection | Segment scale + fill | 100ms | `ease-out` |
| Progress bar fill | Width transition in session header | 300ms | `ease-out` |
| Page navigation | No full-page animations — feels slow. Use skeleton loaders instead | — | — |

### Framer Motion Config (Reusable Variants)

```typescript
// lib/animations/variants.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

export const slideLeft = {
  exit:   { opacity: 0, x: -20, transition: { duration: 0.18, ease: 'easeIn' } },
  enter:  { opacity: 0, x: 20 },
  visible:{ opacity: 1, x: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

export const wrongShake = {
  x: [0, -4, 4, -3, 3, -2, 2, 0],
  transition: { duration: 0.4, ease: 'easeOut' },
}

export const correctPulse = {
  scale: [1, 1.005, 1],
  transition: { duration: 0.4, ease: 'easeOut' },
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.20, ease: 'easeOut' } },
}
```

### What NOT to Animate

```
❌ Full page fade/slide transitions — adds 300ms latency to every navigation
❌ Sidebar items on hover (text moving, icons spinning)
❌ Loading spinners — use skeleton screens instead
❌ Numbers counting up on mount — draws attention away from content
❌ Parallax scrolling on study/map pages — causes motion sickness
❌ Any animation on the study card question text — user is reading
❌ Celebratory confetti or particle effects — distracts from next card
```

---

## Page-by-Page Design Specifications

### Dashboard (Pulse Page)

**Layout:** Bento grid. Not a uniform card list.

```
┌─────────────────────┬──────────────────┬──────────────┐
│                     │                  │              │
│   TODAY'S PULSE     │  STREAK          │  SLEEP       │
│   "14 cards due"    │  "12 days"       │  "Good"      │
│   [Start Session]   │                  │  study now   │
│                     │                  │              │
│   (span: 6 cols)    │  (span: 3 cols)  │ (span: 3)    │
├─────────────────────┴──────────────────┴──────────────┤
│   BASKET MASTERY RINGS                                 │
│   [CS 34%] [NEET 61%] [Sem 3 12%]                     │
│   (span: 12 cols)                                      │
├─────────────────────────┬──────────────────────────────┤
│   WEAK SPOTS            │  STUDY HEATMAP               │
│   Top 3 struggling nodes│  (GitHub-style calendar)     │
│   (span: 5 cols)        │  (span: 7 cols)              │
└─────────────────────────┴──────────────────────────────┘
```

**Key design decisions:**
- "Start Session" button is the largest, most prominent element on the page
- Streak and sleep are metric cards — secondary, not competing
- Heatmap uses `--brand-100` to `--brand-700` as the intensity scale
- Weak spot cards show node title, subject, error rate, and a "Review Now" micro-action

### Study Session Page

**This page is the most important page. It must be distraction-zero.**

```
LAYOUT:
  - No sidebar visible (full-screen mode automatically)
  - Topbar minimized: only breadcrumb + exit button
  - Background: --surface-void (darkest possible)
  - One card centered — nothing else competing for attention

CARD STRUCTURE (top to bottom):
  1. Session progress: [===      ] 3 of 14 cards · Deck name
  2. Node context: "Operating Systems > Unit 1 > Deadlocks"
     (small, monospace, tertiary color — context without distraction)
  3. Question card (--study-card style)
     - Question text: --text-lg, --leading-relaxed
     - Answer input (for free recall): 3-row textarea, full card width
  4. [Reveal Answer] button (full width of card)
  --- After reveal ---
  5. Answer shown in card (green/red tinted background)
  6. Explanation panel (slides down, --surface-overlay background)
  7. Confidence selector (5-segment, full width)
  8. [Auto-proceed] or [Manual next] button
```

**Rules:**
- No other UI visible while a card is active
- Keyboard shortcuts: Space = reveal, 1-5 = confidence, Enter = next
- ESC returns to dashboard (with confirmation if mid-session)

### Playlist Map Page (XY Flow)

```
LAYOUT:
  - Full viewport canvas (no scroll — panning and zooming only)
  - Topbar: breadcrumb + "Add Node" button + zoom controls
  - No sidebar (collapsed or hidden)
  - Node detail sidebar: slides in from right on node click (420px)
  - Canvas background: dot grid pattern (Vercel-style)
    repeating-radial-gradient(circle, var(--border-subtle) 1px, transparent 1px)
    background-size: 24px 24px

NODE SIDEBAR TABS:
  1. Theory (markdown content)
  2. Remember (mnemonics + anchor)
  3. References (URL list with icons)
  4. Cards (linked FSRS cards — create/edit/delete)

MAP LEGEND (bottom-left corner):
  [● Unseen] [● Weak] [● Learning] [● Strong] [● Mastered]
  Small, using mastery colors, collapsible
```

---

## Tailwind CSS v4 Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
        },
        surface: {
          void:    'var(--surface-void)',
          base:    'var(--surface-base)',
          raised:  'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          hover:   'var(--surface-hover)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          brand:     'var(--text-brand)',
        },
        border: {
          subtle:  'var(--border-subtle)',
          default: 'var(--border-default)',
          strong:  'var(--border-strong)',
          brand:   'var(--border-brand)',
        },
      },
      fontFamily: {
        display: 'var(--font-display)',
        body:    'var(--font-body)',
        mono:    'var(--font-mono)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl':'var(--radius-2xl)',
      },
      boxShadow: {
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
      },
      keyframes: {
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-4px)' },
          '40%':      { transform: 'translateX(4px)' },
          '60%':      { transform: 'translateX(-3px)' },
          '80%':      { transform: 'translateX(3px)' },
        },
        'pulse-correct': {
          '0%, 100%': { 'border-color': 'var(--border-default)' },
          '50%':      { 'border-color': 'var(--success-border)' },
        },
      },
      animation: {
        'shake':         'shake 400ms ease-out',
        'pulse-correct': 'pulse-correct 400ms ease-out',
      },
    },
  },
}
export default config
```

---

## Background Textures & Atmosphere

### Canvas Map Background (Dot Grid)

```css
.map-canvas-bg {
  background-color: var(--surface-void);
  background-image: radial-gradient(
    circle,
    var(--border-subtle) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}
```

### Dashboard / Content Page Background

```css
.page-bg {
  background-color: var(--surface-void);
  /* Subtle gradient in top-left corner — brand energy without distraction */
  background-image: radial-gradient(
    ellipse 60% 40% at 0% 0%,
    rgba(20, 184, 166, 0.04) 0%,
    transparent 70%
  );
}
```

### Study Session Background

```css
.study-bg {
  background-color: var(--surface-void);
  /* Minimal — no texture. Pure focus. */
}
```

---

## Accessibility Requirements

### Required for Every Interactive Element

```
1. Focus rings:
   outline: 2px solid var(--brand-400);
   outline-offset: 2px;
   Never remove outline — only restyle it.

2. Minimum touch target: 44×44px (mobile)
   All buttons, links, sidebar items, confidence segments

3. Color is never the only signal:
   Wrong answer: red border + "✗ Incorrect" text label
   Correct answer: green border + "✓ Correct" text label
   Node mastery: color + text label in the sidebar

4. Keyboard navigation:
   Tab order: logical top-left → bottom-right
   Study session: full keyboard-only operation (Space, 1-5, Enter, Escape)
   Neural map: arrow keys pan, +/- zoom, Enter to open selected node

5. Reduced motion:
   @media (prefers-reduced-motion: reduce) {
     * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
   }
```

### WCAG AA Minimum (Non-Negotiable)

| Text Size | Minimum Contrast Ratio |
|-----------|----------------------|
| Body text (16px+) | 4.5:1 |
| Large text / headings (24px+) | 3:1 |
| Study card question | 7:1 (WCAG AAA — critical reading) |
| UI labels and buttons | 4.5:1 |

---

## What NOT to Build in the UI

These design patterns are explicitly banned.

```
❌ Purple gradients — the default AI-generated color. Screams generic.
❌ Glassmorphism as the dominant style — beautiful in Figma, blurry in use
❌ Neumorphism / skeuomorphism — wrong era, wrong audience
❌ Large decorative illustrations on every page — cognitive clutter
❌ Progress percentage on everything — only where mastery is the point
❌ Tooltips on obvious elements — if you need a tooltip, simplify the label
❌ Auto-dismissing toast notifications without user control
❌ Modals for simple confirmations — use inline states instead
❌ Empty states with a cartoon illustration — use a purposeful, text-first message
❌ Gradient text (background-clip: text) overused — one place maximum
❌ Multiple font weights of the same sentence — pick one weight and be decisive
❌ Centering body text blocks wider than 680px — hurts readability
❌ Background music or ambient sounds without user opt-in
❌ Any animation that loops indefinitely without user action
❌ Full-page loading animations (spinners) — skeleton screens only
```

---

## Final Instructions — How to Build With This System

1. **Read this file before writing any component.** Not after.
2. **Define colors in CSS variables first.** Never write a hex code directly in a component.
3. **Choose Syne for headings, DM Sans for everything else.** No exceptions without a documented reason.
4. **Build study session in isolation first.** It is the core product. Get it perfect before building the dashboard.
5. **Test every color on an actual dark screen** (OLED or high-contrast monitor). Colors that look fine on a gray laptop screen often become muddy on real hardware.
6. **Check WCAG contrast on every text color change.** Use polypane.app or the Chrome DevTools accessibility pane.
7. **Every animation must be removable in 10 seconds** without breaking the UI. If it is load-bearing, it is not an animation — it is a component.
8. **Build mobile first.** The sidebar collapses, the canvas switches to a list view, the study card goes full-screen on mobile. Design the 375px viewport first.

---

*Design System version 1.0 — NeuroLearn Platform*  
*Primary inspiration: Linear, Vercel, Supabase, Raycast*  
*Reference galleries: Dribbble, Mobbin, Cosmos, Muzli, Awwwards*