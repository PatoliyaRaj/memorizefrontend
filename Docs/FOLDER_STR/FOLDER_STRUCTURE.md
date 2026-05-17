# Frontend Folder Structure Documentation

## Overview

This document explains the complete folder structure for the NeuroLearn frontend application. The structure follows Next.js best practices with feature-based organization and clear separation of concerns.

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router (Routes Only)
│   │   ├── layout.tsx               # Root layout with theme provider
│   │   ├── page.tsx                 # Home/landing page
│   │   ├── globals.css              # Global styles
│   │   ├── favicon.ico
│   │   ├── (dashboard)/             # Route group - Dashboard pages
│   │   │   ├── layout.tsx           # Dashboard layout (sidebar + topbar)
│   │   │   └── page.tsx             # Pulse/dashboard homepage
│   │   ├── (study)/                 # Route group - Study session pages
│   │   │   ├── [playlistId]/        # Dynamic study session route
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx           # Study session layout (minimal UI)
│   │   └── (auth)/                  # Route group - Auth pages
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── signup/
│   │           └── page.tsx
│   │
│   ├── components/                   # Reusable UI Components
│   │   ├── ui/                      # shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...other shadcn components
│   │   │
│   │   ├── layout/                  # Layout components (used across pages)
│   │   │   ├── header.tsx           # Top navigation bar
│   │   │   ├── sidebar.tsx          # Left sidebar navigation
│   │   │   ├── topbar.tsx           # Breadcrumb + user menu
│   │   │   └── footer.tsx           # Footer (if needed)
│   │   │
│   │   ├── common/                  # Small, reusable utility components
│   │   │   ├── theme-toggle.tsx     # Dark/light mode switcher
│   │   │   ├── loading-spinner.tsx  # Loading indicator
│   │   │   ├── empty-state.tsx      # Empty state placeholder
│   │   │   └── error-boundary.tsx   # Error fallback
│   │   │
│   │   └── README.md                # Component guidelines
│   │
│   ├── features/                     # Feature-Based Modules
│   │   │                            # Each feature is self-contained
│   │   │                            # with its own components, hooks, types
│   │   │
│   │   ├── dashboard/               # Dashboard/Pulse page feature
│   │   │   ├── components/
│   │   │   │   ├── pulse-card.tsx          # Today's cards due card
│   │   │   │   ├── streak-card.tsx         # Streak display
│   │   │   │   ├── sleep-quality.tsx       # Sleep status
│   │   │   │   ├── weak-spots.tsx          # Struggling nodes
│   │   │   │   ├── mastery-rings.tsx       # Subject mastery %
│   │   │   │   └── study-heatmap.tsx       # GitHub-style heatmap
│   │   │   ├── hooks/
│   │   │   │   ├── useDashboardData.ts    # Fetch dashboard metrics
│   │   │   │   └── usePulseQueue.ts       # Calculate cards due
│   │   │   ├── types/
│   │   │   │   └── index.ts               # Dashboard-specific types
│   │   │   └── utils/
│   │   │       ├── calculate-mastery.ts   # Mastery % logic
│   │   │       └── format-metrics.ts      # Format numbers/dates
│   │   │
│   │   ├── study/                   # Study session feature
│   │   │   ├── components/
│   │   │   │   ├── study-card.tsx          # Main flashcard component
│   │   │   │   ├── confidence-selector.tsx # 5-segment slider
│   │   │   │   ├── progress-bar.tsx        # Session progress
│   │   │   │   ├── answer-panel.tsx        # Answer reveal section
│   │   │   │   └── session-controls.tsx    # Play/pause/exit controls
│   │   │   ├── hooks/
│   │   │   │   ├── useStudySession.ts     # Session state management
│   │   │   │   ├── useCardFlip.ts         # Card reveal animation
│   │   │   │   └── useKeyboardShortcuts.ts # Space, 1-5, Enter, Esc
│   │   │   ├── types/
│   │   │   │   └── index.ts               # Card, Session types
│   │   │   └── utils/
│   │   │       ├── fsrs-scheduler.ts      # FSRS algorithm
│   │   │       └── calculate-due-date.ts  # Next review date
│   │   │
│   │   ├── auth/                    # Authentication feature
│   │   │   ├── components/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── signup-form.tsx
│   │   │   │   └── forgot-password.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useAuthForm.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   │
│   │   └── playlist/                # Neural Map / Playlist feature
│   │       ├── components/
│   │       │   ├── canvas-map.tsx         # XY flow canvas
│   │       │   ├── node-element.tsx       # Single node on map
│   │       │   ├── node-detail-panel.tsx  # Right sidebar on node select
│   │       │   ├── map-legend.tsx         # Mastery color legend
│   │       │   └── add-node-modal.tsx     # New node creation
│   │       ├── hooks/
│   │       │   ├── useCanvasPan.ts       # Pan/zoom control
│   │       │   ├── useNodeSelection.ts   # Node select state
│   │       │   └── useNodeDrag.ts        # Drag nodes on canvas
│   │       ├── types/
│   │       │   └── index.ts
│   │       └── utils/
│   │           ├── node-positioning.ts    # Calculate node x/y
│   │           └── connection-lines.ts    # Draw link lines
│   │
│   ├── stores/                       # Zustand State Management
│   │   ├── use-theme-store.ts       # Dark/light mode (persisted)
│   │   ├── use-auth-store.ts        # Current user + auth token
│   │   ├── use-dashboard-store.ts   # Dashboard cache + filters
│   │   ├── use-study-store.ts       # Active session state
│   │   └── use-playlist-store.ts    # Playlist/map state + selection
│   │
│   ├── hooks/                        # Global Custom Hooks
│   │   ├── use-theme.ts             # Access theme from store
│   │   ├── use-auth.ts              # Access auth state
│   │   ├── useApi.ts                # Generic API call hook
│   │   └── useLocalStorage.ts       # Persistent state hook
│   │
│   ├── types/                        # Global TypeScript Types
│   │   ├── api.ts                   # API response/request types
│   │   ├── models.ts                # Data models (User, Card, Node, etc)
│   │   └── index.ts                 # Barrel export
│   │
│   ├── services/                     # API Service Layer
│   │   ├── api-client.ts            # Axios/fetch wrapper
│   │   ├── dashboard-service.ts     # Dashboard API calls
│   │   ├── study-service.ts         # Study session API calls
│   │   ├── auth-service.ts          # Login/signup API calls
│   │   ├── playlist-service.ts      # Playlist/node API calls
│   │   └── README.md                # Service usage guide
│   │
│   ├── lib/                          # Utility Functions
│   │   ├── utils.ts                 # General helpers (cn, format, etc)
│   │   ├── api.ts                   # API setup/interceptors
│   │   ├── constants.ts             # App-wide constants
│   │   └── validators.ts            # Form validation rules
│   │
│   ├── styles/                       # Global Stylesheets
│   │   ├── variables.css            # CSS variables (colors, spacing)
│   │   ├── animations.css           # Reusable animations
│   │   └── theme.css                # Theme-specific styles
│   │
│   └── config/                       # Configuration Files
│       ├── site-config.ts           # Site metadata, navigation
│       └── feature-flags.ts         # Feature toggles (beta features)
│
├── public/                            # Static Assets (Not bundled)
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-banner.jpg
│   │   └── illustrations/
│   ├── icons/
│   │   ├── favicon.ico
│   │   └── social-icons/
│   └── fonts/
│       └── (if custom fonts)
│
├── .env.local                        # Local environment variables (git ignored)
├── .env.example                      # Example env template
├── .gitignore
├── .eslintignore
├── components.json                  # shadcn/ui configuration
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
├── FOLDER_STRUCTURE.md              # This file
└── README.md                         # Project readme

