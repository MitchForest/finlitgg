# finlit.gg Web MVP Implementation Plan

This implementation roadmap aligns with `.docs/user-stories.md`, `.docs/data-models.md`, and `.docs/design-system.md`. It focuses on the kid/guardian web app (`apps/web`) with Convex backend services. Each phase lists the primary goals, detailed tasks, shared component work, data requirements, and validation steps.

## Global Conventions
- **Architecture**: Keep shadcn primitives in `components/ui`, compose design-system variants in `components/common`, and group domain features in `features/<domain>` exposed via index files. Routes only orchestrate feature components; all data fetching lives in feature hooks/services.
- **Type Safety**: Use Zod schemas sourced from `packages/shared` for every Convex query/mutation, TanStack Query hook, and form. Infer TypeScript types from these schemas to ensure end-to-end validation.
- **Forms**: Standardize on TanStack Form. Provide a shared `Form` wrapper in `components/common/form` that wires schemas, submit handlers, and shadcn form fields (`Label`, `Input`, `Select`, etc.).
- **Tables**: Use TanStack Table wrapped by shadcn table components. Expose reusable `DataTable`, `PaginatedTable`, and `EmptyTableState` components.
- **States & Feedback**: Define common components for loading (`LoadingState`), empty (`EmptyState`), error (`ErrorState` with retry), modals/sheets, and notifications. All features should import and reuse these patterns.
- **Notifications & Errors**: Centralize toast/notification handling through a `useNotifications()` hook backed by Sonner + Convex. For errors, use a shared `handleMutationError` helper that logs to `household_events` and shows consistent messaging.
- **Context Providers**: Root providers supply auth, persona, notifications, reward vault summaries, and query clients once; features consume via hooks.
- **Provider Abstraction**: Follow `.docs/provider-architecture.md`—all money/investing operations depend on domain ports implemented by adapters in `packages/providers`; registry-driven injection keeps simulated and real providers interchangeable.

## Phase 0 — Repo & Tooling Baseline
1. **Design tokens integration**
   - Port design-system color/spacing/typography tokens into `packages/design` and expose them as CSS variables consumable via `globals.css`.
   - Ensure `apps/web` consumes shared variables; publish helper mixins/utilities (e.g., `useAccentColor(domain)`) so feature teams apply consistent styles without per-page duplication.
2. **Shadcn alignment**
   - Audit `apps/web/src/components/ui` imports and export a barrel (e.g., `components/ui/index.ts`) for consistent usage.
   - Extend shadcn primitives with design-system styles (e.g., theme-aware `Button`, `Card`, `Sidebar`).
3. **Project hygiene**
   - Add ESLint/Vitest configs referencing `tsconfig.base.json`.
   - Populate `.env.example` with Convex URL, feature flag toggles.
   - Confirm `pnpm lint`, `pnpm test`, `pnpm format` scripts work inside `apps/web`.
4. **Provider scaffolding**
   - Implement the port/adaptor skeleton from `.docs/provider-architecture.md`: create `packages/providers` with interfaces and simulated adapters, add `provider_configs` Convex table, and document config defaults.

## Phase 1 — Application Shell & Routing Skeleton
1. **Routing structure**
   - Use TanStack Router (already scaffolded) to define routes: `dashboard`, `earn`, `save`, `invest`, `spend`, `donate`, `automations`, `learn`, `requests`, `approvals`, `settings`.
   - Create placeholder components under `apps/web/src/routes` matching each path.
2. **Global providers**
   - Wrap root route with `ThemeProvider` and placeholder data providers (Convex client stub until schema lands).
   - Add TODO hooks for Auth/notifications; full integration moves to backlog to avoid blocking UI progress.
3. **Layout shell**
   - Build `AppShell` component (`components/layout/app-shell.tsx`) featuring:
     - Left sidebar using `Sidebar` shadcn component with design tokens.
     - Top bar containing search (`Input` + icon), XP meter (`Progress`), notifications button (`Popover`), profile menu (`DropdownMenu`).
     - Conditional bottom nav for mobile using `NavigationMenu` / custom wrapper.
   - Implement responsive layout (CSS grid or flex) to accommodate upcoming right-side drawers.
