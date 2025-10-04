# finlit.gg MVP User Stories

## Cross-Persona (App Shell & Global)

### Navigation & Wayfinding
- As any household member, I want a consistent sidebar of core money areas (Dashboard, Earn, Save, Invest, Spend, Donate, Automations, Learn, Settings) so that I always know where to go next.
- As a Kid, I want a dedicated `Requests` entry in the sidebar so that I can review the status of everything awaiting guardian action without hunting for it.
- As a Guardian, I want a dedicated `Approvals` entry in the sidebar so that I can batch-review all pending chores, purchases, automations, and requests in one place.
- As any signed-in user, I want the top bar to surface profile actions, streak/XP progress, search, and notifications so that I can quickly access global features without leaving my current page.
- As any signed-in user, I want a sparkle/"Play" control in the top bar that relaunches the wow onboarding flow so that I can revisit my money map simulation on demand.

### Notifications & Activity
- As any user, I want a unified notifications drawer that groups reminders, approvals, and nudges so that I can triage important actions from anywhere in the app.
- As any user, I want real-time toasts for critical events (allocation executed, goal milestone hit, request approved/denied) so that I get immediate feedback after taking an action.

### Household Context & Access Control
- As a household member, I want the header to display my household name so that it is always clear which family organization I am acting on behalf of.
- As a Guardian, I want to see and manage every Kid in my household from a single place so that I can support each child without switching contexts.
- As a Kid, I want access limited to my own accounts, goals, and history so that I can focus on my personal progress and maintain privacy.
- As a user, I want to understand feature availability (e.g., investing locked until a lesson is completed) so that expectations are clear and I know how to unlock more autonomy.

## Kid Persona

### Dashboard
- As a Kid, I want a wealth ladder card that shows my current level, next milestone, and suggested actions so that I stay motivated to progress.
- As a Kid, I want a snapshot of my balances across Save, Invest, Spend, and Donate so that I understand where my money is sitting at a glance.
- As a Kid, I want actionable reminders (finish a lesson, fund a goal, pay off a credit balance) so that I know what to do next to stay on track.
- As a Kid, I want a compound interest visualizer where I can tweak deposit amount and frequency so that I can see how small changes affect long-term goals.
- As a Kid, I want to see pending requests or approvals I initiated so that I have transparency on what still needs guardian action.

### Wow Playground (Money Map)
- As a Kid, I want my first-run onboarding to land in an animated money map so that I immediately see how my world of money fits together.
- As a Kid, I want to add or edit income sources, deposit accounts, investment accounts, liabilities, and destination nodes inside the playground so that my simulation reflects real life.
- As a Kid, I want to define buckets/pods under spend and savings accounts (Needs, Wants, Vacation, etc.) so that I can direct money with intent.
- As a Kid, I want to adjust allocations, timeline segments, and automation rules and watch the wealth ladder update instantly so that I understand cause and effect.
- As a Kid, I want to apply pre-made “what if” scenario overlays (e.g., $200k student loan, 20% APR card, expensive rent) so that I can explore risky decisions in a safe space.
- As a Kid, I want to save a playground run as a draft that I can reopen from the sparkle icon so that my work isn’t lost between sessions.
- As a Kid, I want to request guardian approval to convert a draft plan into real accounts or automations so that I can act on my ideas with proper guardrails.

### Earn
- As a Kid, I want to browse available chores and missions with rewards so that I can pick how I earn money or XP.
- As a Kid, I want to submit proof or completion notes for a chore so that my guardian can verify and reward me.
- As a Kid, I want to propose new earn opportunities (e.g., extra chore or TimeBack idea) so that I can negotiate how to earn more autonomy.
- As a Kid, I want to see streak bonuses and multipliers so that I stay consistent with my commitments.
- As a Kid, I want to review the suggested allocation of new earnings before it posts so that I can tweak how much goes to each bucket.

### Save (Goals)
- As a Kid, I want to create savings goals with targets and due dates so that I can plan for things I care about.
- As a Kid, I want to assign automatic allocation percentages from incoming money to each goal so that saving happens without extra steps.
- As a Kid, I want to move money between my goals or the main savings account when priorities change so that I stay in control.
- As a Kid, I want celebratory feedback when I hit goal milestones (25%, 50%, 100%) so that saving feels rewarding.

### Invest (Practice UTMA)
- As a Kid, I want to view a simulated portfolio with current holdings, performance snapshots, and watchlist so that I can learn investing mechanics safely.
- As a Kid, I want to place simulated buy or sell orders for fractional shares after completing required lessons so that I learn by doing.
- As a Kid, I want to earn virtual share IOUs for major milestones so that I can see how future real investing rewards might work.

### Spend & Credit
- As a Kid, I want to view my virtual debit and secured credit cards with available balance and limits so that I know how much I can spend responsibly.
- As a Kid, I want to categorize transactions as needs or wants (or adjust suggestions) so that I build budgeting habits.
- As a Kid, I want to trigger round-up or save-as-you-spend automations so that everyday spending still moves me toward goals.
- As a Kid, I want to schedule or make simulated credit payments so that I practice healthy credit behavior.
- As a Kid, I want to review detailed transaction history per account so that I can understand how my balances changed over time.

### Donate
- As a Kid, I want to browse a curated list of causes, see impact blurbs, and donate portions of my balance so that giving is intentional and informed.
- As a Kid, I want to track my giving percentage relative to earnings so that I can see progress toward generosity goals.

### Automations (Money Map)
- As a Kid, I want to drag-and-drop nodes that route income into save/spend/invest/donate buckets so that I design my own money plan.
- As a Kid, I want to preview the outcome of a rule before saving it so that I trust the automation.
- As a Kid, I want templates like 50/30/20 or Save-First to jumpstart my automations so that getting started feels easy.
- As a Kid, I want to run a simulation on demand to see what would have happened with recent income so that I build intuition about my rules.

