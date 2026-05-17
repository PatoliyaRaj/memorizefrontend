---
name: Neuro-Cognitive Precision
colors:
  surface: '#0f1413'
  surface-dim: '#0f1413'
  surface-bright: '#353a39'
  surface-container-lowest: '#0a0f0e'
  surface-container-low: '#171d1c'
  surface-container: '#1b2120'
  surface-container-high: '#262b2a'
  surface-container-highest: '#303635'
  on-surface: '#dee4e1'
  on-surface-variant: '#bcc9c6'
  inverse-surface: '#dee4e1'
  inverse-on-surface: '#2c3130'
  outline: '#879391'
  outline-variant: '#3d4947'
  surface-tint: '#6bd8cb'
  primary: '#6bd8cb'
  on-primary: '#003732'
  primary-container: '#29a195'
  on-primary-container: '#00302b'
  inverse-primary: '#006a61'
  secondary: '#4fdbc8'
  on-secondary: '#003731'
  secondary-container: '#04b4a2'
  on-secondary-container: '#003f38'
  tertiary: '#ffb59a'
  on-tertiary: '#591c02'
  tertiary-container: '#d27956'
  on-tertiary-container: '#4f1700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#773215'
  background: '#0f1413'
  on-background: '#dee4e1'
  surface-variant: '#303635'
  surface-void: '#060A09'
  surface-base: '#0B1210'
  surface-raised: '#121C1A'
  surface-overlay: '#19271F'
  text-primary: '#E8F5F3'
  text-secondary: '#9BBFBB'
  mastery-weak: '#4A1A1A'
  mastery-learning: '#3A2A0A'
  mastery-strong: '#0A2A20'
  mastery-mastered: '#134E4A'
typography:
  display:
    fontFamily: Syne
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Syne
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: '1.2'
  body-base:
    fontFamily: DM Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: -0.010em
  body-sm:
    fontFamily: DM Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.35'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
---

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