4. **Persona mode**
   - Add `usePersona()` hook that reads `global_role` from session to toggle kid/guardian variants (e.g., accent backgrounds, nav labels for `Requests` vs `Approvals`).
5. **Placeholder content**
   - Insert skeleton cards from `Skeleton` component for each page until data wiring occurs.
6. **Manual smoke checklist**
   - Document a lightweight manual QA pass (navigate key routes, resize, dark mode toggle) until automated tests move out of backlog.

## Phase 2 — Shared UI & Wow Entry Foundations
1. **Domain cards**
   - Create reusable components:
     - `KpiCard` (balance, change, sparkline placeholder).
     - `ListCard` for recent activity (avatar, name, amount).
     - `ReminderCard` with CTA buttons.
   - Base them on shadcn `Card` and align with design tokens.
2. **Charts layer**
   - Wrap `components/ui/chart` for donut, bar, sparkline using `recharts` or existing chart utility. Provide `ChartThemeContext` for accent injection.
3. **Drawer & modal primitives**
   - Compose `Sheet`, `Drawer`, `Dialog` components into `ApprovalsDrawer`, `RequestsDrawer`, and `ReviewAllocationModal` skeletons.
4. **Common state patterns**
   - Implement shared `LoadingState`, `EmptyState`, `ErrorState`, and `CalloutBanner` components with consistent copy + icons.
5. **Data tables**
   - Build `DataTable` and `PaginatedTable` wrappers that pair TanStack Table with shadcn table elements, including toolbar, filtering, and empty-state slots.
6. **Badge & Tag system**
   - Extend `Badge` component with status tokens (`needs`, `wants`, `pending`, `success`).
7. **Animation utilities**
   - Establish motion primitives using Framer Motion (or React Spring) for card transitions, flow animations, and confetti; provide helper hook `useMotionPreset(domain)`.
8. **Form controls**
   - Build `TanStackForm` wrapper integrating TanStack Form, shared Zod resolvers, and shadcn `FormField` components. Provide helpers for async validation and optimistic updates.
9. **Storybook inventory**
   - Stand up Storybook in `apps/web` listing these building blocks, TanStack Form examples, and TanStack Table patterns for design review.
10. **Wow playground entry point**
    - Add sparkle/"Play" control to the top bar that routes to `/wow` (or opens modal) with first-run guard so onboarding flows directly into the playground.
    - Scaffold `WowPlaygroundLayout` with hero intake card, React Flow canvas shell, timeline editor stub, and CTA rail; keep state local until Convex wiring arrives.
    - Build draft selector drawer component ready to list saved runs once `automation_flows` backing is wired.
11. **Bucket & ladder widgets**
    - Compose `BucketCard`/`BucketSlider` atoms that map account partitions to UI (Needs, Wants, Goals) and emit allocation change events.
    - Create wealth ladder rail component consuming snapshot props so dashboards and playground share the same visualization.
12. **Draft lifecycle UX**
    - Implement skeleton flows for `Save Draft`, `Rename Draft`, `Delete Draft` using local state; surface toast feedback via design-system notifications.
    - Add guardian approval CTA stub on draft summary modal (disabled + tooltip until backend wiring).
13. **Scenario overlay scaffolding**
    - Define UX for applying baseline vs stress scenario (toggle chips + legend) with mocked data; ensure layout accommodates future comparisons.
14. **Timeline editor shell**
    - Build period blocks with drag/resize handles (local state only) and guard against overlap; connect changes to allocation/bucket widgets for immediate visual response.

## Phase 3 — Data Integration Foundations
1. **Convex client setup**
   - Generate Convex client (`pnpm convex dev`) and create `apps/web/src/lib/convex-client.ts` with auth token pass-through.