```

---

## Detailed Explanation

### 1. **`src/app/` - Next.js Routes (Routing Only)**

**Why:** Next.js 13+ uses file-based routing. The `app/` directory defines all URL routes.

**What goes here:**
- `layout.tsx` files - Shared UI for route segments
- `page.tsx` files - The actual page content
- `globals.css` - Styles for the entire app
- `(route-groups)` - Optional folder groups that don't affect URLs

**Example:**
- `app/(dashboard)/page.tsx` → `/dashboard`
- `app/(study)/[playlistId]/page.tsx` → `/study/abc123`
- `app/(auth)/login/page.tsx` → `/login`

**Rule:** Routes should be **thin**. Import components and hooks from `features/`, not define business logic here.

---

### 2. **`src/components/` - Reusable UI Components**

**Why:** Shared components used across multiple features or pages.

**Subfolders:**
- **`ui/`** - shadcn/ui components (button, card, dialog, etc). These are auto-generated and should rarely be modified.
- **`layout/`** - Components that appear on every page (Header, Sidebar, Topbar). These wrap route pages.
- **`common/`** - Small, generic components (ThemeToggle, LoadingSpinner, ErrorBoundary).

**Rule:** If a component is used in more than one feature, it lives here. If it's feature-specific, it lives in `features/[feature]/components/`.

---

### 3. **`src/features/` - Feature-Based Code (Main Business Logic)**

**Why:** Organizes code by feature/domain. Easier to scale, find code, and delete features.

**Structure per feature:**
```
features/[feature-name]/
├── components/        # Feature-specific components
├── hooks/            # Feature-specific custom hooks
├── types/            # Feature-specific TypeScript types
└── utils/            # Feature-specific utility functions
```

**Example - Dashboard Feature:**
```
features/dashboard/
├── components/
│   ├── pulse-card.tsx       # Cards due today
│   ├── streak-card.tsx      # Study streak
│   └── weak-spots.tsx       # Struggling topics
├── hooks/
│   ├── useDashboardData.ts  # Fetch dashboard data
│   └── usePulseQueue.ts     # Calculate queue
├── types/
│   └── index.ts             # DashboardMetrics, PulseCard types
└── utils/
    └── calculate-mastery.ts # Mastery percentage logic
