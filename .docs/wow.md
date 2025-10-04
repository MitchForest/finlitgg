# Wow Moment Experience Plan

## Purpose & Guiding Principles
- Deliver an emotional "this is my money world" reveal that motivates students to continue onboarding before Phase 3 features ship.
- Keep the experience snackable (sub-3 minutes) while planting hooks for real account linking and wealth ladder progression.
- Showcase financial cause-and-effect in a playful, game-like environment that remains grounded in realistic projections.

## Experience Goals & Success Signals
- **Clarity**: Students instantly understand where their money lives and how it moves after answering a short intake.
- **Agency**: Every tweak (allocations, timeline shifts, scenarios) produces an obvious and satisfying response.
- **Aspirational Progression**: Wealth ladder milestones feel attainable and celebratory, not abstract.
- **Conversion**: End state nudges students toward linking accounts or saving their plan.

## Flow Breakdown
0. **Entry points**
   - First-run onboarding routes straight into the wow playground after auth; subsequent visits come from the sparkle/"Play" icon in the top bar or dashboard CTA.
   - Re-entry loads the last saved draft (if any) and offers quick access to other drafts or seeded scenarios.
1. **Guided Intake**
   - Four lightweight steps: accounts/balances → income streams → allocations → goals.
   - Conversational helper text and inline progress to keep energy up.
   - Store answers as structured objects for downstream projection.
2. **Money Map Reveal**
   - On submission, hero card peels away to unveil a React Flow canvas.
   - Accounts enter first (slide + pop), balances fill via animated bars, then allocation pods connect with flowing coin streams.
   - Intro caption: "This is YOUR financial world, visualized." 
3. **Time-Travel Simulation**
   - `Start Simulation` triggers monthly cycles: income nodes push animated particles into accounts, liabilities pull out with red gradients, investments grow with stretch animations.
   - Bottom timeline scrubber jumps from month 0 to 40-year horizon; age labels and milestones anchor time.
4. **Scenario Overlays**
   - Toggle chips apply overlays (20% APR, $200k loan, +5% donations, +5% savings).
   - Each overlay animates alternative paths atop the map + wealth ladder, with narrative callouts.
5. **Interactive Editing**
   - Sliders on allocation pods and handles on timeline income blocks allow direct manipulation.
   - Ripple animations propagate changes across connected nodes and the ladder.
6. **Final CTA**
   - Summary modal highlights unlocked wealth level, next milestone time, and invites account linking.
   - Offer options: `Save this plan`, `Request guardian approval`, `Link real accounts`, `Share with guardian` (placeholder stub until Phase 3).

## Wealth Ladder Integration
- **Vertical Rail**: Right-side ladder UI with Levels 0–5. Marker climbs as projections hit each rung; locks emit micro-celebrations (confetti burst + badge card).
- **Time-to-Level Chips**: Each rung shows projected time/age. Copy adjusts when out of reach (“At current pace you top out near $22M – add $300/mo to reach Level 5 sooner”).
- **Milestone Tasks**: Completion reveals contextual tips (complete investing lesson, set auto-transfer) that map to Phase 2 cards.
- **Progress Narrative**: Inline captions (“Shift 5% to Savings → Level 2 in 6y vs 9y”) reinforce cause/effect.
- **Replay Ready**: Wealth snapshots persist to `wealth_progress_snapshots` so the ladder looks identical when a kid relaunches the playground from the sparkle icon.

## Simulation Model
- **Inputs Collected**
  - Balances: checking, savings, credit, loans.
  - Income streams per timeline block (amount, frequency, tax/withhold settings optional later).
  - Allocation percentages across Needs/Wants/Savings/Invest/Donate.
  - Goal targets (name, amount, desired date, account).
  - Account partitions/pods mapped to spend + savings accounts (Needs, Wants, Vacation, etc.).
- **Derived Structures**
  ```ts
  type TimelineBlock = {
    startMonth: number; // offset from today
    endMonth: number;
    monthlyIncome: number;
    allocation: AllocationSchema;
    growthProfile: {
      hysaAPR?: number; // default 4%
      brokerageReturn?: number; // default 8% real
      debtAPR?: number; // per liability
    };
  };
  ```