2. **Schema updates for wow primitives**
   - Migrate `accounts` to include `account_subtype`, add new `account_partitions`, `wealth_progress_snapshots`, and wire `virtual_cards.partition_id`.
   - Extend `automation_templates` with `scenario_type`, `automation_flows` with `flow_kind`, and `requests.request_type` with `wow_plan`.
   - Backfill seed data + indexes for the new tables/columns.
3. **Domain hooks & selectors**
   - Create typed hooks in `apps/web/src/hooks` using `convex/react` (`useAccounts`, `useAccountPartitions`, `useWealthSnapshots`, `useAutomationDrafts`, etc.).
   - Expose selector helpers for derived data (e.g., mapping partitions into bucket widgets, wealth ladder summaries) without layering TanStack Query on top.
   - Define Zod validators referencing `packages/shared` schemas; infer types to enforce end-to-end type safety.
4. **Sample data & scenario seeding**
   - Extend backend seed script with baseline accounts, partitions, wealth ladder snapshots, and pre-made wow scenario templates (baseline + stress tests).
   - Seed sparkle entry metadata (first-run flag) so onboarding can hand-off cleanly.
5. **Provider registry wiring**
   - Implement `backend/convex/providers.ts` helper that resolves adapters based on `provider_configs`, update domain mutations/actions to use the injected registry, and add contract tests for the simulated providers.
6. **Access guard**
   - Implement `ProtectedRoute` that checks persona gating (kids only see own data; guardians see aggregated dashboards).
7. **Draft persistence & approvals**
   - Add Convex mutations/actions for saving wow playground drafts (`automation_flows` with `flow_kind = 'wow_onboarding'`), recording preview results (`wealth_progress_snapshots`), and submitting drafts to guardians (`requests.create` with `wow_plan`).
   - Ensure guardian approval actions patch flow status + emit household events for notifications/toasts.

## Phase 4 — Wow Playground & Dashboard
1. **Simulation engine**
   - Build `packages/shared/simulations` module with deterministic projections that consume `automation_flows` drafts, account partitions, and growth assumptions. Expose Convex action `simulations.previewFlow` returning timeline + wealth snapshot data.
   - Support scenario tags from `automation_templates` (baseline, stress, custom) and guard math with Zod validators.
2. **Flow animation experience**
   - Create `WowPlayground` feature (React) using animation utilities + React Flow overlays to animate income, partitions, and liabilities; reuse bucket widgets and ladder rail from Phase 2.
   - Implement interactive controls: time horizon slider, timeline period editor, allocation sliders, scenario toggle chips. Persist edits to local state, then sync to Convex draft mutations on save.
3. **Wealth ladder projection**
   - Combine simulation output into wealth ladder snapshots (write to `wealth_progress_snapshots`) and highlight milestone unlocks with celebration animations + copy.
   - Surface comparison view (baseline vs selected scenario) and note months-to-next-level deltas.
4. **Dashboard integration & approvals**
   - Embed latest wealth snapshot + wow CTA on kid dashboard; show draft list + sparkle re-entry.
   - Guardian dashboard surfaces pending wow plan approvals with condensed summary and quick actions; approval updates flow status and triggers notifications.
5. **Notifications feed**
   - Use `ScrollArea` to show top 5 notifications with `Badge` for severity; include wow plan submitted/approved events and scenario reminder nudges.
6. **Demo QA checklist**
   - Maintain a manual script covering wow intake, draft save, replay, scenario toggle, guardian approval preview; automate later (backlog).

## Phase 5 — Earn & Requests
1. **Earn page**
   - Sections: Available chores (cards with accept CTA), Active assignments, Missions, Earn proposals.
   - Use `Tabs` to switch between categories (`Chores`, `Missions`, `TimeBack`).
   - Render streak meter (progress bar + badge).
2. **Earn proposal flow**
   - Kid: `SubmitProposalModal` (form with `Input`, `Textarea`, `Select`). On submit, call `requests.create` (type `earn_proposal`).
   - Guardian: Approvals drawer merges `earn_proposals`, `chore_assignments` statuses; use `Accordion` for feedback notes.
