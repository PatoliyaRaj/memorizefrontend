# NeuroLearn Frontend — Theming & Components Guide

## Overview

This guide covers:
- ✅ **CSS Variables & Theming** — Dynamic color system following Design.md
- ✅ **Form Components** — Built with react-hook-form + Zod validation
- ✅ **Toast Notifications** — Via Sonner library
- ✅ **Component Usage** — Examples and best practices

---

## 1. CSS Variables & Dynamic Theming

### Architecture

All colors and styles use CSS variables defined in [globals.css](./app/globals.css). When you change a variable, it updates everywhere automatically.

**Example:** To change the brand color globally, update one variable:

```css
/* In globals.css */
:root {
  --brand-600: #0D9488;  /* Change this, theme updates everywhere */
}
```

### Color System

#### Light Mode (`:root`)
- **Surfaces:** `--surface-void`, `--surface-base`, `--surface-raised`, `--surface-overlay`
- **Text:** `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-disabled`, `--text-brand`
- **Borders:** `--border-subtle`, `--border-default`, `--border-strong`, `--border-brand`
- **Brand Palette:** `--brand-50` through `--brand-900`

#### Dark Mode (`.dark`)
Automatically applied with the dark class. All colors adapt with teal-tinted dark surfaces.

```html
<!-- Dark mode is default -->
<html lang="en" class="dark">
```

### Using CSS Variables in Components

```tsx
// ✅ DO: Use CSS variables
<div className="bg-surface-base text-text-primary border border-border-default">
  Content
</div>

// ❌ DON'T: Hardcode colors
<div className="bg-white text-black border border-gray-300">
  Content
</div>
```

### Utility Classes

Pre-built utility classes for common patterns:

```tsx
// Text colors
<p className="text-primary">Primary text</p>
<p className="text-secondary">Secondary text</p>
<p className="text-brand">Brand text (links)</p>

// Backgrounds
<div className="bg-base">Card background</div>
<div className="bg-raised">Raised element</div>

// Borders
<div className="border border-default">Standard border</div>
<div className="border border-brand">Brand border</div>

// Shadows
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
```

---

## 2. Theme Provider & Hook

### Setup

The `ThemeProvider` is already in `layout.tsx`. It manages theme state and localStorage persistence.

### Using the useTheme Hook

```tsx
'use client';

import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### Theme Hook API

```tsx
const { 
  theme,        // 'light' | 'dark'
  toggleTheme,  // () => void
  setTheme      // (theme: 'light' | 'dark') => void
} = useTheme();
```

---

## 3. Form Components

### Component Set

1. **Form** — Wrapper that provides react-hook-form context
2. **FormField** — Controller wrapper with label, error display
3. **Input** — Text input with variants
4. **Textarea** — Multiline text input
5. **Button** — Interactive button with loading state
6. **FormElements** — Label, Error, Message, Group components

### Basic Form Example

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, Input, Button } from '@/components/form';
import { loginSchema } from '@/lib/validations/schemas';
import { toastSuccess, toastError } from '@/lib/toast';

export function LoginForm() {
  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data) {
    try {
      // API call
      toastSuccess('Login successful!');
    } catch (error) {
      toastError('Login failed');
    }
  }

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <FormField
        control={methods.control}
        name="email"
        label="Email"
        required
        render={({ field }) => (
          <Input 
            {...field} 
            type="email"
            placeholder="your@email.com"
          />
        )}
      />

      <FormField
        control={methods.control}
        name="password"
        label="Password"
        required
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            placeholder="••••••••"
          />
        )}
      />

      <Button type="submit" variant="primary">
        Sign In
      </Button>
    </Form>
  );
}
```

### Input Component

**Props:**
```tsx
<Input
  variant="default"  // 'default' | 'filled' | 'flushed'
  size="md"          // 'sm' | 'md' | 'lg'
  error={false}      // Shows error state
  disabled={false}   // Disabled state
  icon={<Icon />}    // Optional leading icon
  placeholder="..."
/>
```

### Textarea Component

```tsx
<Textarea
  variant="default"
  maxLength={500}
  showCharCount={true}
  helperText="Write a detailed description"
/>
```

### Button Component

**Variants:**
- `primary` — Brand-colored button (primary action)
- `secondary` — Neutral button (secondary action)
- `ghost` — Transparent button (tertiary action)
- `danger` — Red button (destructive action)

**Sizes:**
- `sm` — Small button
- `md` — Medium button (default)
- `lg` — Large button

```tsx
<Button variant="primary" size="md" isLoading={isSubmitting}>
  Submit
</Button>

<Button variant="danger">Delete</Button>

<Button variant="ghost">Cancel</Button>
```

---

## 4. Form Validation with Zod

### Pre-built Schemas

Import from `@/lib/validations/schemas`:

```tsx
import {
  loginSchema,
  registerSchema,
  profileSchema,
  createBucketSchema,
  createCardSchema,
} from '@/lib/validations/schemas';

// Use with react-hook-form
const methods = useForm({
  resolver: zodResolver(loginSchema),
});
```

