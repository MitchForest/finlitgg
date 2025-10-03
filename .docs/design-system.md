# finlit.gg Design System (MVP)

This design system translates the soft, rounded fintech aesthetic from `.docs/dashboard-ui.webp` / `.docs/mobile-ui.webp` into a cohesive language for both Kid and Guardian experiences.

## 1. Brand Personality
- **Voice:** Encouraging, mentor-like, never condescending. Use action verbs and celebrate progress ("Nice momentum!" rather than "Good job").
- **Tone by Persona:** Kid surfaces skew playful and motivational; Guardian views emphasize clarity and trust with restrained copy.
- **Visual Mood:** Friendly, modern, and gamified. Rounded geometry, soft neutrals, and pastel accents keep money topics approachable while maintaining credibility.

## 2. Color System
### Neutral Foundation
| Token | Hex | Usage |
| --- | --- | --- |
| `neutral.0` | #F8F5EE | Primary app background |
| `neutral.50` | #EFE9DD | Card backgrounds, secondary panels |
| `neutral.200` | #DED7CA | Divider fills, subtle highlights |
| `neutral.700` | #3C3A36 | Default text on light surfaces |
| `neutral.900` | #1F1E1B | Sidebar/headers, high-contrast text |

### Accent Pastels
| Token | Hex | Usage |
| --- | --- | --- |
| `accent.balance` | #C9D3B0 | Save/Balances, positive deltas |
| `accent.earn` | #F0CE6E | Earnings, reminders |
| `accent.invest` | #B8B4FF | Investing, learning prompts |
| `accent.spend` | #EDC7A5 | Spending, needs vs wants |
| `accent.donate` | #F3BBD0 | Giving, generosity badges |
| `accent.upgrade` | #9F8CFF | Upsell, premium moments |

### Feedback & Status
| Token | Hex | Usage |
| --- | --- | --- |
| `status.success` | #59B37B | Confirmation toasts, success chips |
| `status.warning` | #E8A552 | Nudges, approvals pending |
| `status.error` | #D36166 | Hard stops, declined approvals |
| `status.info` | #76A7E0 | Tutorials, insights |

### Dark Mode Seeds (future state)
Mirror tokens shift toward deeper olives/ochres; maintain the same accent hues with slightly higher saturation.

