awesome—love the finlit.gg vision. i dug into Sequence so we can mirror the right ideas for a no-integration V1 and set you up for the later phases.

# What “Sequence” actually is (so we copy the right parts)

* **Core value prop:** “financial router” that links essentially all accounts, visualizes flows, and automates money movement with **rules + IF statements** and a **Money Map** view. ([getsequence.io][1])
* **Connectivity positioning:** “connects to up to 95% of U.S. financial institutions” with the ability to **move** money across linked accounts (not just read). ([getsequence.io][2])
* **Commercial wrapper:** Fintech company (not a bank). Banking services via **Thread Bank**. Pricing tiers cap transfers and include conditional logic. ([getsequence.io][3])
* **Playground/graph UX:** a node-based builder for income sources → destinations with rules. (We’ll echo the UX minus real transfers.) ([playground.getsequence.io][4])

---

# Roadmap (mapped to your outline)

**V1 (now): Kids web app — core UX only, no real integrations**
Goal: simulate “Sequence-style” routing + kid flows using **virtual accounts** and a local rules engine.

**V2:** Parent app (approvals, guardrails, allowances, notifications).

**V3:** Marketing site (trust, safety, pedagogy, demos, FAQs, waitlist).

**V4:** Integrations/APIs (open banking, sponsor bank, card issuing, UTMA brokerage, HYSA).

**V5:** Mobile (Expo), push, Apple/Google family integrations.

---

# V1 scope (production-ready, integration-free)

## 1) Core UX (kid app)

**Global IA**

* Header: Logo · Search · Account · Notifications
* Sidebar: **Dashboard, Earn, Save, Invest, Spend, Donate, Automations** (rules), Learn

**Dashboard**

* Wealth Ladder (Level 1: $0–$10k; L2: $10k–$100k; L3: $100k–$1m).
* Snapshot cards: Earn, Save, Invest, Spend, Donate.
* **Compound interest visualizer** (goal-based: “bike in 6 months”).
* Nudges widget: Round-Up, Save-as-you-Spend (simulated).

**Earn**

* Sources: **Alpha XP**, **TimeBack**, **Parent transfer (pending)**, **Chores**.
* Propose → parent approval (simulated in V1 with “auto-approve” toggle).
* Streaks & multipliers (e.g., chore streak bonus +5%).

**Save (virtual HYSA)**

* Goals with progress bars; “Transfers in/out” flows (virtual).
* Auto-rules: pay-day splits (e.g., 30% Save, 10% Donate).

**Invest (virtual UTMA)**

* Virtual portfolio & watchlist; buy/sell **simulated** fractional shares/ETFs.
* “Collect Stock Fragments” & **Loot Boxes** as earnable rewards; assembling all fragments → “free stock” (virtual unlock).

**Spend**

* Virtual debit & secured credit “cards” with fake PANs; transactions seeded from templates.
* Needs vs Wants classifier (rules-based for V1).
* Simulated credit payment flow.

**Donate**

* Pick from a curated list; track % given and milestones.

**Automations (heart of V1)**

* **Money Map** canvas (nodes + edges): sources → buckets → accounts.
* Rule builder: **percent/fixed**, **date-based**, **threshold triggers**, **IF/THEN** (e.g., *IF Earned > $50 this week THEN +5% to Save*). (Mirrors Sequence’s IF logic & routing concept, but offline.) ([getsequence.io][1])

**Learn (interwoven micro-lessons)**

* Snackable lessons embedded next to actions (“Buying? Here’s unit price math”).
* Short quizzes → **XP, badges, fragments, loot tickets**.

## 2) Core product loop (V1, simulated)

1. Kid **earns** (chores/XP/TimeBack).
2. **Proposes allocation** (rules pre-fill splits).
3. “Parent approval” simulated (toggle on in dev tools).
4. Funds “move” between **virtual** accounts; dashboard & ladders update.
5. Lesson unlock → rewards → nudges → new goals.
6. Repeat.

