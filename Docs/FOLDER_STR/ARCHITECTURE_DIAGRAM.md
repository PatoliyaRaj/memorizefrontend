```
 ___  ___                              _              
|  \/  |                             (_)             
| .  . | ___ _ __ ___   ___  _ __ ___ _ _______ 
| |\/| |/ _ \ '_ ` _ \ / _ \| '__/ _ \ |_  / _ \
| |  | |  __/ | | | | | (_) | | |  __/ |/ /  __/
\_|  |_/\___|_| |_| |_|\___/|_|  \___|_/___\___|
                                                 
                Frontend Architecture
              Production-Ready Folder Structure
```

# Frontend Architecture Diagram

## 🎯 Big Picture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MEMORIZE FRONTEND                               │
│                        Next.js 16 + Zustand                             │
└─────────────────────────────────────────────────────────────────────────┘

                              USER BROWSER
                                  │
                                  ▼
                         ┌────────────────┐
                         │   Routes       │
                         │  (Next.js)     │
                         └────────────────┘
                         /dashboard /study
                         /auth /playlist
                                  │
                  ┌───────────────┼───────────────┐
                  │               │               │
                  ▼               ▼               ▼
            ┌────────┐      ┌──────────┐   ┌──────────┐
            │Dashboard│      │  Study   │   │   Auth   │
            │Feature  │      │ Feature  │   │ Feature  │
            └────────┘      └──────────┘   └──────────┘
                  │               │               │
                  └───────────────┼───────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
                ┌────────┐  ┌──────────┐  ┌─────────┐
                │ Hooks  │  │ Services │  │ Stores  │
                │(Logic) │  │ (API)    │  │(State)  │
                └────────┘  └──────────┘  └─────────┘
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                        ┌─────────▼────────┐
                        │   Components     │
                        │  (UI Rendering)  │
                        └──────────────────┘
                                  │
                                  ▼
                           BROWSER DISPLAY
```

---

## 📁 Tree Structure

