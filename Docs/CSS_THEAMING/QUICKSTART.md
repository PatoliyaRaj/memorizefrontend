# Quick Start — Forms, Theming & Toasts

## 30-Second Setup

Everything is ready! No additional setup needed. Just import and use.

---

## Quick Reference

### 1. Simple Form
```tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, Input, Button } from '@/components/form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
});

export function MyForm() {
  const methods = useForm({ resolver: zodResolver(schema) });

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <FormField
        control={methods.control}
        name="name"
        label="Name"
        render={({ field }) => <Input {...field} />}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### 2. Show Success/Error
```tsx
import { toastSuccess, toastError } from '@/lib/toast';

// Simple
toastSuccess('Done!');
toastError('Something went wrong');

// With details
toastSuccess('Profile updated!', {
  description: 'Your changes have been saved',
});

// With action button
toastWarning('Unsaved changes', {
  action: {
    label: 'Save',
    onClick: handleSave,
  },
});
```

### 3. Switch Theme
```tsx
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return <button onClick={toggleTheme}>Switch to {theme === 'dark' ? 'light' : 'dark'}</button>;
}
```

### 4. Validate Forms
```tsx
import { loginSchema } from '@/lib/validations/schemas';

// Use any pre-built schema
const methods = useForm({
  resolver: zodResolver(loginSchema),
});

// Or create custom
const mySchema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});
```

### 5. Use CSS Variables
```tsx
// In JSX
<div className="bg-surface-base text-text-primary border border-border-default">
  Content
</div>

// In CSS
.card {
  background: var(--surface-raised);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
}
```

---

## Component Cheat Sheet

### Form Components
```tsx
<Input />                    // Text input
<Textarea />                 // Multi-line
<Button />                   // Button
<FormField />                // Wrapper
<FormLabel />                // Label
<FormError />                // Error display
<FormGroup />                // Group fields
```

### Button Variants & Sizes
```tsx
<Button variant="primary">Primary</Button>     // Brand color
<Button variant="secondary">Secondary</Button> // Neutral
<Button variant="ghost">Ghost</Button>         // Transparent
<Button variant="danger">Danger</Button>       // Red

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Input Variants
```tsx
<Input variant="default" />   // Border
<Input variant="filled" />    // Filled background
<Input variant="flushed" />   // Bottom border only

<Input size="sm" />
<Input size="md" />
<Input size="lg" />
```

### Toast Functions
```tsx
toastSuccess(message, options)
toastError(message, options)
toastWarning(message, options)
toastInfo(message, options)
toastPromise(promise, messages)
dismissAllToasts()
```

### Toast Options
```tsx
{
  duration: 3000,              // ms
  description: 'Extra info',   // Secondary text
  action: {                    // Action button
    label: 'Undo',
    onClick: () => {}
  },
  closeButton: true            // Show close button
}
```

---

## Validation Schemas

### Pre-built
```tsx
import {
  loginSchema,           // Email + password
  registerSchema,        // Registration
  profileSchema,         // Profile update
  passwordChangeSchema,  // Password change
  createBucketSchema,    // Bucket creation
  createCardSchema,      // Card creation
  emailSchema,           // Email only
  passwordSchema,        // Password rules
  urlSchema,             // URL validation
  slugSchema,            // Slug format
} from '@/lib/validations/schemas';
```

### Create Custom
```tsx
import { z } from 'zod';

const mySchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 chars'),
  terms: z.boolean().refine(v => v === true, {
    message: 'You must agree',
  }),
});

type FormData = z.infer<typeof mySchema>;
```

---

## CSS Variables

### Colors
```css
/* Brand teal */
--brand-50 to --brand-900

/* Surfaces */
--surface-void      /* Page background */
--surface-base      /* Cards */
--surface-raised    /* Raised elements */
--surface-overlay   /* Modals */

/* Text */
--text-primary      /* Main text */
--text-secondary    /* Labels */
--text-tertiary     /* Metadata */
--text-disabled     /* Disabled */
--text-brand        /* Links */

/* Borders */
--border-subtle     /* Barely visible */
--border-default    /* Standard */
--border-strong     /* Emphasized */
--border-brand      /* Highlight */

/* Shadows */
--shadow-sm
--shadow-md
--shadow-lg
--shadow-glow
```

