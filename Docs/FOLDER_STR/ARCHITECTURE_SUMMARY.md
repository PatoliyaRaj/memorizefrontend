# Frontend Architecture Summary

## 🎯 Design Philosophy

The Memorize frontend uses a **feature-based architecture** that:
- ✅ **Scales with teams** - Easy to add features without touching existing code
- ✅ **Keeps code organized** - All feature code in one place (components, hooks, types)
- ✅ **Enables isolation** - Features are independent; one feature's changes don't break others
- ✅ **Supports testing** - Clear boundaries make unit testing easier
- ✅ **Simplifies deletion** - To remove a feature, delete its folder

---

## 🏗️ Visual Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    MEMORIZE FRONTEND (Next.js)               │
└──────────────────────────────────────────────────────────────┘

                              Routes
                              /app
                    ┌─────────┴──────────┐
                    │                    │
            ┌──────▼─────┐      ┌───────▼────────┐
            │ Dashboard  │      │    Study       │
            │ /dashboard │      │   /study/[id]  │
            └──────┬─────┘      └───────┬────────┘
                   │                    │
                   ▼                    ▼
        ┌───────────────────────────────────────┐
        │   Features (Business Logic & UI)      │
        │  ┌─────────────┐  ┌──────────────┐   │
        │  │ dashboard/  │  │   study/     │   │
        │  │ ├─component │  │ ├─component  │   │
        │  │ ├─hooks     │  │ ├─hooks      │   │
        │  │ ├─types     │  │ ├─types      │   │
        │  │ └─utils     │  │ └─utils      │   │
        │  └─────────────┘  └──────────────┘   │
        └───────────────────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌────────────┐
│ Stores  │  │ Services │  │  Hooks     │
│ (State) │  │ (API)    │  │ (Logic)    │
└─────────┘  └──────────┘  └────────────┘
    │              │              │
    │              ▼              │
    │        Backend API         │
    │              │             │
    └──────────────┴─────────────┘
```

---

## 📂 Folder Structure Explained

### **Layer 1: Routes (`src/app/`)**
- Entry points for every URL in the app
- Should be **thin** - only import components and call hooks
- No business logic here

```typescript
// src/app/(dashboard)/page.tsx
const { data } = useDashboardData()  // ✅ OK - import hook
return <Dashboard data={data} />     // ✅ OK - import component