```
frontend/
│
├── 📖 Documentation
│   ├── FRONTEND_DOCS_INDEX.md         ← START HERE
│   ├── ARCHITECTURE_SUMMARY.md        ← Visual overview
│   ├── FOLDER_STRUCTURE.md            ← Detailed explanations
│   ├── QUICK_REFERENCE.md             ← Checklists & patterns
│   └── ARCHITECTURE_PATTERNS.md       ← Code examples
│
├── 📦 Configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.cjs
│   ├── postcss.config.mjs
│   └── components.json
│
├── 🎨 Public Assets
│   └── public/
│       ├── images/
│       └── icons/
│
└── 💻 Source Code
    ├── src/
    │
    ├── 🛣️  Routes (Entry Points)
    │   └── app/
    │       ├── layout.tsx          # Root layout
    │       ├── page.tsx            # Home page
    │       ├── globals.css         # Global styles
    │       ├── (dashboard)/        # Route group
    │       ├── (study)/            # Route group
    │       └── (auth)/             # Route group
    │
    ├── 🎯 Features (Business Logic)
    │   └── features/
    │       ├── dashboard/
    │       │   ├── components/     # DashboardCards, StreakCard, etc
    │       │   ├── hooks/          # useDashboardData
    │       │   ├── types/          # DashboardMetrics
    │       │   ├── utils/          # calculateMastery
    │       │   └── README.md
    │       │
    │       ├── study/
    │       │   ├── components/     # StudyCard, ConfidenceSlider, etc
    │       │   ├── hooks/          # useStudySession
    │       │   ├── types/          # StudySession
    │       │   └── utils/          # fsrs-scheduler
    │       │
    │       ├── auth/
    │       │   ├── components/     # LoginForm, SignupForm
    │       │   ├── hooks/          # useAuth
    │       │   └── types/          # AuthState
    │       │
    │       └── playlist/
    │           ├── components/     # CanvasMap, NodeElement
    │           ├── hooks/          # useCanvasPan, useNodeDrag
    │           └── types/          # PlaylistNode
    │
    ├── 🧩 Components (UI Blocks)
    │   └── components/
    │       ├── ui/                 # shadcn/ui (auto-generated)
    │       │   └── button.tsx, card.tsx, dialog.tsx, etc
    │       │
    │       ├── layout/             # Page wrappers
    │       │   ├── sidebar.tsx
    │       │   ├── header.tsx
    │       │   └── topbar.tsx
    │       │
    │       ├── common/             # Generic utilities
    │       │   ├── theme-toggle.tsx
    │       │   ├── loading-spinner.tsx
    │       │   ├── empty-state.tsx
    │       │   └── error-boundary.tsx
    │       │
    │       └── README.md
    │
    ├── 💾 Global State Management
    │   └── stores/
    │       ├── use-auth-store.ts    # User session (Zustand)
    │       ├── use-theme-store.ts   # Dark/light mode (Zustand)
    │       ├── use-dashboard-store.ts
    │       ├── use-study-store.ts
    │       └── use-playlist-store.ts
    │
    ├── 🔌 API Communication
    │   └── services/
    │       ├── api-client.ts        # HTTP client setup
    │       ├── auth-service.ts
    │       ├── dashboard-service.ts
    │       ├── study-service.ts
    │       ├── playlist-service.ts
    │       └── README.md
    │
    ├── 🪝 Global Hooks
    │   └── hooks/
    │       ├── useApi.ts            # Generic API hook
    │       ├── useAuth.ts           # Access auth store
    │       ├── useTheme.ts          # Access theme store
    │       └── useLocalStorage.ts
    │
    ├── 📘 Global Types
    │   └── types/
    │       ├── models.ts            # User, Card, Node, etc
    │       ├── api.ts               # API request/response
    │       └── index.ts             # Barrel exports
    │
    ├── 🛠️  Utilities
    │   └── lib/
    │       ├── utils.ts             # cn(), formatDate(), etc
    │       ├── constants.ts         # App-wide constants
    │       └── validators.ts        # Form validation rules
    │
    ├── 🎨 Styling
    │   └── styles/
    │       ├── variables.css        # CSS variables
    │       ├── animations.css       # Keyframes
    │       └── theme.css            # Theme overrides
    │
    └── ⚙️  Configuration
        └── config/
            ├── site-config.ts       # Site metadata
            └── feature-flags.ts     # Feature toggles
```

---

## 🔄 Data Flow: Dashboard Example

```
┌──────────────────────────────────────────────────────────────┐
│                   USER VISITS /dashboard                     │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  app/(dashboard)/page.tsx           │
        │  ↓                                  │
        │  const { metrics } = useDashboard() │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  useDashboardData Hook                   │
        │  ↓                                       │
        │  await getDashboardMetrics()             │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  dashboard-service.ts                    │
        │  ↓                                       │
        │  apiClient.get('/api/dashboard/metrics') │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  api-client.ts (Interceptors)            │
        │  ↓ Injects auth token                    │
        │  ↓ Handles errors                        │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │         Backend API Server               │
        │  GET /api/dashboard/metrics              │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Returns DashboardMetrics JSON           │
        │  {                                       │
        │    todayCardsDue: 5,                     │
        │    currentStreak: 12,                    │
        │    basketMastery: [{...}, {...}],        │
        │    weakSpots: [{...}, {...}],            │
        │    heatmapData: [{...}, {...}]           │
        │  }                                       │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  api-client.ts Response Interceptor      │
        │  ↓ Validates response                    │
        │  ↓ Returns data                          │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  useDashboardData Hook                   │
        │  ↓ Sets metrics in useState              │
        │  ↓ Returns { metrics, loading, error }   │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Dashboard Route page.tsx                │
        │  ↓ Renders components                    │
        │  ✓ PulseCard ({ cardsCount: 5 })         │
        │  ✓ StreakCard ({ streak: 12 })           │
        │  ✓ MasteryRings ({ data: [...] })        │
        │  ✓ WeakSpots ({ nodes: [...] })          │
        │  ✓ StudyHeatmap ({ data: [...] })        │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Components Render to HTML               │
        │  ↓ Import ui/ components (Button, Card)  │
        │  ↓ Use Tailwind classes                  │
        │  ↓ Apply theme colors from Design.md    │
        └──────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │         ✅ BROWSER DISPLAYS               │
        │                                          │
        │   [Dashboard Page with all metrics]      │
        └──────────────────────────────────────────┘
```

