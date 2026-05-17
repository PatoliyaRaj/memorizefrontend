# Frontend Folder Structure - Quick Reference

## 📁 Where Does It Go?

### 🎨 UI Components (Buttons, Cards, Dialogs)
**→ `src/components/ui/`**

```
Button component, Input, Card, Dialog, Badge...
These are shadcn/ui imports. Auto-generated.
```

### 🧩 Layout Wrappers (Header, Sidebar, Topbar)
**→ `src/components/layout/`**

```
Sidebar.tsx, Header.tsx, Topbar.tsx, Footer.tsx
Wraps route pages. Controls page layout structure.
```

### ⚙️ Tiny Reusable Components (ThemeToggle, Loading Spinner)
**→ `src/components/common/`**

```
ThemeToggle.tsx, LoadingSpinner.tsx, EmptyState.tsx
Used in multiple places across the app.
```

### 📊 Feature-Specific Components (only used in one feature)
**→ `src/features/[feature]/components/`**

```
src/features/dashboard/components/pulse-card.tsx
src/features/study/components/confidence-selector.tsx
src/features/playlist/components/node-element.tsx
```

### 🪝 Global Custom Hooks (used in multiple features)
**→ `src/hooks/`**

```
useApi.ts, useAuth.ts, useTheme.ts, useLocalStorage.ts
Shared logic across multiple features.
```

### 🪝 Feature-Specific Hooks
**→ `src/features/[feature]/hooks/`**

```
src/features/dashboard/hooks/useDashboardData.ts
src/features/study/hooks/useStudySession.ts
```

### 📘 Global TypeScript Types
**→ `src/types/`**

```
models.ts (User, Card, Node, Basket types)
api.ts (API request/response types)
Shared across multiple features.
```

### 📘 Feature-Specific Types
**→ `src/features/[feature]/types/`**

```
src/features/dashboard/types/index.ts
DashboardMetrics, BasketMasteryRing types
Used only within the feature.
```

### 🌐 Global State (Zustand Stores)
**→ `src/stores/`**

```
use-theme-store.ts - Dark/light mode
use-auth-store.ts - User session
use-dashboard-store.ts - Dashboard cache
Accessed by multiple features.
```

### 🔌 API Service Layer
**→ `src/services/`**

```
api-client.ts - HTTP client setup
dashboard-service.ts - Dashboard API calls
study-service.ts - Study API calls
auth-service.ts - Login/signup API calls
```

### 🛠 Utility Functions
**→ `src/lib/`**

```
utils.ts - cn(), formatDate(), etc
constants.ts - App-wide constants
validators.ts - Form validation rules
api.ts - API config
```

### 🎨 Global Styles
**→ `src/styles/`**

```
variables.css - CSS custom properties
animations.css - Reusable animations
theme.css - Dark/light mode CSS
```

### ⚙️ Configuration
**→ `src/config/`**

```
site-config.ts - Site metadata, navigation
feature-flags.ts - Feature toggles
```

### 🖼️ Static Assets
**→ `public/`**

```
public/images/
public/icons/
public/fonts/
Images, icons, fonts that don't bundle.
```

### 📄 Routes / Pages
**→ `src/app/`**

```
app/layout.tsx - Root layout
app/page.tsx - Home page
app/(dashboard)/page.tsx - Dashboard route
app/(study)/[id]/page.tsx - Study session route
app/(auth)/login/page.tsx - Login route

Routes should be THIN - import components, don't define logic.
```

---

## ✅ Checklist: "Where should I put this?"

| What are you building? | Where does it go? |
|---|---|
| A button component used everywhere | `src/components/ui/` (via shadcn) |
| A sidebar that wraps all pages | `src/components/layout/` |
| A loading spinner used in many places | `src/components/common/` |
| A card component only for dashboard | `src/features/dashboard/components/` |
| A hook that fetches dashboard data | `src/features/dashboard/hooks/` |
| A hook used by multiple features | `src/hooks/` |
| TypeScript type for User, Card | `src/types/models.ts` |
| TypeScript type only for dashboard | `src/features/dashboard/types/` |
| A function to calculate mastery % | `src/features/dashboard/utils/` |
| A function used everywhere (cn, format) | `src/lib/utils.ts` |
| API calls to fetch dashboard data | `src/services/dashboard-service.ts` |
| Global dark/light mode state | `src/stores/use-theme-store.ts` |
| Dashboard page route | `src/app/(dashboard)/page.tsx` |
| Study session page route | `src/app/(study)/[id]/page.tsx` |
| Login page route | `src/app/(auth)/login/page.tsx` |
| Logo image | `public/images/logo.svg` |
| CSS variables for colors | `src/styles/variables.css` |
| Site name, navigation config | `src/config/site-config.ts` |