3. **Allowance visibility**
   - Guardian view: `Card` list of allowances with next run date, skip button, and TanStack Table for history.
4. **Allocation review**
   - Implement `ReviewAllocationModal` leveraging TanStack Form: kid sees suggested splits, can edit percentages per account/goal, and submit. Submission calls `earn.confirmAllocation` storing final splits and transitions event to `applied` or `awaiting_guardian` (if guardrails require).
5. **Reward triggers**
   - When streak or mission milestones are hit, create Reward Vault entries (`rewardVault.createFromMilestone`) in Convex and show toast confirmation.
   
## Backlog — Post-Demo Enhancements
- **Auth integration**: Wire Better Auth client/server, gated routes, and session refresh handling.
- **Automated testing**: Add Vitest unit coverage for simulations + Convex actions and Playwright end-to-end suites.
- **Observability & analytics**: Emit structured telemetry events, dashboards, and error monitoring once wow flow stabilizes.
- **Production notifications**: Replace placeholder toasts with Convex-backed notification + Sonner integration.
- **Performance hardening**: Lazy-load heavy flows, add Suspense boundaries, and tune particle counts for low-end devices.
- **Content/system guardrails**: Flesh out copywriting review, legal/privacy checks, and Guardian audit exports prior to launch.
6. **Convex functions**
   - Implement queries/mutations: `earn.listChores`, `earn.submitProposal`, `earn.reviewSubmission`, `earn.confirmAllocation`, `earn.listAllowances`, `rewardVault.createFromMilestone`.
7. **Validation**
   - Unit tests for Zod schemas and TanStack Form integration.
   - Integration test ensuring allocation edits persist and ledger entries respect final splits.

## Phase 6 — Save & Goals
1. **Goals overview**
   - Grid of goal cards with progress rings, target info, and CTA to fund or transfer.
   - Provide `CreateGoalWizard` using `Dialog` + multi-step form (Shadcn `Tabs`).
2. **Goal detail drawer**
   - Show ledger using the shared TanStack Table wrapper, milestones timeline (vertical `ScrollArea` + badges).
3. **Transfers & locks**
   - Kid: `TransferDialog` with from/to selects, amount slider. If guardian lock exists, show locked state and route to Requests page to ask for unlock.
   - Guardian: Controls within goal drawer to lock/unlock with confirmation modal.
4. **Reward linkage**
   - On goal milestone, create `goal_events` and optional Reward Vault entry (driven by match policy). Present celebration animation plus vault call-to-action.
5. **Convex functions**
   - `goals.list`, `goals.create`, `goals.transfer`, `goals.toggleLock`, `goals.matchPolicies`, `rewardVault.createFromGoal`.
6. **Testing**
   - Unit tests for Zod schemas and goal automation previews.
   - Integration test verifying milestone celebration triggers both notification and vault entry; ensure lock prevents unauthorized transfers until approval.

## Phase 7 — Invest (Practice)
1. **Portfolio tab**
   - Overview card showing total balance, gain/loss (apply `status` badges).
   - Table of `investment_positions` with quantity, cost basis, simulated performance sparkline.
2. **Trade flow**
   - `PlaceOrderDrawer`: search security (combobox), choose buy/sell, quantity slider, confirm (shadcn `Dialog`).
   - Show gating banner if required lessons incomplete (`GuardedFeatureBanner`).
3. **Guardian oversight**
   - Approvals drawer: `InvestmentOrderCard` with accept/reject actions.
4. **Reward Vault integration**
   - Major investing milestones (first trade, weekly practice streak) trigger Reward Vault entries for virtual share IOUs. Portfolio view surfaces outstanding IOUs with explanation of future fulfillment.
5. **Watchlist**
   - `Card` grid of watchlist tickers with quick info; add/remove buttons.
6. **Market data worker**
   - Stand up `services/market-data-worker` that consumes the market-data adapter (Polygon or simulated) via the same `resolveProviders` helper, normalizes quote streams, and pushes updates into Convex or an SSE endpoint reusable by `useMarketQuotes`. Worker reads the `provider_configs` table (or env) to stay in sync with Convex.