---

## 🏗️ Dependency Graph

```
Route (Thin)
    ├── Imports: Components, Hooks
    └── Uses: Tailwind, Design system

Hook (Data Logic)
    ├── Calls: Services
    ├── Reads: Zustand stores
    └── Returns: Data + loading + error

Service (API)
    ├── Calls: apiClient
    ├── Param: Feature-specific service
    └── Return: Typed data

Store (State)
    ├── Holds: Global state
    ├── Method: create() from Zustand
    └── Access: useStore() hook

Component (UI)
    ├── Props: Data from hook/store
    ├── Imports: ui/ and lib/ components
    └── Renders: JSX with Tailwind
```

---

## 🎯 File Purpose Matrix

| File | Purpose | Example |
|------|---------|---------|
| `src/app/(feature)/page.tsx` | Route entry point | `/dashboard` route |
| `src/features/[feat]/components/` | Feature UI | `PulseCard.tsx` |
| `src/features/[feat]/hooks/` | Feature logic | `useDashboardData.ts` |
| `src/features/[feat]/types/` | Feature types | `DashboardMetrics` type |
| `src/features/[feat]/utils/` | Feature helpers | `calculateMastery()` |
| `src/components/ui/` | Base UI blocks | Button, Card, Dialog |
| `src/components/layout/` | Page wrappers | Sidebar, Header |
| `src/components/common/` | Generic utilities | ThemeToggle, LoadingSpinner |
| `src/stores/` | Global state | `use-theme-store.ts` |
| `src/services/` | API calls | `dashboard-service.ts` |
| `src/hooks/` | Global logic | `useApi.ts` |
| `src/types/` | Shared types | `User`, `Card`, `Node` |
| `src/lib/` | Helpers | `cn()`, `formatDate()` |
| `src/styles/` | CSS | Variables, animations, theme |
| `src/config/` | Constants | Site metadata, feature flags |

---

## 🚀 Common Tasks & Files

| Task | File | Command |
|------|------|---------|
| Add dark mode toggle | `src/components/common/theme-toggle.tsx` | Uses `use-theme-store.ts` |
| Create dashboard page | `src/app/(dashboard)/page.tsx` | Imports `dashboard` feature |
| Add dashboard metric | `src/features/dashboard/components/` | Create new component |
| Fetch from API | `src/services/[feat]-service.ts` | Uses `api-client.ts` |
| Global state | `src/stores/use-[feat]-store.ts` | Zustand create() |
| Page layout | `src/app/(route)/layout.tsx` | Imports `layout/` components |
| Authentication | `src/stores/use-auth-store.ts` | Token + user |
| Form validation | `src/lib/validators.ts` | Import in forms |

---

## 📊 Statistics

```
Total Directories Created: 25+
├── Route groups: 3 (dashboard, study, auth)
├── Features: 4 (dashboard, study, auth, playlist)
├── Feature subfolders: 12 (4 features × 3 folders)
├── Component categories: 3 (ui, layout, common)
├── Utility folders: 6 (stores, hooks, types, services, lib, styles)
├── Config folders: 1

Perfect for scaling:
├── 1-10 developers: Feature-based organization
├── 10-50 developers: Team per feature possible
├── 50+ developers: Multi-team with clear boundaries
```

---

## ✨ Key Highlights

```
✅ Production-Ready Structure
✅ TypeScript Strict Mode
✅ Zustand State Management
✅ Feature-Based Organization
✅ Clear Separation of Concerns
✅ Scalable to 100+ developers
✅ Easy Code Navigation
✅ Testable & Maintainable
✅ Following Next.js Best Practices
✅ Design System Integration (Tailwind + shadcn/ui)
```

---

Generated: January 2025  
Version: 1.0 (Production)  
Architecture: Feature-Based | Tech: Next.js 16 + Zustand + Tailwind