## 3. Typography
- **Primary Typeface:** `Poppins` or `DM Sans` (geometric sans, good legibility)
- **Fallback Stack:** `"Poppins", "DM Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Hierarchy**
  - Display / KPI: 44px / 52 line, weight 600 (used for large balances)
  - H1: 32px / 40 line, weight 600
  - H2: 24px / 32 line, weight 600
  - H3: 20px / 28 line, weight 500
  - Body L: 18px / 26 line, weight 400 (long copy, explanatory text)
  - Body M: 16px / 24 line, weight 400 (default body)
  - Body S: 14px / 22 line, weight 400 (metadata, table labels)
  - Micro / Overline: 12px / 18 line, letter spacing 0.08em, weight 500 (status pills)
- **Numeric Display:** Use tabular lining variants for balances (`font-variant-numeric: tabular-nums;`).

## 4. Spacing & Layout
- **Spacing Scale (px):** `4, 8, 12, 16, 20, 24, 32, 40, 48, 64` (alias as `spacing.xs` through `spacing.4xl`).
- **Grid:** Desktop uses 12-column, 80px gutters within 1280–1440 container. Mobile uses 4-column with 16px gutters.
- **Card Radii:** Large cards `24px`; form inputs and buttons `16px`; badges `999px` (fully rounded).
- **Shadow Tokens:**
  - `shadow.raised`: `0 12px 35px rgba(31, 30, 27, 0.06)` for KPI cards.
  - `shadow.float`: `0 20px 40px rgba(31, 30, 27, 0.12)` for modals or callouts.
  - Use soft ambient shadows; avoid hard outlines.

## 5. Components
### 5.1 Shell & Navigation
- **Sidebar (Guardian)**: Dark neutral gradient (#1F1E1B → #2B2824). Icons housed in 48px circles; active item uses accent dot + light text.
- **Sidebar (Kid)**: Same structure, but accent backgrounds lighten (#DED7CA) with bouncy icon illustrations.
- **Top Bar:** 72px tall; includes search pill, XP meter, notifications button, profile chip.
- **Bottom Nav (Mobile):** Rounded pill 72px height, floating 16px from bottom, contrasting dark background with luminous accent dots for active state.

### 5.2 Cards & Surfaces
- **KPI Card:** Icon chip (32px) top-left, metric, sparkline/summary, accent background gradient (e.g., `accent.balance` → white). Add `+17%` pill using micro typography.
- **List Card:** Profile avatar 40px, primary text Body M, secondary Body S, right-aligned amount (colored by status).
- **Segmented Stats Card:** 3-column layout with vertical separators (1px neutral.200 overlay) for quick comparison.

### 5.3 Buttons & Controls
- **Primary Button:** Rounded pill, 16px padding, background `neutral.900`, text white. Hover darkens by 8%.
- **Secondary Button:** Fill `neutral.200`, text `neutral.900`.
- **Accent CTA:** Use relevant domain accent + white text (e.g., Money Map "Launch" in `accent.invest`).
- **Icon Button:** Circular 48px; use for floating quick actions (Add Goal, Start Automation).

### 5.4 Forms
- **Inputs:** 16px padding, radius 16px, border `1px solid rgba(31,30,27,0.08)`, focus ring `0 0 0 2px rgba(159,140,255,0.35)`.
- **Selects:** Use top-of-card overlays with accent icons (e.g., Account badges). 
- **Toggle Switches:** Capsule switches with colored fill = accent of domain (Save = sage, Invest = lavender).

### 5.5 Charts & Data Viz
- **Sparklines:** 1.5px stroke, accent color matching card domain, background wave (20% opacity).
- **Bar Charts:** Rounded bar tops; stacked view for needs vs wants. Axis labels Body S.
- **Donut Charts:** Centered total with Display weight; segments adopt accent palette; label tags float outside with connector lines.
- **Progress Rings:** For goal milestones, ring thickness 10px, base `neutral.200`, progress accent.

### 5.6 Notifications & Toasts
- Card panel slides from right; each item uses icon circle tinted to severity. Action chips (Approve, View) use `accent.upgrade` or domain accent. Toasts float bottom-right (desktop) / top-of-screen (mobile).

### 5.7 Modals & Drawers
- **Approvals Drawer:** Right-hand sheet 480px wide, header with request summary, body uses stacked cards per item, sticky action footer.
- **Money Map Canvas:** White canvas with dotted background overlays. Nodes use accent-coded pills; each node card has icon, label, and quick stats.

### 5.8 Gamification Elements
- **XP Meter:** Horizontal gradient bar (lavender → accent.upgrade) with marker dot and "Next Badge" text.
- **Badges:** Circular 80px medallions, embossed effect using dual shadow (lighter top, darker bottom). Use emotive iconography.
- **Loot Tickets:** Small pill chips with ticket icon, background `accent.upgrade` at 16% opacity, text `accent.upgrade` 100%.

### 5.9 Tables & Ledgers
- **Ledger Rows:** zebra using `neutral.0` / `neutral.50`, sticky header, 12px vertical padding. Amount column right-aligned, color-coded (positive green, negative `neutral.900` at 70% opacity).
- **Responsive:** On mobile collapse to stacked cards showing primary info first.

## 6. Iconography & Illustration
- Icons outlined at 1.5px stroke with rounded corners. Prefer duotone icons (neutral base + accent fill).
- Avatar placeholders: simple shapes with accent backgrounds and white initials.
- Money Map uses playful icon metaphors (piggy bank, rocket, heart, lightbulb).

## 7. Imagery & Media
- Guardian hero imagery can use monochrome photography with soft gradient overlays.
- Kid contexts lean into illustrated avatars or sticker-like imagery to stay COPPA-friendly (avoid real child photos without consent).

## 8. Motion & Interaction
- **Timing:** 200ms ease-out for hover fades; 280ms ease-in-out for modal/drawer transitions.
- **Micro-interactions:** Loot box opening uses slight scale + confetti burst (cap at 600 particles for perf). Money Map node snaps with spring (stiffness 180, damping 18).
- **Feedback:** Approvals animate with quick check/fail icon morph (120ms).

## 9. Accessibility
- Maintain contrast: text on accent backgrounds ≥ 4.5:1; adjust accent brightness as needed.
- Provide toggle to reduce animation. XP meter and other progress visuals require text equivalents.
- Icon-only buttons must include accessible labels (ARIA).

## 10. Implementation Notes
- Map tokens into `packages/design` (Tailwind/Sass variables, theme JSON).
- Provide light/dark theme tokens from inception so future mode switch is straightforward.
- Create Storybook entries for all components, including persona variants (Kid vs Guardian).
- Document data-driven states: e.g., KPI card states `positive`, `neutral`, `negative` controlling chip color and icon.

This system keeps the demo’s UI cohesive and extendable while matching the inspiration mood—soft, confident, and playful enough for kids yet credible for guardians.