## 3) Gamification (V1)

* **XP/Levels/Badges**: actions, streaks, lesson mastery.
* **Loot Boxes**: spend in-app currency; get **stock fragments** (collect all to unlock 1 “virtual share”).
* **Goal Parties**: crossing 25/50/100% triggers confetti + fragment.

---

# Data model (Supabase/Postgres; minimal but future-proof)

**Identity**

* `users` (Auth): id, email (parent/kid), role, household_id
* `profiles`: user_id, display_name, dob (COPPA aware), avatar, preferences

**Households & relationships**

* `households` (name, timezone)
* `guardians` (user_id, household_id, permissions)
* `dependents` (user_id, guardian_id, household_id)

**Finance (virtual)**

* `accounts` (id, household_id, type: save|invest|spend|donate|virtual_cc, name, balance_cents)
* `transactions` (id, account_id, amount_cents, category, counterparty, meta)
* `goals` (id, account_id, target_cents, target_date, status, progress)
* `allocations` (id, rule_id, pct_or_fixed, dest_account_id, priority)

**Rules & automations**

* `rules` (id, household_id, name, active, trigger_type: schedule|event|threshold, condition_json, action_json)
* `events` (id, type, payload_json, occurred_at)
* `schedules` (rule_id, cronish)

**Earn**

* `chores` (id, title, recurrence, reward_cents|xp)
* `chore_assignments` (child_id, chore_id, status, due_at)
* `earn_events` (child_id, source: xp|timeback|chore|gift|parent, amount_cents, xp)

**Learning**

* `lessons` (id, slug, content, media_refs, difficulty)
* `quizzes` (lesson_id, items_json)
* `quiz_attempts` (user_id, lesson_id, score, rewards_json)

**Gamification**

* `xp_ledger` (user_id, delta, reason)
* `badges` (id, slug, criteria_json)
* `inventory` (user_id, item_type: loot_ticket|fragment|booster, item_id, qty)
* `fragments` (id, symbol, required_count, art_ref)

**Nudges**

* `nudge_settings` (user_id, round_up_enabled, save_as_you_spend_enabled)
* `nudge_events` (user_id, type, amount_cents, routed_to)

---

# Rules engine (offline, V1)

**DSL (tiny, readable JSON):**

```json
{
  "name": "Payday Split",
  "when": {"event":"income.received", "filters":{"source":"chore|parent|xp"}},
  "if": [{"op":">", "left":"event.amount", "right":5000}],
  "do": [
    {"type":"allocate_pct", "to":"account.save", "pct":30},
    {"type":"allocate_pct", "to":"account.invest", "pct":20},
    {"type":"allocate_pct", "to":"account.donate", "pct":5},
    {"type":"allocate_rest", "to":"account.spend"}
  ]
}
```

**Evaluator** (oRPC handler): accepts an `event`, loads active `rules`, evaluates predicates, emits a batch of **virtual transactions**.

---

# UX details you can hand to design

**Money Map (Automations)**

* Node types: *Income*, *Rule*, *Bucket*, *Account*, *Nudge*.
* Edge labels: % or $; tooltips for IF conditions.
* Empty state: “Create your first flow” with 3 templates: *50/30/20*, *Save-first*, *Donate tithe*.

**Dashboard cards**

* Mini charts: 30-day balance sparkline, progress ring for goals, streak indicator.
* Callouts: “You rounded up $3.20 last week → +$0.06 invested.”

**Invest**

* “Practice mode” watermark; price movement **fixed samples**; clear disclosure “Simulation, not real investing.”

**Learn**

* 2–3 minute micro-lessons; end with a **1-question** check → reward.

---

# V1 content & features backlog (prioritized)