// ❌ DON'T DO THIS:
const data = await fetch(...)        // ❌ Bad - fetch here
const metrics = calculate(...)       // ❌ Bad - logic here
```

### **Layer 2: Features (`src/features/*/`)**
- Self-contained modules for each major feature
- Contains: components, hooks, types, utils
- Example features: dashboard, study, auth, playlist

**Why?** Everything related to "dashboard" is together. Makes it easy to:
- Find code (it's all in one place)
- Test (clear boundaries)
- Reuse (import what you need)
- Delete (remove the folder)

```
src/features/dashboard/
├── components/       # Dashboard-only UI
├── hooks/           # Dashboard-only logic
├── types/           # Dashboard-only types
└── utils/           # Dashboard-only helpers
```

### **Layer 3: Shared Infrastructure**

#### **Global Hooks (`src/hooks/`)**
Hooks used by multiple features:
- `useApi.ts` - Generic API call hook
- `useAuth.ts` - Current user access
- `useTheme.ts` - Theme state access

#### **Global Types (`src/types/`)**
Shared TypeScript definitions:
- `models.ts` - Core entities (User, Card, Node, etc)
- `api.ts` - API request/response types

#### **Global Stores (`src/stores/`)**
Zustand state for multiple features:
- `use-auth-store.ts` - User session
- `use-theme-store.ts` - Dark/light mode
- `use-dashboard-store.ts` - Cached dashboard data

#### **Services (`src/services/`)**
API communication layer:
- `api-client.ts` - HTTP client setup
- `dashboard-service.ts` - Dashboard API calls
- `study-service.ts` - Study session API calls

#### **Utilities (`src/lib/`)**
General-purpose helpers:
- `utils.ts` - `cn()` for Tailwind, `formatDate()`, etc
- `constants.ts` - App-wide constants

### **Layer 4: UI Components (`src/components/`)**

Three subfolders:

**1. `ui/`** - Base components (auto-generated from shadcn)
```
Button, Card, Dialog, Input, Badge...
Tailwind + Radix UI primitives
```

**2. `layout/`** - Page wrappers
```
Sidebar, Header, Topbar, Footer
Appears on every page/route group
```

**3. `common/`** - Reusable utilities
```
ThemeToggle, LoadingSpinner, ErrorBoundary, EmptyState
Used in multiple places
```

---

## 🔄 Data Flow: How Everything Connects

### **Example: Dashboard Page**

```
1. User navigates to /dashboard
   ↓
2. Next.js routes to app/(dashboard)/page.tsx
   ↓
3. Route component calls useDashboardData hook
   const { metrics, isLoading } = useDashboardData()
   ↓
4. Hook calls getDashboardMetrics service
   const data = await getDashboardMetrics()
   ↓
5. Service makes API request via api-client
   GET /api/dashboard/metrics
   ↓
6. Backend responds with DashboardMetrics
   ↓
7. Hook stores data in useState, returns to route
   ↓
8. Route renders components: PulseCard, MasteryRings, etc
   ↓
9. Components import from @/components/ui (Button, Card)
   ↓
10. Browser displays dashboard to user
```

**Diagram:**
```
Route (thin)
    ↓
Hook (data fetching)
    ↓
Service (API calls)
    ↓
Backend
    ↓
Service (return data)
    ↓
Hook (manage state)
    ↓
Route (render components)
    ↓
UI Components (display)
```

---

## 🔧 Working with Features

### Add a feature component

```typescript
// 1. Create file in feature folder
// src/features/dashboard/components/new-widget.tsx

'use client'

export function NewWidget() {
  return <div>My new widget</div>
}
```

### Add feature-specific logic

```typescript
// 2. Create hook in feature folder
// src/features/dashboard/hooks/useNewWidget.ts

export function useNewWidget() {
  const [state, setState] = useState(null)
  
  useEffect(() => {
    // Fetch or calculate something
  }, [])
  
  return state
}
```

### Add feature types

```typescript
// 3. Create type in feature folder
// src/features/dashboard/types/index.ts

export type NewWidgetData = {
  id: string
  title: string
}
```

### Use in route

```typescript
// 4. Import in route
// src/app/(dashboard)/page.tsx

import { NewWidget } from '@/features/dashboard/components/new-widget'
import { useNewWidget } from '@/features/dashboard/hooks/useNewWidget'

export default function DashboardPage() {
  const data = useNewWidget()
  return <NewWidget />
}
```

---

## 🎨 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16+ | App Router, SSR, file-based routing |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Components** | shadcn/ui + Radix | Accessible UI primitives |
| **State** | Zustand | Global state management |
| **HTTP** | Axios | API client |
| **Animation** | Framer Motion | React animations |
| **Fonts** | Syne, DM Sans, JetBrains Mono | Typography |

---

## 🚀 Development Workflow

### Setting up a new feature

```bash
# 1. Create feature folder
mkdir -p src/features/my-feature/{components,hooks,types,utils}

# 2. Create component
# src/features/my-feature/components/index.ts

# 3. Create hook if needed
# src/features/my-feature/hooks/useMyFeature.ts

# 4. Add types
# src/features/my-feature/types/index.ts

# 5. Add route
# src/app/(my-route)/page.tsx

# 6. Test
npm run dev
# Visit http://localhost:3000
```

### Common tasks

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Test (if configured)
npm run test

# Build for production
npm run build
```

---

## 📊 File Count Reference

As of now:
- **Route files**: 3 (layout.tsx, page.tsx, and setup for groups)
- **Feature folders**: 4 (dashboard, study, auth, playlist)
- **Component folders**: 3 (ui, layout, common)
- **Utility folders**: 6 (stores, hooks, types, services, lib, styles)
- **Config files**: 5 (site-config.ts, feature-flags.ts, etc)

Total: **25+ directories** creating a production-ready structure.

---

## 🎓 Learning Resources

1. **Folder Structure Guide** → Read `FOLDER_STRUCTURE.md`
2. **Quick Reference** → See `QUICK_REFERENCE.md`
3. **Pattern Examples** → Check `ARCHITECTURE_PATTERNS.md`
4. **Component Guidelines** → Review `src/components/README.md`
5. **Feature Example** → Study `src/features/dashboard/README.md`

---

## ✨ Key Takeaways

| Concept | Key Point |
|---------|-----------|
| **Routes** | Thin entry points - import & render, don't code |
| **Features** | Self-contained folders with components, hooks, types |
| **Shared Code** | Hooks, types, services in `src/` folders |
| **Data Flow** | Route → Hook → Service → Backend → Service → Hook → Components |
| **Naming** | `use*` for hooks, `PascalCase` for components, `camelCase` for files |
| **Imports** | Always use `@/` alias, never `../../../` |
| **State** | Zustand for global, useState for local |
| **Types** | Shared in `src/types/`, feature-specific in `src/features/[feat]/types/` |

---

## 🔗 File Navigator

Quick links to key files:

- **Route configuration**: `src/app/(dashboard)/layout.tsx`
- **Theme state**: `src/stores/use-theme-store.ts`
- **API setup**: `src/services/api-client.ts`
- **Shared types**: `src/types/models.ts`
- **Utilities**: `src/lib/utils.ts`
- **Components**: `src/components/ui/button.tsx`
- **Dashboard**: `src/features/dashboard/README.md`
- **Site config**: `src/config/site-config.ts`

---

## 🎯 Next Steps

1. ✅ Folder structure created
2. ✅ Documentation written
3. ⏳ Populate route files (create dashboard, study, auth layouts)
4. ⏳ Create feature-specific pages
5. ⏳ Wire up API calls to backend

