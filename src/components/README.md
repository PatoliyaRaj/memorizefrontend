# Components

This folder contains reusable UI components used across multiple features and pages.

## Structure

### `ui/` - Base Components
Auto-generated shadcn/ui components (button, card, dialog, input, etc). These are primitives.

```typescript
// ✅ Use base components for building blocks
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  )
}
```

### `layout/` - Layout Components
Navigation and page structure components (Sidebar, Header, Topbar, Footer).

Used in `app/layout.tsx` and route group layouts.

```typescript
// src/app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Topbar />
        {children}
      </main>
    </div>
  )
}
```

### `common/` - Generic Utility Components
Small, highly reusable components (ThemeToggle, LoadingSpinner, ErrorBoundary, EmptyState).

Used everywhere across features.

```typescript
// ✅ Reusable in any component
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { ThemeToggle } from '@/components/common/theme-toggle'

export function MyFeature() {
  const { data, isLoading } = useData()
  
  return (
    <>
      <ThemeToggle />
      {isLoading && <LoadingSpinner />}
      {data && <div>{data}</div>}
    </>
  )
}
```

## Guidelines

### ✅ Create Components Here If:
1. Used in multiple features (appears in dashboard, study, and auth)
2. A layout wrapper (Header, Sidebar, Footer)
3. A generic utility (ThemeToggle, ErrorBoundary, EmptyState)

### ❌ Create Components Here If NOT:
1. Only used in one feature → Put it in `features/[feature]/components/`
2. Complex feature logic → Belongs in feature folder

## Example: Adding a New Component

```typescript
// src/components/common/confirm-dialog.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'

type ConfirmDialogProps = {
  title: string
  description?: string
  onConfirm: () => void
  onCancel?: () => void
  children: React.ReactNode
}

export function ConfirmDialog({
  title,
  description,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsOpen(false); onCancel?.() }}>
              Cancel
            </Button>
            <Button onClick={() => { setIsOpen(false); onConfirm() }}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

Then use it anywhere:

```typescript
import { ConfirmDialog } from '@/components/common/confirm-dialog'

export function DeleteUserButton() {
  return (
    <ConfirmDialog
      title="Delete Account?"
      description="This cannot be undone."
      onConfirm={() => deleteAccount()}
    >
      <Button variant="destructive">Delete</Button>
    </ConfirmDialog>
  )
}
```

## Import Patterns

```typescript
// ✅ Good - Clear imports
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/sidebar'
import { LoadingSpinner } from '@/components/common/loading-spinner'

// ❌ Bad - Reaching into feature folders
import { PulseCard } from '@/components/features/dashboard/pulse-card'
// This should be in src/features/dashboard/components/
```

## Component Naming

- Use **PascalCase** for component files: `PulseCard.tsx`, `ThemeToggle.tsx`
- Use **kebab-case** for folder names: `loading-spinner/`, `theme-toggle.tsx`

## Typography

Use Tailwind typography utilities with custom font stack:

```typescript
// Syne (display, headings)
<h1 className="font-display text-4xl font-bold">

// DM Sans (body, UI)
<p className="font-sans text-base">

// JetBrains Mono (code, data)
<code className="font-mono text-sm">
```

From `globals.css`:
```css
@layer base {
  :root {
    --font-display: 'Syne', system-ui;
    --font-sans: 'DM Sans', system-ui;
    --font-mono: 'JetBrains Mono', monospace;
  }
}
```
