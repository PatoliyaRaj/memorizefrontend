<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:shadcn-ui-agent-rules -->
# Shadcn UI Rules

**Rule 1 — Theme First**
Always use the theme variables defined in `src/app/globals.css`. Never hardcode hex values. Do NOT invent new colors. Do NOT use default Tailwind colors unless they exactly match a theme variable.

**Rule 2 — Component Source**
Always import components from `@/components/ui`. Do NOT use the shadcn/ui CLI to generate new components unless explicitly requested. Do NOT use `node_modules/shadcn-ui/...` directly.

**Rule 3 — Existing Components**
Before creating a custom component, check if an existing shadcn component can be used or composed or shadcn provide it if yes so download it and use it . Only create a new component if:
- No existing component matches the required functionality, AND
- The design requires a deviation from the standard shadcn pattern.
- for create the new componet use the shadcn componets like cards , buttons, etc which is need

**Rule 4 — Tokens Only**
All design tokens (colors, radii, spacing, shadows) must come from the CSS variables defined in `src/app/globals.css`. Do NOT invent new values. Use the following token namespaces:
- `--color-*`
- `--radius-*`
- `--shadow-*`
- `--text-*`
- `--border-*`
- `--surface-*`

**Rule 5 — Dark Mode**
All components must support dark mode via the `dark:` variant. Do not write `!important` to override theme colors.

**Rule 6 — Composition Preference**
If a custom component is needed, compose it from existing shadcn components rather than rewriting everything from scratch.

**Rule 7 — No CDN/External Styles**
Never import styles from CDNs or external sources. All styling must be self-contained within the project's theme and component structure.

**Rule 8 — Testing**
Always test components in both light and dark modes to ensure theme compatibility.
<!-- END:shadcn-ui-agent-rules -->