1. **Money Map + rule builder** (graph editor, 3 templates, IF/THEN)
2. **Virtual accounts** (Save/Invest/Spend/Donate); **transaction ledger**
3. **Earn** (chores, XP, parent transfer stub)
4. **Goals** (create, fund, celebrate)
5. **Learn** (5 lessons: *Needs vs Wants*, *Simple Interest vs APY*, *Diversification*, *What is Credit*, *Giving 101*)
6. **Gamification** (XP, badges, loot tickets, fragments)
7. **Nudges** (Round-Up & Save-as-you-Spend — simulated)
8. **Dashboard + Wealth Ladder + calculator**
9. **Basic notifications** (in-app toasts & inbox)
10. **Parent-approval simulator** (dev toggle) → replaced by real parent app in V2

---

# Tech stack (aligned to yours)

**Monorepo:** `pnpm` workspaces

* `apps/kid` — **Next.js (App Router)**
* `apps/api` — **bun + hono** (oRPC endpoints)
* `packages/ui` — Tailwind v4.1 + shadcn; NativeWind tokens prepared for Expo later
* `packages/db` — Supabase (Auth + Postgres) with Drizzle or Kysely
* `packages/shared` — Zod schemas, rule DSL types, feature flags

**Key libs**

* Graph editor: **react-flow** (node/edge builder)
* Charts: **recharts**
* Design tokens shared via Tailwind config + NativeWind mapping
* Testing: Vitest + Playwright (critical flows), ESLint/Prettier

**oRPC slices (Zod-first)**

* `rules.create/update/list/execute`
* `earn.chore.assign/complete`
* `accounts.transfer/simulate`
* `goals.create/fund`
* `learn.lesson.get/attempt.submit`
* `gamify.loot.open/fragment.combine`

---

# Example Zod contracts (starter)

```ts
// packages/shared/contracts.ts
export const Money = z.object({ amount: z.number().int(), currency: z.literal('USD') });

export const CreateRule = z.object({
  name: z.string().min(3),
  when: z.object({ event: z.enum(['income.received','purchase','month.start']), filters: z.record(z.any()).optional() }),
  if: z.array(z.object({ op: z.enum(['>','>=','<','<=','=','!=']), left: z.string(), right: z.union([z.number(), z.string()])})).optional(),
  do: z.array(z.object({ type: z.enum(['allocate_pct','allocate_fixed','allocate_rest']), to: z.string(), pct: z.number().optional(), amount: z.number().optional() }))
});
export type CreateRule = z.infer<typeof CreateRule>;
```

---

# Analytics & safety (from day one)

* **Events:** `rule.created/executed`, `goal.created/funded`, `chore.completed`, `lesson.completed`, `loot.opened`, `nudge.applied`.
* **Guardrails (kid mode):** content filters, spending categories locked behind “Needs vs Wants” mini-lesson, no external links.
* **Privacy foundations:** no PII beyond first name/age band; all balances virtual until V4.
* **Compliance runway:** Build with **COPPA** in mind (verifiable parental consent) and easy data export/delete; plan for **KYC** (parents) and **sponsor bank** + **card issuing** + **brokerage** in V4. (Sequence itself clarifies it isn’t a bank; similar clarity for you later.) ([getsequence.io][3])

---

# Differentiation vs kid money apps (later phases)

Most family apps cover chores/allowance/debit cards (e.g., Greenlight, Stockpile’s teen debit/allowance). Your moat is **Sequence-like automation + learning-native** UX. Let kids *design* the money flow and see consequences. ([Greenlight][5])

---

# V1 delivery plan (6 sprints)

**S1 — Foundations**

* Monorepo, Auth, DB schema, seed data, design system, layout scaffold.

**S2 — Accounts & Transactions (virtual)**

* Ledgers, transfers, dashboard snapshots, wealth ladder calc.

**S3 — Money Map (MVP)**

* React Flow graph, create/edit rules, execute on “income.received”.

**S4 — Earn & Goals**

* Chores + XP + TimeBack flows; goal creation & auto-fund rules.