```

**Why structure this way:**
1. **Cohesion** - All code related to "dashboard" is in one place
2. **Isolation** - Dashboard logic doesn't leak into study or auth
3. **Scalability** - New team members find where dashboard code lives
4. **Deletability** - To remove a feature, delete its folder

---

### 4. **`src/stores/` - Zustand State Management**

**Why:** Global state that multiple features need (user session, theme, dashboard filters).

**What goes here:**
- `use-theme-store.ts` - Dark/light mode (persisted to localStorage)
- `use-auth-store.ts` - Current user, auth token, login state
- `use-dashboard-store.ts` - Cached dashboard data, active filters
- `use-study-store.ts` - Active study session (current card, progress)
- `use-playlist-store.ts` - Selected node, canvas zoom/pan state

**Example:**
```typescript
// src/stores/use-auth-store.ts
import { create } from 'zustand'

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, token: null }),
}))
```

**Rule:** Use stores for state that:
- Multiple features need to access
- Should persist across page navigation
- Is needed before the route mounts

For local component state, use `useState()`.

---

### 5. **`src/hooks/` - Global Custom Hooks**

**Why:** Reusable logic that multiple features use.

**What goes here:**
- `useApi.ts` - Generic hook to fetch from any API endpoint
- `useAuth.ts` - Access current user (wraps the auth store)
- `useTheme.ts` - Access theme mode
- `useLocalStorage.ts` - Persist state to localStorage

**Example:**
```typescript
// src/hooks/useApi.ts
export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(e => setError(e))
  }, [url])

  return { data, loading, error }
}
```

**Rule:** Feature-specific hooks go in `features/[feature]/hooks/`. Global hooks that multiple features use go here.

---

### 6. **`src/types/` - Global TypeScript Types**

**Why:** Shared type definitions referenced across the app.

**What goes here:**
- `models.ts` - Data models (User, Card, Node, Basket, Subject)
- `api.ts` - API request/response types
- `index.ts` - Barrel export for convenience

**Example:**
```typescript
// src/types/models.ts
export type User = {
  id: string
  name: string
  email: string
  createdAt: Date
}

export type Card = {
  id: string
  question: string
  answer: string
  nodeId: string
  nextReviewDate: Date
}

export type Node = {
  id: string
  title: string
  masteryLevel: 'unseen' | 'weak' | 'learning' | 'strong' | 'mastered'
  playlistId: string
}
```

**Rule:** Feature-specific types go in `features/[feature]/types/`. Global/shared types go here.

---

### 7. **`src/services/` - API Layer**

**Why:** Centralizes all backend communication. If the API changes, you update one place.

**What goes here:**
- `api-client.ts` - Axios or fetch wrapper with auth headers, interceptors
- `dashboard-service.ts` - Dashboard API endpoints
- `study-service.ts` - Study session endpoints
- `auth-service.ts` - Login/signup endpoints
- `playlist-service.ts` - Node/playlist endpoints

**Example:**
```typescript
// src/services/dashboard-service.ts
import { apiClient } from './api-client'
import { DashboardMetrics } from '@/types'

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data } = await apiClient.get('/api/dashboard/metrics')
  return data
}