- **Projection Logic**
  - Run monthly loop across blocks, compounding balances and goals.
  - Wealth ladder thresholds evaluate against net worth trajectory.
  - Scenario overlays adjust growthProfile deltas and recompute derived curves.
- **Automation alignment**
  - Playground drafts serialize into `automation_flows` + `automation_nodes` so the same data structure powers both simulations and live automations.
- **Assumptions Surface**
  - Panel lists baseline rates (HYSA 4%, Brokerage 8%); toggles allow quick pessimistic/optimistic adjustments.
- **Scenario Library**
  - Seed automation templates with `scenario_type` (`baseline`, `stress_test`, `custom`) to populate overlay options without altering canonical plans.

## Interaction & Animation System
- **Scene Phases**: `enter` (intake → reveal), `cycle` (monthly loop), `branch` (scenario overlays), `celebrate` (milestones).
- **Node Treatments**
  - Income nodes: breathing glow synced to cycle start.
  - Accounts: progress masks fill; overflow triggers shimmer.
  - Liabilities: negative pulses; when paid off, animate lock breaking.
  - Goals: grow ring thickness as funding % increases; 100% triggers confetti.
- **Edge Motion**
  - SVG paths with gradient strokes; masked coin sprites or particle shader for flow direction.
  - Repeat animations tuned to `flowRate` magnitude to signal relative cash volume.
- **Accessibility & Reduced Motion**
  - Provide textual narration area and toggle to swap particles for gradient overlays.

## Technical Approach
- **Prototype (Phase 2.5 Playground)**
  - Start client-side to nail motion timing and UX copy; mirror the eventual `automation_flows`/`automation_nodes` shape in local state so the swap to Convex is mechanical.
  - Use React Flow for graph layout, Framer Motion for transitions, Zustand or React state hooks for intake + scenario state.
  - All data derived locally from intake answers + seeded scenario templates; timeline editor uses controlled components.
  - Fire-and-forget analytics events (if desired) via existing telemetry pattern.
- **Future Integration (Phase 3+)**
  - Persist drafts to `automation_flows` (`flow_kind = 'wow_onboarding'`), nodes/edges to `automation_nodes`/`automation_edges`, partitions to `account_partitions`, and projections to `wealth_progress_snapshots`.
  - Use Convex actions to run `simulations.previewFlow`, stash results, and create `requests` of type `wow_plan` for guardian review.
  - Rely solely on `convex/react` hooks for data access; memoize heavy client computations locally without layering TanStack Query on top.

### React Query vs Convex Hooks
- Convex already ships `useQuery`, `useMutation`, and `useAction` tailored to its reactive model; stacking TanStack Query on top adds avoidable complexity.
- For the early prototype derive state locally; once Convex backs the flow, lean entirely on native hooks for live updates.
- TanStack Query stays optional for strictly client-only caches (e.g., memoizing chart transforms), but avoid duplicating remote data fetching layers.

### Backend Necessity Assessment
- **Playground Goal**: deliver the wow reveal quickly while keeping iteration fast — short term we can stub persistence locally.
- **Required for launch**: to support replay, guardian approvals, and wealth ladder continuity, wire Convex persistence (accounts, partitions, drafts, approvals) before shipping broadly.

## Implementation Roadmap
1. **Experience Sprint (Design)**
   - Storyboard key beats, validate copy with kid persona, finalize Figma frames (desktop + mobile + reduced motion).
2. **Prototype Sprint (Front-End)**
   - Scaffold React Flow canvas, implement intake wizard, stub timeline editor, integrate animation phases, ensure reduced motion fallback.
3. **Playtesting & Polish**
   - Run 3–5 user walkthroughs, tune pacing, add sound design hooks, refine microcopy.
4. **Phase 3 Bridge**
   - Land Convex schema migrations, wire draft persistence + approvals, seed baseline/stress scenarios, and hook sparkle re-entry to saved drafts.

## Open Questions
- Do we attach analytics to measure drop-off at each step of the wow flow?
- Should we expose guardian co-view mode in the playground or keep it student-only until Phase 3?
- What’s the minimum CTA implementation we need before go-to-market (email capture vs full auth)?

---
**Recommendation**: Prototype the wow playground with client-only scaffolding to refine the experience, then lock in Convex persistence (drafts, partitions, snapshots, approvals) before launch so replay, coaching, and wealth ladder tracking stay consistent across sessions.
