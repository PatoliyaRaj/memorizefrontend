# Frontend Documentation Index

Complete guide to the Memorize frontend folder structure and architecture.

## 📚 Documentation Files

Start here based on what you want to know:

### **If you're new to the project:**
1. Read **[ARCHITECTURE_SUMMARY.md](./ARCHITECTURE_SUMMARY.md)** - Visual overview of how everything connects
2. Read **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - "Where does my code go?" checklist
3. Review **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** - Detailed explanation of each folder

### **If you're building a new feature:**
1. Check **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Where to create files
2. Read **[ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md)** - Common patterns to follow
3. Study **[src/features/dashboard/README.md](./src/features/dashboard/README.md)** - Real example

### **If you're reviewing/debugging code:**
1. Use **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** - Find where code lives
2. Check **[ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md)** - Understand the pattern
3. Review **[src/components/README.md](./src/components/README.md)** - Component guidelines

---

## 🗂️ File Structure Reference

### **Root Level Documentation**
```
frontend/
├── FOLDER_STRUCTURE.md          ← Detailed folder explanations
├── QUICK_REFERENCE.md           ← Where does my code go?
├── ARCHITECTURE_PATTERNS.md     ← Common patterns & examples
├── ARCHITECTURE_SUMMARY.md      ← Visual overview & data flow
├── FRONTEND_DOCS_INDEX.md       ← This file
│
├── package.json                 ← Dependencies
├── tsconfig.json                ← TypeScript config
├── next.config.ts               ← Next.js config
├── tailwind.config.cjs          ← Tailwind config
└── ...other config files
```

### **Source Code (`src/`)**
```
src/
├── app/                         # Routes (Next.js App Router)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── (dashboard)/             # Dashboard route group
│   ├── (study)/                 # Study session route group
│   └── (auth)/                  # Auth route group
│
├── features/                    # Feature modules (main business logic)
│   ├── dashboard/               # Dashboard feature (with README)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── README.md            ← Study this for examples
│   │
│   ├── study/                   # Study session feature
│   ├── auth/                    # Authentication feature
│   └── playlist/                # Playlist/map feature
│
├── components/                  # Shared UI components
│   ├── ui/                      # shadcn/ui base components
│   ├── layout/                  # Layout wrappers
│   ├── common/                  # Generic utility components
│   └── README.md                # Component guidelines
│
├── stores/                      # Zustand global state
│   ├── use-theme-store.ts       # Theme (dark/light mode)
│   ├── use-auth-store.ts        # User session
│   └── ...other stores
│
├── services/                    # API communication layer
│   ├── api-client.ts            # HTTP client setup
│   ├── dashboard-service.ts
│   ├── study-service.ts
│   └── ...other services
│
├── hooks/                       # Global custom hooks
│   ├── useApi.ts
│   ├── useAuth.ts
│   └── ...other hooks
│
├── types/                       # Global TypeScript types
│   ├── models.ts                # Core entities
│   ├── api.ts                   # API types
│   └── index.ts
│
├── lib/                         # Utility functions
│   ├── utils.ts                 # General helpers
│   ├── constants.ts             # App constants
│   └── validators.ts            # Form validation
│
├── styles/                      # Global stylesheets
│   ├── variables.css            # CSS custom properties
│   ├── animations.css           # Reusable animations
│   └── theme.css                # Theme-specific CSS
│
└── config/                      # Configuration files
    ├── site-config.ts           # Site metadata
    └── feature-flags.ts         # Feature toggles
```

---

## 🎯 Core Concepts

### **Routes**
- Entry points for every URL (`/dashboard`, `/study/123`, `/login`)
- Should be **thin** - only import and render
- Located in `src/app/`

### **Features**
- Self-contained modules with all related code
- Examples: dashboard, study, auth, playlist
- Structure: `components/`, `hooks/`, `types/`, `utils/`
- Located in `src/features/`

### **Stores**
- Global state managed by Zustand
- Examples: auth (user session), theme (dark/light), dashboard (cached data)
- Located in `src/stores/`

### **Services**
- API communication layer
- Never call `fetch()` directly - always use services
- Located in `src/services/`

### **Hooks**
- Global hooks in `src/hooks/` (used by multiple features)
- Feature-specific hooks in `src/features/[feature]/hooks/`

### **Types**
- Global types in `src/types/models.ts` (User, Card, Node, etc)
- Feature-specific types in `src/features/[feature]/types/`

