# Dashboard Feature

The dashboard (or "Pulse") is the main page users see after login. It shows:
- Cards due today
- Study streak
- Sleep quality
- Mastery progress by subject
- Weak spots (struggling nodes)
- Study activity heatmap

## Structure

```
src/features/dashboard/
├── components/          # Dashboard-specific UI
│   ├── pulse-card.tsx          # Single card due
│   ├── streak-card.tsx         # Current streak display
│   ├── sleep-quality.tsx       # Sleep status icon
│   ├── weak-spots.tsx          # List of weak nodes
│   ├── mastery-rings.tsx       # Mastery % by subject
│   └── study-heatmap.tsx       # GitHub-style activity
│
├── hooks/              # Dashboard-specific logic
│   ├── useDashboardData.ts    # Fetch dashboard metrics
│   └── usePulseQueue.ts       # Calculate cards due
│
├── types/              # Dashboard-specific types
│   └── index.ts               # DashboardMetrics, etc
│
└── utils/              # Dashboard-specific utilities
    └── calculate-mastery.ts   # Mastery percentage logic
```

## How It Works

### 1. Route Entry Point
```typescript
// src/app/(dashboard)/page.tsx
'use client'

import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'
import { PulseCard } from '@/features/dashboard/components/pulse-card'
import { StreakCard } from '@/features/dashboard/components/streak-card'
import { MasteryRings } from '@/features/dashboard/components/mastery-rings'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export default function DashboardPage() {
  const { metrics, isLoading, error } = useDashboardData()

  if (isLoading) return <LoadingSpinner />
  if (error) return <div>Error loading dashboard</div>
  if (!metrics) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pulse</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <PulseCard cardsCount={metrics.todayCardsDue} />
        <StreakCard streak={metrics.currentStreak} />
      </div>

      <MasteryRings data={metrics.basketMastery} />
      <WeakSpots nodes={metrics.weakSpots} />
      <StudyHeatmap data={metrics.heatmapData} />
    </div>
  )
}
```

### 2. Data Fetching
```typescript
// src/features/dashboard/hooks/useDashboardData.ts
export function useDashboardData() {
  const user = useAuthStore((state) => state.user)
  
  useEffect(() => {
    if (!user) return
    
    const data = await getDashboardMetrics() // from services
    setMetrics(data)
  }, [user])
  
  return { metrics, isLoading, error }
}
```

### 3. Service Layer
```typescript
// src/services/dashboard-service.ts
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data } = await apiClient.get('/api/dashboard/metrics')
  return data
}
```

### 4. Component Rendering
```typescript
// src/features/dashboard/components/pulse-card.tsx
export function PulseCard({ cardsCount }: { cardsCount: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cards Due Today</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{cardsCount}</div>
      </CardContent>
    </Card>
  )
}
```

## Data Flow Diagram

```
Page Load (app/(dashboard)/page.tsx)
    ↓
useDashboardData Hook
    ↓
getDashboardMetrics Service
    ↓
Backend API (/api/dashboard/metrics)
    ↓
Return DashboardMetrics Type
    ↓
Dashboard Components (PulseCard, MasteryRings, etc)
    ↓
Render to User
```

## Extending the Dashboard

### Add a new metric:

1. **Update the backend** to include new field in `/api/dashboard/metrics`

2. **Update the type**:
```typescript
// src/features/dashboard/types/index.ts
export type DashboardMetrics = {
  // ... existing
  newMetric: NewMetricType
}
```

3. **Create new component**:
```typescript
// src/features/dashboard/components/new-metric.tsx
export function NewMetric({ data }: { data: NewMetricType }) {
  return <Card>{/* render new metric */}</Card>
}
```

4. **Use in route**:
```typescript
// src/app/(dashboard)/page.tsx
<NewMetric data={metrics.newMetric} />
```

## Testing

```typescript
// src/features/dashboard/hooks/__tests__/useDashboardData.test.ts
import { renderHook } from '@testing-library/react'
import { useDashboardData } from '../useDashboardData'

describe('useDashboardData', () => {
  it('fetches dashboard metrics', async () => {
    const { result } = renderHook(() => useDashboardData())
    
    // Assert
    expect(result.current.isLoading).toBe(false)
    expect(result.current.metrics).toBeDefined()
  })
})
```

## Dependencies

- `useDashboardData` depends on:
  - `useAuthStore` from `@/stores/use-auth-store`
  - `getDashboardMetrics` from `@/services/dashboard-service`

- Dashboard components depend on:
  - Base `ui/` components (Button, Card, etc)
  - Dashboard types from `@/features/dashboard/types`