### Typography
```css
--font-display  /* Syne - headings */
--font-body     /* DM Sans - text */
--font-mono     /* JetBrains Mono - code */

--text-xs  0.75rem
--text-sm  0.875rem
--text-base 1rem
--text-lg  1.125rem
--text-xl  1.25rem
--text-2xl 1.5rem
--text-3xl 1.75rem
--text-4xl 2rem
--text-5xl 2.5rem
```

### Spacing & Radius
```css
--radius         0.5rem
--radius-sm      0.3rem
--radius-md      0.4rem
--radius-lg      0.5rem
--radius-xl      0.7rem
```

### Mastery Levels
```css
--mastery-unseen    /* Not studied */
--mastery-weak      /* Struggling */
--mastery-learning  /* In progress */
--mastery-strong    /* Solid */
--mastery-mastered  /* Perfect */
```

### Feedback
```css
--success-bg    rgba(16, 185, 129, 0.08)
--success-text  #10B981
--error-bg      rgba(239, 68, 68, 0.08)
--error-text    #EF4444
--warning-bg    rgba(245, 158, 11, 0.08)
--warning-text  #F59E0B
--info-bg       rgba(59, 130, 246, 0.08)
--info-text     #3B82F6
```

---

## Common Patterns

### Form with Validation
```tsx
const methods = useForm({
  resolver: zodResolver(mySchema),
  mode: 'onChange',  // Validate as user types
});

async function onSubmit(data) {
  try {
    await api.submit(data);
    toastSuccess('Done!');
  } catch (e) {
    toastError('Failed');
  }
}
```

### Conditional Fields
```tsx
const type = methods.watch('type');

return (
  <>
    <FormField ... />
    {type === 'detailed' && <FormField ... />}
  </>
);
```

### Loading Button
```tsx
<Button
  type="submit"
  isLoading={isSubmitting}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>
```

### Error Display
```tsx
const errors = methods.formState.errors;

{errors.email && (
  <p className="text-error-text">
    {errors.email.message}
  </p>
)}
```

### Dynamic Theming in JS
```tsx
const { theme, setTheme } = useTheme();

// Listen for theme changes
useEffect(() => {
  console.log('Theme changed to:', theme);
}, [theme]);
```

---

## File Locations

| What | Where |
|------|-------|
| Form components | `components/form/` |
| Theme hook | `hooks/useTheme.ts` |
| Toast utils | `lib/toast.ts` |
| Validation schemas | `lib/validations/schemas.ts` |
| CSS variables | `app/globals.css` |
| Examples | `components/examples/` |
| Full docs | `COMPONENTS_GUIDE.md` |

---

## Do's & Don'ts

### ✅ DO
- Use CSS variables for all colors
- Use validation schemas with forms
- Show toasts for user feedback
- Use the pre-built form components
- Follow Design.md for styling

### ❌ DON'T
- Hardcode hex colors (`#FFFFFF`)
- Skip validation
- Use browser alerts
- Forget error handling
- Break the design system

---

## Testing

```tsx
// Form submission
const { getByRole } = render(<MyForm />);
const submit = getByRole('button');
fireEvent.click(submit);

// Validation errors
const error = screen.queryByText('Invalid email');
expect(error).toBeInTheDocument();

// Toast notifications
expect(screen.getByText('Success!')).toBeInTheDocument();
```

---

## Next Steps

1. ✅ Read `COMPONENTS_GUIDE.md` for detailed docs
2. ✅ Check `components/examples/` for real forms
3. ✅ Use pre-built schemas from `lib/validations`
4. ✅ Import and build with confidence
5. ✅ Customize colors via CSS variables

---

## Help & Resources

| Resource | Location |
|----------|----------|
| Component API | `COMPONENTS_GUIDE.md` |
| Implementation details | `IMPLEMENTATION_SUMMARY.md` |
| Example forms | `components/examples/` |
| Design philosophy | `Docs/Design.md` |
| Zod docs | https://zod.dev |
| React Hook Form | https://react-hook-form.com |
| Sonner docs | https://sonner.emilkowal.ski |

---

**Everything is production-ready. No breaking changes. Start coding!** 🚀