**S5 — Learn & Gamification**

* 5 micro-lessons, quiz engine, XP/badges, loot tickets, fragments.

**S6 — Nudges & Polish**

* Round-Up/Save-as-you-Spend simulators, notifications, accessibility pass, basic analytics.

(Ship feature-flagged; V2 parent app spins out from the same DB/contracts.)

---

# Risks & how we handle them

* **Rules complexity → confusion:** ship templates + in-context tips; show *result preview* before saving a rule.
* **Simulated investing expectations:** “Practice mode” labels everywhere; no price streaming; fixed price sets per day.
* **Kid safety & data:** COPPA-ready model now; defer any real money until V4.

---

# Nice-to-have extras (if we have time)

* “**What happens if…**” sandbox: slider to test allocations over 6 months.
* **Needs vs Wants coach** (categorization game) that trains the classifier.
* **Parent match offers** (V2), e.g., “Hit $100 saved this month → +$10 match.”

---

## Quick reference to Sequence pages I used

* Positioning, “financial router,” and Money Map / automation language. ([getsequence.io][1])
* “Connects to up to 95% … and move money” claim. ([getsequence.io][2])
* IF-statements for routing and automation. ([go.getsequence.io][6])
* Non-bank disclosure & Thread Bank note; pricing features like conditional logic. ([getsequence.io][3])
* Playground (node-based builder) to inspire our Money Map. ([playground.getsequence.io][4])

---

if this looks good, i can turn it into:

1. a clickable component inventory (Figma-ish checklist),
2. a DB migration file set for Supabase, and
3. a first pass of the React Flow “Money Map” with 3 prebuilt templates.

[1]: https://www.getsequence.io/solutions/personal?utm_source=chatgpt.com "Budgeting, But Smarter. Personal Finance Automation"
[2]: https://www.getsequence.io/how-it-works?utm_source=chatgpt.com "How Sequence works"
[3]: https://www.getsequence.io/?utm_source=chatgpt.com "Automate Your Finances, Gain Control"
[4]: https://playground.getsequence.io/?utm_source=chatgpt.com "Sequence Playground"
[5]: https://greenlight.com/?utm_source=chatgpt.com "Greenlight: Debit Card for Kids and Teens"
[6]: https://go.getsequence.io/richhabitspodcast?utm_source=chatgpt.com "Taxes, Expenses, Paychecks: Automated"

---

Update:

Monorepo layout
finlit.gg/
  apps/
    website/     # Next.js (marketing + auth server)
    web/         # React + Vite (kid app)
    mobile/      # Expo (later)
  backend/       # Convex (schema, functions, cron) — configured via convex.json
  packages/
    ui/          # shadcn/tailwind components
    shared/      # zod domain types, utils
    auth-client/ # Better Auth client wrapper shared by all frontends
  pnpm-workspace.yaml
  convex.json
  package.json
  turbo.json (optional)

pnpm catalogs (pin shared versions)

pnpm-workspace.yaml

packages:
  - "apps/*"
  - "packages/*"
  - "backend"
catalog:          # central, reusable version pins
  react: ^18.3.1
  next: ^14.2.7
  vite: ^5.4.8
  expo: ~51.0.0
  convex: ^1.16.0
  zod: ^3.23.8
  neverthrow: ^6.2.0
  tailwindcss: ^3.4.10
  typescript: ^5.5.4


Then, in each package’s package.json, reference the catalog pins:

{
  "dependencies": {
    "react": "catalog:react",
    "zod": "catalog:zod",
    "neverthrow": "catalog:neverthrow"
  },
  "devDependencies": {
    "typescript": "catalog:typescript"
  }
}


pnpm “catalogs” let you define version ranges once and reuse them everywhere. 
pnpm
+1

Convex “backend” at /backend

If you prefer /backend over /convex, add convex.json at the repo root:

{ "functions": "backend" }


Run npx convex dev and Convex will generate its client into /backend/_generated/*. 
Convex Developer Hub

Do we keep TanStack Query?

Drop it for Convex data paths (kid app, later mobile): use useQuery/useMutation from convex/react. They’re live/real-time and handle cache/updates automatically. 
Convex Developer Hub

Keep or add it in apps/website if you fetch non-Convex data (CMS, analytics APIs, etc.), or if you want React Query’s APIs for those calls. If you must mix, Convex provides a React Query adapter with slightly different semantics. 
Convex Developer Hub

Better Auth + Convex (one auth for all apps)

Goal: run Better Auth in your Next.js apps/website (API routes), and have web (Vite) and mobile (Expo) talk to the same auth server. Pass the Better Auth JWT to Convex for auth.

1) Better Auth server (Next.js)

Implement Better Auth in apps/website (pages or app routes). It gives you endpoints + a TypeScript server API. 
Better Auth
+2
Better Auth
+2

Expose login, callback, session, etc. Your Vite and Expo apps call these endpoints too.

2) Convex configured to accept your JWTs

Use a custom JWT (or OIDC, if you configure Better Auth that way) provider in Convex:

// backend/auth.config.ts
export default {
  providers: [
    {
      type: "customJwt",
      applicationID: "finlit-website",            // any stable ID you choose
      issuer: "https://website.finlit.gg",        // Better Auth issuer
      jwks: "https://website.finlit.gg/.well-known/jwks.json",
      algorithm: "RS256"
    }
  ]
};


This tells Convex how to verify tokens issued by your Better Auth server. 
Convex Developer Hub
+1

3) Frontends pass the token to Convex

In website, web, and later mobile, after you obtain the Better Auth session/JWT, wire it into Convex:

import { ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Called whenever your Better Auth session changes:
convex.setAuth(async () => {
  const token = await authClient.getIdToken(); // from packages/auth-client
  return token ?? null;
});


Convex uses that JWT to authenticate all queries/mutations. Inside Convex functions, get the identity via ctx.auth.getUserIdentity(). 
Convex Developer Hub
+2
Convex Developer Hub
+2

4) Shared auth client

Put a tiny wrapper in packages/auth-client that:

Knows how to hit the Better Auth endpoints (website),

Caches/refreshes the JWT,

Exposes getIdToken() and subscribe() for session changes (used by convex.setAuth).

This keeps all three apps on the same auth surface.

Where TanStack Query still shines (optional)

apps/website: SSR/ISR pages that fetch CMS/marketing data, or any third-party REST you don’t store in Convex. React Query’s caching + retry + parallelism are nice here. 
TanStack
+1

Bridging legacy services: if you have fetch-only endpoints outside Convex, use React Query; keep Convex hooks for anything in your database.

React Native / Expo later

Convex officially supports React Native, so your Expo app can reuse the same Convex client and Better Auth token flow. 
Convex Developer Hub
+2
Convex Developer Hub
+2

TL;DR

Monorepo with pnpm catalogs: yes; pin once in pnpm-workspace.yaml and use catalog:* everywhere. 
pnpm

Convex replaces your API/DB/scheduler; keep it in /backend via convex.json. 
Convex Developer Hub

Better Auth runs in apps/website and issues JWTs; Convex validates them (custom JWT/OIDC). 
Convex Developer Hub
+1

TanStack Query: drop for Convex data; keep for non-Convex fetches (mainly marketing site) or use Convex’s adapter if you really want to standardize. 
Convex Developer Hub

If you want, I can generate:

a starter pnpm-workspace.yaml with catalogs,

convex.json and /backend scaffold,

a tiny packages/auth-client that works for Next, Vite, and Expo.

ADD POLAR: https://polar.sh/
ADD RESEND: https://resend.com/api-keys
ADD BETTER AUTH:
ADD https://github.com/supermacro/neverthrow