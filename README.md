# Guap

Financial literacy platform for kids - Sequence-inspired money routing + learning gamification.

## Structure

```
guap/
├── apps/
│   ├── website/     # Marketing site (Next.js 15)
│   ├── web/         # Kid app (Vite + React + TanStack Router)
│   └── mobile/      # Mobile app (Expo + React Native)
├── packages/
│   ├── shared/      # Shared types, schemas, utilities
│   ├── design/      # Design system (no Tailwind config - use CSS)
│   └── auth/        # better-auth client wrapper
└── backend/         # Convex backend (DB + functions)
```

## Tech Stack

- **Monorepo**: pnpm workspaces + Turbo
- **Kid App**: Vite + React 19 + TanStack Router
- **Marketing**: Next.js 15
- **Mobile**: Expo + React Native + NativeWind
- **Backend**: Convex (DB + real-time + functions)
- **Auth**: better-auth
- **Validation**: Zod
- **Styling**: Tailwind v4 (CSS-based, no config files)

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
# Start all apps
pnpm dev

# Or run individually:
cd apps/web && pnpm dev          # Kid app on http://localhost:5173
cd apps/website && pnpm dev      # Marketing on http://localhost:3000
cd apps/mobile && pnpm dev       # Expo dev server
cd backend && pnpm dev           # Convex backend (requires: npx convex login)
```

### Scripts

```bash
pnpm build      # Build all apps
pnpm lint       # Lint all workspaces
pnpm typecheck  # Type check all workspaces
pnpm clean      # Clean all build artifacts
```

## Workspace Commands

Each workspace supports:
- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm clean` - Clean build artifacts

## Styling with Tailwind v4

This project uses Tailwind v4 which **does not use config files**. All styling is done via CSS:

- `apps/website/src/app/globals.css` - Website styles
- `apps/web/src/index.css` - Web app styles
- `apps/mobile/global.css` - Mobile app styles

Simply use `@tailwind` directives and custom CSS in your globals.css files.

## Project Status

✅ Clean monorepo scaffolding complete
✅ All build/lint/typecheck scripts working
✅ Strict TypeScript enabled (no suppressions)
✅ Proper pnpm workspace isolation (no shamefully-hoist)
✅ Ready for feature development

## Documentation

See `.docs/plan.md` for complete feature specification and roadmap.