7. **Convex functions**
   - `invest.listPositions`, `invest.listWatchlist`, `invest.submitOrder`, `invest.reviewOrder`, `invest.listOrders`, `rewardVault.createFromInvesting`, `marketData.ingestQuote`.
8. **Testing**
   - Unit tests for simulated fills, market-data adapter contract compliance, and vault IOU creation.
   - Playwright scenario for buy order submission -> pending approval -> guardian approval -> position update.

## Phase 8 — Spend & Credit
1. **Accounts summary**
   - Tile cards for debit & secured credit with limits/balance.
   - Show quick actions (freeze card, pay balance, request new card/limit change) as icon buttons; request actions call `requests.create` with appropriate type.
2. **Transactions ledger**
   - `Table` with filters (Needs/Wants toggles). Provide inline override (switch `Select` to change category).
3. **Round-up settings**
   - `Switch` tied to `nudge_enrollments` for round-up, save-as-you-spend.
4. **Credit payment flow**
   - `Dialog` for scheduling payment; preview ledger impact.
5. **Guardian controls**
   - Section exposing `card_controls` settings (limits, categories) with forms.
6. **Convex functions**
   - `spend.listCards`, `spend.updateControls`, `spend.logTransaction`, `spend.toggleNudge`, `requests.create` (card, limit).
7. **Testing**
   - Unit tests for needs/wants classifier adjustments.
   - Integration test verifying freeze card disables spend actions and triggers notification.

## Phase 9 — Donate
1. **Cause browser**
   - Grid/list of `preset_charities` with imagery badges (use `Card` + `Badge`).
   - Filter by category chips.
2. **Donation flow**
   - `DonateDialog` with amount slider, account selection.
   - Confirmation toast -> updates `donations` table & triggers celebration animation.
3. **Giving summary**
   - KPI showing giving percentage, timeline chart of donations.
4. **Guardian controls**
   - Whitelist toggle and cap slider per kid. Provide “Request donation approval” action for kids hitting cap, writing to `requests` (type `limit_change`).
5. **Reward tie-ins**
   - Optionally create Reward Vault entry when generosity milestones hit (e.g., 10% giving streak).
6. **Convex functions**
   - `donate.listCharities`, `donate.submitDonation`, `donate.updateWhitelist`, `donate.listDonations`, `rewardVault.createFromDonation`.

## Phase 10 — Automations (Money Map)
1. **Canvas**
   - Integrate `react-flow` with design-system theming; nodes styled per accent color.
   - Provide node palette (income, bucket, rule, account, nudge) with drag-and-drop add.
2. **Rule builder**
   - Right-side inspector using `Tabs` (`Conditions`, `Actions`, `Preview`).
   - Use `Command` palette for quick templates.
3. **Templates**
   - Template gallery modal pulling from `automation_templates`; “Apply” clones into user flow.
4. **Simulation**
   - Preview button triggers `automation.simulate` and displays `sheet` with results (list of `automation_execution_items`).
5. **Guardian oversight**
   - Approvals track `automation_flow_shares` and `requires_guardian_approval` toggles. Kid can send share invitation (requests entry auto-created) for guardian review.
6. **Reward tie-ins**
   - Long-running automation success (e.g., 4 weeks without missed allocation) can grant Reward Vault entry. Implement backend check that creates event + vault item.
7. **Convex functions**
   - `automation.listFlows`, `automation.saveFlow`, `automation.simulate`, `automation.activate`, `automation.share`, `automation.listExecutions`, `rewardVault.createFromAutomation`.

## Phase 11 — Learn, XP & Reward Vault Experience
1. **Lesson index**
   - Card grid showing lesson unlock status (`Badge` for locked). Include progress bars per module.
2. **Lesson viewer**
   - Stepper using `Tabs` for content, `Quiz` section with `RadioGroup` questions, reward summary (XP + possible vault entry).
