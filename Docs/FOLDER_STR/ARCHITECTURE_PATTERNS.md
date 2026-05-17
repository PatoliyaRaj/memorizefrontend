# Architecture Patterns

Common patterns and best practices for the Memorize frontend.

## Pattern 1: Custom Hook with Service

**Use Case:** Fetch data from the backend and manage loading/error states

```typescript
// src/features/study/hooks/useStudySession.ts
'use client'

import { useEffect, useState } from 'react'
import { getStudySession } from '@/services/study-service'
import type { StudySession } from '@/types'

export function useStudySession(sessionId: string) {
  const [session, setSession] = useState<StudySession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getStudySession(sessionId)
        setSession(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  return { session, isLoading, error }
}
```

**Usage:**
```typescript
// In a route or component
const { session, isLoading } = useStudySession('session-123')

if (isLoading) return <LoadingSpinner />
return <StudyCard card={session.currentCard} />
```

## Pattern 2: Component with Zustand Store

**Use Case:** Read/write global state in a component

```typescript
// src/components/common/theme-toggle.tsx
'use client'

import { useThemeStore } from '@/stores/use-theme-store'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </Button>
  )
}
```

**Usage:**
```typescript
// In any component
import { useThemeStore } from '@/stores/use-theme-store'

export function MyComponent() {
  const theme = useThemeStore((state) => state.theme)
  
  return <div className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
