# Backend (Convex)

Backend for finlit.gg using Convex.

## Structure

- `convex/schema.ts` - Database schema (20+ tables)
- `convex/` - Convex functions (queries, mutations, actions)

## Development

```bash
pnpm dev    # Start Convex dev server
pnpm build  # Deploy to production
```

## Schema Overview

Based on plan.md data model:

- **Identity**: users, profiles, households
- **Finance**: accounts, transactions, goals
- **Rules**: rules, events, schedules
- **Earn**: chores, choreAssignments, earnEvents
- **Learning**: lessons, quizzes, quizAttempts
- **Gamification**: xpLedger, badges, inventory, fragments
- **Nudges**: nudgeSettings, nudgeEvents

To be implemented:
- Rules engine (actions)
- Account transfer logic
- Goal funding automation
- XP/badge calculations