### **Components**
- Base UI in `src/components/ui/` (shadcn/ui)
- Layout wrappers in `src/components/layout/`
- Generic utilities in `src/components/common/`
- Feature-specific in `src/features/[feature]/components/`

---

## 📖 How to Use This Documentation

### **"I need to create a new component"**
1. Is it used in **multiple features**? → `src/components/common/`
2. Is it a **layout wrapper**? → `src/components/layout/`
3. Is it **only for one feature**? → `src/features/[feature]/components/`
4. Is it a **base UI element**? → Use shadcn add (goes to `src/components/ui/`)

→ See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#-where-does-it-go)

### **"I need to fetch data from the backend"**
1. Create a service in `src/services/[feature]-service.ts`
2. Create a hook in `src/features/[feature]/hooks/use[Feature].ts`
3. Use the hook in your route/component
4. Update types in `src/types/` or `src/features/[feature]/types/`

→ See [ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md#pattern-1-custom-hook-with-service)

### **"I need global state"**
1. Create a store in `src/stores/use-[feature]-store.ts`
2. Use Zustand with TypeScript types
3. Import and use in components

→ See [ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md#pattern-2-component-with-zustand-store)

### **"Where should I look for X?"**
Use the checklist in [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#-where-does-it-go)

### **"How does the data flow work?"**
See the diagram in [ARCHITECTURE_SUMMARY.md](./ARCHITECTURE_SUMMARY.md#-visual-overview)

---

## 🔗 File Navigation

| What I need | Where to look |
|---|---|
| How to structure a feature | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) |
| Example feature | [src/features/dashboard/README.md](./src/features/dashboard/README.md) |
| Component guidelines | [src/components/README.md](./src/components/README.md) |
| Common patterns | [ARCHITECTURE_PATTERNS.md](./ARCHITECTURE_PATTERNS.md) |
| Full folder breakdown | [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) |
| Visual data flow | [ARCHITECTURE_SUMMARY.md](./ARCHITECTURE_SUMMARY.md) |
| Real code examples | [src/features/dashboard/](./src/features/dashboard/) |
| API layer | [src/services/](./src/services/) |
| Global state | [src/stores/](./src/stores/) |
| UI components | [src/components/](./src/components/) |
| Shared types | [src/types/models.ts](./src/types/models.ts) |
| Config | [src/config/site-config.ts](./src/config/site-config.ts) |

---

## ✅ Checklist: Getting Started

- [ ] Read [ARCHITECTURE_SUMMARY.md](./ARCHITECTURE_SUMMARY.md) (5 min overview)
- [ ] Read [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) (folder checklist)
- [ ] Read [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) (detailed breakdown)
- [ ] Review [src/features/dashboard/README.md](./src/features/dashboard/README.md) (real example)
- [ ] Review [src/components/README.md](./src/components/README.md) (component patterns)
- [ ] Check [src/types/models.ts](./src/types/models.ts) (shared types)
- [ ] Check [src/stores/use-theme-store.ts](./src/stores/use-theme-store.ts) (state example)

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm run start
```

Visit http://localhost:3000 in your browser.

---

## 📝 Documentation Writing Guide

When adding new features, create a README in the feature folder:

```markdown
# [Feature Name]

Brief description of what this feature does.

## Structure
- components/ - Feature-specific components
- hooks/ - Feature-specific hooks
- types/ - Feature-specific types
- utils/ - Feature-specific utilities

## How It Works
1. Route calls hook
2. Hook fetches data from service
3. Service makes API call
4. Data returned and rendered

## Example
[Code snippet showing typical usage]
```

---

## 🎓 Key Principles

1. **Routes are thin** - Only import and render, no logic
2. **Features are independent** - Don't import between features
3. **Services handle API calls** - Never fetch() in components
4. **Stores are global** - For state needed by multiple features
5. **Types are shared** - Define once, import everywhere
6. **Components are reusable** - If used twice, move to shared folder

---

## 📞 Questions?

When you're unsure where to put code, ask:
1. Is it used in **multiple features**? → Global folder (`src/`)
2. Is it used in **one feature only**? → Feature folder
3. Is it a **route**? → `src/app/`
4. Is it **state management**? → `src/stores/`
5. Is it **API logic**? → `src/services/`
6. Is it **a hook**? → `src/hooks/` or `src/features/[feat]/hooks/`

→ See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for detailed checklist

---

**Last Updated**: January 2025  
**Structure Version**: 1.0 (Production Ready)  
**Team Size**: Designed to scale from 1 to 50+ developers