### Learn & Growth
- As a Kid, I want short lessons tied to the actions I am attempting (e.g., credit usage) so that the learning is contextual.
- As a Kid, I want quick quizzes that reward XP and sometimes add items to my Reward Vault so that learning feels rewarding and shapes future perks.
- As a Kid, I want to track my XP, badges, and streaks so that I can measure my growth over time.
- As a Kid, I want to view my Reward Vault, understand which perks are cosmetic versus future monetary IOUs, and see what actions will unlock the next item so that the system stays motivating and transparent.

### Settings & Requests
- As a Kid, I want to request changes (new card, higher limit, automation approval) and track their status so that I feel heard and informed.
- As a Kid, I want to adjust personal preferences (avatar, notification settings, nudge enrollment) within allowed guardrails so that the app reflects my style while staying safe.

## Guardian Persona

### Dashboard
- As a Guardian, I want a household overview showing each child’s wealth ladder status, recent wins, outstanding alerts, and Reward Vault commitments so that I can quickly gauge who needs support.
- As a Guardian, I want to see queued approvals (chores, purchases, automations, card requests) so that I can act without digging through pages.
- As a Guardian, I want suggested nudges or conversations (e.g., “Celebrate goal completion”) so that I can reinforce good habits.

### Earn Oversight
- As a Guardian, I want to assign chores or missions with rewards and recurrence so that I can structure how my child earns.
- As a Guardian, I want to review submissions with evidence and approve or reject them so that rewards remain accountable.
- As a Guardian, I want to set allowances or TimeBack payouts with automatic scheduling so that I can model consistent income.
- As a Guardian, I want to view upcoming allowance runs and adjust or skip a payment so that I maintain flexibility when circumstances change.

### Save & Goal Matching
- As a Guardian, I want to approve or adjust new savings goals so that targets align with household guardrails.
- As a Guardian, I want to configure matching rules or boosts when goals are met so that I can incentivize long-term behavior.
- As a Guardian, I want to lock certain goals (college fund) from withdrawals so that protected savings stay intact.
- As a Guardian, I want access to each kid’s savings ledger so that I can audit transfers and spot coaching moments.

### Invest Controls
- As a Guardian, I want to gate investing actions behind completion of required lessons so that my child understands the basics first.
- As a Guardian, I want to review pending simulated trades or set trade size limits so that I can moderate risk exposure.
- As a Guardian, I want visibility into the practice portfolio and any virtual share IOUs promised so that I can plan future real-world fulfillment.

### Spend & Credit Guardrails
- As a Guardian, I want to set spending limits, allowed categories, and merchant restrictions for each virtual card so that spending stays within agreed boundaries.
- As a Guardian, I want to receive approval requests for large or out-of-policy purchases so that I can intervene before bad habits form.
- As a Guardian, I want to manage secured credit card settings (limit, payment reminders) so that I teach credit safely.
- As a Guardian, I want to review per-account transaction history so that I can spot trends and guide better decisions.

### Donate Guidance
- As a Guardian, I want to whitelist or recommend charities and set donation caps so that giving aligns with household values.
- As a Guardian, I want to see donation history and prompts to discuss generosity milestones so that we celebrate together.

### Automations Oversight
- As a Guardian, I want to review, approve, or lock automations created by my child so that I ensure money flows stay responsible.
- As a Guardian, I want to see wow playground plan submissions with projected wealth ladder milestones so that I can assess the long-term impact before activating anything.
- As a Guardian, I want to return a plan with inline comments or requested changes so that my child can iterate while staying autonomous.
- As a Guardian, I want to clone or share automation templates with my child so that I can teach best practices hands-on.
- As a Guardian, I want to audit the log of automation executions so that I know when adjustments are needed.

### Learn & Coaching
- As a Guardian, I want to assign required lessons or missions for unlocking new privileges so that learning precedes autonomy.
- As a Guardian, I want insights into lesson completion, quiz scores, XP trends, and Reward Vault entries so that I can celebrate progress or set expectations for future fulfillment.
- As a Guardian, I want recommendations for conversation starters tied to events (first credit payment, completed donation) so that I reinforce teachable moments.

### Reward Vault Fulfillment & Catalog
- As a Guardian, I want to review outstanding Reward Vault entries, mark which ones I will fulfill now versus later, and log when fulfillment happens so that the promises stay transparent.
- As a Guardian, I want to customize the Reward Vault catalog for my household (add perks, toggle defaults, define match amounts) so that incentives reflect our family values and budget.

### Nudges & Automations Controls
- As a Guardian, I want to enable, pause, or adjust nudges like round-up and save-as-you-spend for each child so that automated behaviors align with our agreements.

### Approvals Workspace
- As a Guardian, I want an approvals workspace that aggregates pending chores, spending requests, automations, investment orders, goal transfers, and Reward Vault commitments so that I can clear the queue efficiently.
- As a Guardian, I want wow plan drafts to surface alongside other approvals with a quick summary (net worth, time-to-next-level) so that I can prioritize which proposals to review first.
- As a Guardian, I want bulk actions (approve, deny, send feedback) across related items so that I reduce repetitive work.

### Settings & Household Admin
- As a Guardian, I want to manage household members, invite other guardians, and adjust permissions so that the family organization stays accurate.
- As a Guardian, I want to configure notification preferences per channel and per child so that I get the right signal without overwhelm.
- As a Guardian, I want access to audit trails (who approved what, when) so that accountability is clear.
- As a Guardian, I want to manage device security (PIN, biometrics) for my child’s access so that safety remains high while encouraging independence.