### Custom Validation Schema

```tsx
import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/lib/validations/schemas';

const mySchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to terms'
  }),
});

type MyFormData = z.infer<typeof mySchema>;
```

### Validate Form Data Programmatically

```tsx
import { validateFormData } from '@/lib/validations/schemas';

const result = await validateFormData(mySchema, formData);

if (result.success) {
  console.log(result.data);  // Typed data
} else {
  console.log(result.errors);  // Record<string, string>
}
```

---

## 5. Toast Notifications

### Setup

Toast is already configured in `layout.tsx` with:
- Dark theme by default
- Top-right position
- Auto-dismiss after specified duration
- Max 5 visible toasts

### Usage

```tsx
import { 
  toastSuccess, 
  toastError, 
  toastWarning, 
  toastInfo,
  toastPromise 
} from '@/lib/toast';

// Simple toast
toastSuccess('Profile updated!');

// With description
toastError('Login failed', {
  description: 'Invalid email or password',
});

// With action
toastWarning('Unsaved changes', {
  action: {
    label: 'Save',
    onClick: () => handleSave(),
  },
});

// Promise-based (for async operations)
toastPromise(
  saveProfile(),
  {
    loading: 'Saving profile...',
    success: 'Profile saved!',
    error: 'Failed to save profile',
  }
);
```

### Toast API

```tsx
interface ToastOptions {
  duration?: number;              // ms, default: 3000
  description?: string;           // Secondary text
  action?: {                      // Action button
    label: string;
    onClick: () => void;
  };
  closeButton?: boolean;          // Show close button
}
```

---

## 6. Typography

All fonts are loaded in `layout.tsx`:

- **Display (Headings):** Syne (700, 600 weight)
- **Body (UI, text):** DM Sans (400, 500, 600 weight)
- **Monospace (Code, data):** JetBrains Mono (400, 500 weight)

### Using Fonts in Components

```tsx
// Display heading
<h1 className="heading-display">My Title</h1>

// OR manual
<h1 style={{ fontFamily: 'var(--font-display)' }}>My Title</h1>

// Body text (default)
<p>This uses DM Sans automatically</p>

// Monospace data
<code style={{ fontFamily: 'var(--font-mono)' }}>
  {userId}
</code>
```

### Type Scale

All defined in CSS variables:

```css
--text-xs: 0.75rem;    /* 12px - timestamps */
--text-sm: 0.875rem;   /* 14px - labels */
--text-base: 1rem;     /* 16px - body text */
--text-lg: 1.125rem;   /* 18px - card content */
--text-xl: 1.25rem;    /* 20px - section headings */
--text-2xl: 1.5rem;    /* 24px - page titles */
```

---

## 7. Best Practices

### ✅ DO

1. **Use CSS variables** for all colors
2. **Use utility classes** for common patterns
3. **Validate with Zod schemas** before submission
4. **Show loading states** in buttons during submission
5. **Use toasts** for feedback (not alerts)
6. **Follow Design.md** for color usage

### ❌ DON'T

1. Hardcode hex colors (`#FFFFFF`, `#000000`)
2. Use generic fonts (use Syne, DM Sans, JetBrains Mono)
3. Forget to handle errors in forms
4. Show multiple consecutive toasts (batch them)
5. Break the dark-first design
6. Use pure black/white (use teal-tinted surfaces)

---

## 8. Component Files Structure

```
components/
├── form/
│   ├── Form.tsx           # Form wrapper
│   ├── FormField.tsx      # Field controller
│   ├── FormElements.tsx   # Label, Error, Message, Group
│   ├── Input.tsx          # Text input
│   ├── Textarea.tsx       # Multiline input
│   ├── Button.tsx         # Button variants
│   └── index.ts           # Barrel export
├── providers/
│   └── ThemeProvider.tsx  # Theme provider + context
└── examples/
    └── LoginForm.tsx      # Example form
```

---

## 9. Troubleshooting

### Colors Not Changing?
1. Check that you're using CSS variable names (e.g., `bg-surface-base`)
2. Verify the `.dark` class is on `<html>` element
3. Clear browser cache
4. Check DevTools for CSS variable values

### Form Not Validating?
1. Ensure `resolver: zodResolver(schema)` is passed to `useForm`
2. Check field names match schema keys
3. Use `control={methods.control}` in `FormField`

### Toast Not Showing?
1. Verify `<Toaster />` is in `layout.tsx`
2. Ensure component is wrapped in `<ThemeProvider>`
3. Check browser console for errors

---

## 10. Next Steps

1. ✅ All form components are ready to use
2. ✅ CSS variables are following Design.md exactly
3. ✅ Toast notifications are configured
4. ✅ Theme switching is available

**Now you can:**
- Build forms with auto-validation
- Get real-time error feedback
- Show success/error notifications
- Switch themes dynamically
- Everything updates with one CSS variable change

See [Design.md](./Docs/Design.md) for the complete design philosophy.