---

## 🔄 Data Flow Example: Dashboard Feature

```
Route: /dashboard
    ↓
app/(dashboard)/page.tsx (thin entry point)
    ↓
imports useDashboardData hook
    ↓
src/features/dashboard/hooks/useDashboardData.ts
    ↓
calls getDashboardMetrics service
    ↓
src/services/dashboard-service.ts
    ↓
makes GET /api/dashboard/metrics call
    ↓
Backend API
    ↓
returns DashboardMetrics (src/features/dashboard/types/index.ts)
    ↓
Dashboard page renders components:
  - PulseCard (src/features/dashboard/components/pulse-card.tsx)
  - StreakCard (src/features/dashboard/components/streak-card.tsx)
  - MasteryRings (src/features/dashboard/components/mastery-rings.tsx)
    ↓
Browser displays dashboard
```

---

## 🚀 Quick Commands

```bash
# See the full structure
tree src/ --dirsfirst

# List all hooks
find src -name "*use*.ts" | grep -v node_modules

# List all types
find src/types -name "*.ts"

# Find a component
find src/components -name "*button*"

# Find feature code
find src/features/dashboard -type f
```

---

## 📋 Common File Templates

### New Custom Hook
```
File: src/hooks/useFetch.ts
Pattern: export function useFetch(url: string) { ... }
Dependencies: React hooks (useState, useEffect)
Usage: const { data, loading } = useFetch('/api/data')
```

### New Feature Component
```
File: src/features/[feature]/components/ComponentName.tsx
Pattern: export function ComponentName(props) { ... }
Dependencies: Base ui/ components, types, utils from feature
Usage: <ComponentName {...props} />
```

### New Service
```
File: src/services/[feature]-service.ts
Pattern: export async function getEntity(...) { ... }
Dependencies: apiClient from src/services/api-client.ts
Usage: const data = await getEntity(id)
```

### New Store
```
File: src/stores/use-[feature]-store.ts
Pattern: export const use[Feature]Store = create<State>((set) => ({ ... }))
Dependencies: zustand
Usage: const state = use[Feature]Store()
```

---

## ⚡ Pro Tips

1. **Barrel Exports** - Create `index.ts` in folders to export all files:
   ```typescript
   // src/features/dashboard/hooks/index.ts
   export { useDashboardData } from './useDashboardData'
   export { usePulseQueue } from './usePulseQueue'
   
   // Usage: import { useDashboardData } from '@/features/dashboard/hooks'
   ```

2. **Path Aliases** - All imports use `@/` prefix:
   ```typescript
   // ✅ Good
   import { Button } from '@/components/ui/button'
   
   // ❌ Bad
   import { Button } from '../../../../components/ui/button'
   ```

3. **Feature Independence** - Features should not import from each other:
   ```typescript
   // ✅ Good (dashboard imports shared service)
   import { useAuthStore } from '@/stores/use-auth-store'
   
   // ❌ Bad (dashboard importing from study)
   import { useStudySession } from '@/features/study/hooks'
   ```

4. **Type Safety** - Always export types, not implementation details:
   ```typescript
   // src/types/models.ts
   export type User = { id: string; name: string }
   
   // Usage across app
   import type { User } from '@/types'
   ```

---

## 🎓 When in Doubt

Ask yourself:
1. **Is this a route?** → `src/app/`
2. **Is this used in multiple features?** → `src/` (global folder)
3. **Is this only for one feature?** → `src/features/[feature]/`
4. **Is this a building block UI?** → `src/components/`
5. **Is this business logic?** → `src/services/`, `src/hooks/`, or `src/stores/`