3. **XP & streaks**
   - Dashboard widget showing XP meter, streaks, wealth ladder badge.
4. **Reward Vault page**
   - Dedicated route summarizing available, awaiting guardian, and fulfilled entries. Each card shows reward type (status, cosmetic, match, virtual stock IOU) with actions: claim, send reminder, mark fulfilled (guardian), add note.
   - Integrate `reward_vault_actions` to log acknowledgments and fulfillment.
5. **Cosmetic/perk unlocks**
   - Apply design-system friendly toggles (e.g., theme switcher) when a cosmetic vault item is available.
6. **Convex functions**
   - `learn.listLessons`, `learn.getLesson`, `learn.submitQuiz`, `learn.listProgress`, `rewardVault.listEntries`, `rewardVault.updateStatus`.

## Phase 12 — Requests & Approvals Workspaces
1. **Kid Requests page**
   - Table/list segmented by status; actions to withdraw or add comments.
   - Integrate quick links from Spend (card requests), Goals (unlock requests), Automations (share requests) for continuity.
   - Provide `Sheet` for request detail view.
2. **Guardian Approvals page**
   - Dashboard view with filters per subject type (Spend, Earn, Automations, Invest, Goals, Reward Vault commitments).
   - Bulk review using `Checkbox` selection + inline `Toolbar` actions.
   - Include quick access to outstanding Reward Vault entries needing fulfillment.
3. **Notifications integration**
   - Link “View Details” actions to open relevant modals/drawers, mark notifications as read.
4. **Convex functions**
   - `requests.listByKid`, `requests.listPending`, `requests.updateStatus`, `requests.addComment`, `rewardVault.listGuardianQueue`.

## Phase 13 — Settings & Household Admin
1. **Profile settings**
   - Tabs (`Profile`, `Preferences`, `Device Security`). Forms built with shared `FormField`.
2. **Household management**
   - Guardian view listing members, invite form (email, role). Manage guardian permissions.
3. **Nudge controls**
   - Combined view of all nudge enrollments per kid.
4. **Reward catalog management**
   - Guardians can view default Reward Catalog items, toggle availability, and add household-specific perks (e.g., “Family Movie Night”).
5. **Audit log viewer**
   - Table or timeline displaying `activity_log` entries, including Reward Vault actions.
6. **Convex functions**
   - `settings.updateProfile`, `settings.listMembers`, `settings.inviteGuardian`, `settings.setDevicePin`, `settings.listAuditLog`, `rewardCatalog.list`, `rewardCatalog.upsert`.

## Phase 14 — Notifications & Event Pipeline
1. **Event emitters**
   - Ensure every mutation writes to `household_events` with proper payload (including `reward.available` when vault entries unlock).
2. **Notification policies**
   - Implement backend action to translate events into `notifications` and `notification_recipients` using dedupe keys.
3. **Frontend subscription**
   - Add `useNotifications()` hook to stream unread notifications, show toasts via Sonner.
4. **Notification drawer**
   - Right-side sheet listing notifications, filtering by type (`Tabs`). Provide action chips per `action_type`.

## Phase 15 — Polishing & QA
1. **Responsive sweep**
   - Verify all major pages with breakpoints (mobile, tablet, desktop). Adjust layout using `Grid` + `flex` utilities.
2. **Accessibility pass**
   - Run automated tooling (axe) + manual keyboard navigation to ensure focus states, ARIA labels.
3. **Performance**
   - Optimize chart rendering (wrap in `Suspense`, lazy load heavy components).
   - Prefetch critical Convex queries on navigation.
4. **Content review**
   - Align copy with voice guidelines. Provide microcopy for tooltips, error states, Reward Vault explanations.
5. **Demo data seeding**
   - Finalize seeded accounts, transactions, lessons, missions, and sample Reward Vault entries for MVP demo.
---

Following these phases ensures a cohesive, design-system-driven web app that satisfies the MVP user stories, leverages the shared data model, and maintains consistency via reusable shadcn-based components while keeping the gamification model simple and transparent.