export async function getWeakSpots(limit: number = 3) {
  const { data } = await apiClient.get('/api/dashboard/weak-spots', {
    params: { limit }
  })
  return data
}
```

**Rule:** Components call service functions, not `fetch()` directly. This makes testing and refactoring easier.

---

### 8. **`src/lib/` - Utility Functions**

**Why:** Helpers used throughout the app that don't fit elsewhere.

**What goes here:**
- `utils.ts` - General helpers (cn for Tailwind classes, format dates, etc)
- `constants.ts` - App-wide constants (API URL, feature flags, etc)
- `validators.ts` - Form validation (email regex, password strength, etc)
- `api.ts` - API configuration and interceptors

**Example:**
```typescript
// src/lib/utils.ts
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}
```

---

### 9. **`src/styles/` - Global Stylesheets**

**Why:** CSS that can't be inline or componentized.

**What goes here:**
- `variables.css` - CSS custom properties (colors, spacing, fonts)
- `animations.css` - Reusable Framer Motion or CSS animations
- `theme.css` - Dark/light mode overrides

**Example:**
```css
/* src/styles/variables.css */
:root {
  --brand-600: #0D9488;
  --surface-void: #060A09;
  --text-primary: #E8F5F3;
  --spacing-4: 16px;
}

.dark {
  --background: var(--surface-void);
  --foreground: var(--text-primary);
}
```

---

### 10. **`src/config/` - Configuration Files**

**Why:** Settings and metadata that don't change per request.

**What goes here:**
- `site-config.ts` - Site name, navigation items, metadata
- `feature-flags.ts` - Toggle features on/off

**Example:**
```typescript
// src/config/site-config.ts
export const siteConfig = {
  name: 'Memorize',
  description: 'NeuroLearn learning platform',
  navigation: [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Study', href: '/study' },
    { title: 'Playlist', href: '/playlist' },
  ],
}
```

---

### 11. **`public/` - Static Assets**

**Why:** Files served directly by Next.js (not bundled).

**What goes here:**
- Images, icons, fonts that don't change
- Should be optimized before upload

**Subfolders:**
- `images/` - Logos, banners, illustrations
- `icons/` - Favicon, social share icons
- `fonts/` - Custom font files (if any)

---

## Key Principles

### ✅ **DO:**
1. **Keep routes thin** - Routes should import components and call services, not contain business logic
2. **Co-locate feature code** - Dashboard components, types, hooks together in `features/dashboard/`
3. **Use services for API calls** - Never call fetch() directly from components
4. **Type everything** - Use TypeScript for all data structures
5. **Barrel exports** - Export from `index.ts` in folders for cleaner imports
6. **Feature-first organization** - Group by "what it does" not "what it is"

### ❌ **DON'T:**
1. Don't put business logic in routes - Routes should be thin entry points
2. Don't mix features - Dashboard logic stays in `features/dashboard/`, not in `features/study/`
3. Don't duplicate types - Define once, import everywhere
4. Don't put API logic in components - Always use services
5. Don't nest features inside features - Keep the 2-level structure flat

---

## Example Import Patterns

```typescript
// ✅ GOOD - Clear, organized imports
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { PulseCard } from '@/features/dashboard/components/pulse-card'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'
import { getDashboardMetrics } from '@/services/dashboard-service'
import { useThemeStore } from '@/stores/use-theme-store'
import { cn } from '@/lib/utils'
import type { DashboardMetrics } from '@/types'

// ❌ BAD - Messy, scattered imports
import Button from '../../components/ui/Button'
import { someHelper } from '../../utils/random-helper'
import { API_CALL } from '../../api/endpoint'
```

---

## Scaling Tips

As the project grows:

1. **Add more features** - Create new folders in `features/` for each domain
2. **Extract shared patterns** - Move repeated code to `hooks/` or `services/`
3. **Create layout variants** - Add layout.tsx to different route groups for different UIs
4. **Add middleware** - Create `src/middleware.ts` for auth checks, redirects
5. **API versioning** - Organize services by API version if needed

---

This structure is designed to:
- ✅ Scale with your team
- ✅ Keep code organized and findable
- ✅ Make testing easier
- ✅ Support feature-based development
- ✅ Allow independent feature work

