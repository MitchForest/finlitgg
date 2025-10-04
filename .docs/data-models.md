# finlit.gg MVP Data Model

This schema maps directly to the MVP user stories in `.docs/user-stories.md`. Each table supports specific feature flows for Kids and Guardians inside a single-household organization.

## 1. Identity & Access Control

### households
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | Primary key |
| name | text | Household/org display name |
| invite_code | text unique | Optional short code for onboarding guardians |
| timezone | text | Default timezone for scheduling automations, allowances |
| created_at | timestamptz | Record creation |

### users
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | Mirrors auth provider ID |
| household_id | uuid FK -> households.id | Enforces single-household membership |
| email | text unique | Login identifier for guardians; optional for kids |
| global_role | enum(`guardian`,`kid`) | Top-level persona used for access decisions |
| status | enum(`active`,`invited`,`disabled`) | Lifecycle state |
| created_at | timestamptz | |
| last_login_at | timestamptz | |

### profiles
| Column | Type | Notes |
| --- | --- | --- |
| user_id | uuid PK/FK -> users.id | One-to-one profile |
| display_name | text | Preferred name shown in UI |
| avatar_url | text | Optional |
| date_of_birth | date | Supports age-aware guardrails |
| pronouns | text | Optional personalization |
| xp_level | integer | Derived level for streak display |
| feature_flags | jsonb | Client-side toggles, per user |

### guardian_child_settings
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| guardian_id | uuid FK -> users.id | Must be `guardian` role |
| kid_id | uuid FK -> users.id | Must be `kid` role, same household |
| permissions | jsonb | Overrides (e.g., allow investing) |
| notification_prefs | jsonb | Channel-specific overrides |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### device_security
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| user_id | uuid FK -> users.id | |
| pin_hash | text | Optional per-device PIN |
| biometric_enabled | boolean | Mirrors guardian-configured device control |
| last_rotated_at | timestamptz | |

**Relationships**
- Each `user` belongs to exactly one `household` (user stories: single-org membership, guardian sees all kids in household).
- `guardian_child_settings` allows guardians to manage guardrails per kid.
- `device_security` supports guardian ability to manage device access.

## 2. Financial Core (Accounts, Transactions, Ledgers)

### accounts
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| owner_user_id | uuid FK -> users.id nullable | Kid-specific accounts reference the kid; null for household pooled funds |
| type | enum(`save`,`invest`,`spend`,`donate`,`liability`,`external_destination`) | Matches sidebar domains and React Flow node categories |
| account_subtype | enum(`checking`,`hysa`,`brokerage`,`custodial_brokerage`,`education_savings`,`credit_card`,`student_loan`,`personal_loan`,`donation_pool`,`external_destination`) | Helps the playground distinguish deposit, investment, liability, and payout endpoints |
| scope | enum(`kid`,`household`) | Controls visibility |
| name | text | Display label |
| status | enum(`active`,`archived`) | |
| balance_cents | bigint | Cached current balance |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### transactions
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| account_id | uuid FK -> accounts.id | |
| initiating_user_id | uuid FK -> users.id | Kid or guardian who triggered the entry |
| related_event_id | uuid FK -> household_events.id nullable | Links to earn events, automation executions, etc. |
| request_id | uuid FK -> requests.id nullable | Ties to approvals when applicable |
| amount_cents | bigint | Positive = credit (money in), negative = debit |
| category | enum(`income`,`transfer`,`spend`,`donate`,`goal`,`automation`,`nudge`) | For reporting |
| merchant | text nullable | For spend transactions |
| memo | text | Notes surfaced in ledgers |
| occurred_at | timestamptz | |
| created_at | timestamptz | |

### transaction_splits
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| transaction_id | uuid FK -> transactions.id | |
| split_type | enum(`need`,`want`,`goal`,`round_up`,`credit_payment`) | Supports needs vs wants coach and goal allocations |
| goal_id | uuid FK -> goals.id nullable | Direct linkage to a goal |
| amount_cents | bigint | |

### account_snapshots
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| account_id | uuid FK -> accounts.id | |
| balance_cents | bigint | Balance at snapshot time |
| captured_at | timestamptz | Used for dashboard spark lines |

### account_partitions
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| account_id | uuid FK -> accounts.id | Parent checking/savings/spend/liability account |
| name | text | Display label (Needs, Wants, Vacation, etc.) |
| partition_type | enum(`budget`,`goal`,`donation`,`debt`) | Determines UI treatment and default animations |
| target_allocation_pct | numeric nullable | Optional % of incoming funds earmarked for this partition |
| balance_cents | bigint | Running balance for simulation + live spend |
| goal_id | uuid FK -> goals.id nullable | Links savings partitions to formal goals |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### virtual_cards
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| account_id | uuid FK -> accounts.id | Spend/credit accounts |
| partition_id | uuid FK -> account_partitions.id nullable | Optional link to specific bucket/pod |
| kid_id | uuid FK -> users.id | Owner of the card |
| card_type | enum(`debit`,`secured_credit`) | |
| status | enum(`active`,`frozen`,`canceled`) | Supports guardian actions |
| last_four | text | Display for kids |
| daily_limit_cents | bigint | Guardian-configured |
| monthly_limit_cents | bigint | Guardian-configured |
| round_up_enabled | boolean | For nudge enrollment |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### card_controls
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| card_id | uuid FK -> virtual_cards.id | |
| allowed_categories | text[] | Guardian-selected merchant categories |
| blocked_merchants | text[] | Optional list |
| approval_threshold_cents | bigint | Purchases above require approval |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### wealth_progress_snapshots
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| kid_id | uuid FK -> users.id | Owner of the projection |
| flow_id | uuid FK -> automation_flows.id nullable | Draft or production flow used for this projection |
| captured_at | timestamptz | When the snapshot was generated (real or simulated time) |
| net_worth_cents | bigint | Aggregate of assets minus liabilities |
| wealth_level | integer | Current ladder rung index |
| next_level_target_cents | bigint | Amount required for next rung |
| months_to_next_level | integer nullable | Projection horizon; null when already at top rung |
| snapshot_source | enum(`actual`,`simulation_preview`) | Distinguishes live data from wow playground previews |

**Relationships**
- `transactions` fuel wealth ladder and dashboards for both personas.
- `transaction_splits` power needs vs wants coaching and goal funding analytics.
- `account_partitions` model the buckets/pods surfaced in the wow flow and power allocations + ripple animations.
- `virtual_cards` + `card_controls` implement spend and credit guardrail stories, optionally scoped to a partition.
- `wealth_progress_snapshots` cache ladder progression for dashboards and replaying wow simulations.

## 3. Earn, Allowances & Income Events

### chores
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| title | text | |
| description | text | |
| reward_cents | bigint | |
| reward_xp | integer | Gamification tie-in |
| cadence | enum(`one_time`,`daily`,`weekly`,`monthly`,`custom`) | |
| requires_proof | boolean | |
| created_by_guardian_id | uuid FK -> users.id | |
| created_at | timestamptz | |

### chore_assignments
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| chore_id | uuid FK -> chores.id | |
| kid_id | uuid FK -> users.id | |
| due_at | timestamptz | |
| status | enum(`assigned`,`submitted`,`approved`,`rejected`,`expired`) | Tracks guardian approvals |
| submission_notes | text | Kid’s proof |
| submission_media | text[] | Evidence references |
| reviewed_by | uuid FK -> users.id nullable | Guardian reviewer |
| reviewed_at | timestamptz nullable | |
| created_at | timestamptz | |

### earn_proposals
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| kid_id | uuid FK -> users.id | Initiator |
| title | text | Proposed task or gig |
| description | text | Kid’s pitch |
| requested_reward_cents | bigint | |
| requested_reward_xp | integer | Optional XP ask |
| status | enum(`pending`,`approved`,`declined`,`converted`) | Converted when promoted to chore/mission |
| guardian_response_id | uuid FK -> approval_actions.id nullable | Trace approval |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### earn_events
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| kid_id | uuid FK -> users.id | |
| source_type | enum(`chore`,`timeback`,`allowance`,`parent_transfer`,`mission`) | |
| source_id | uuid nullable | Links to chore assignment, allowance run, etc. |
| amount_cents | bigint | |
| xp_awarded | integer | |
| auto_allocation_json | jsonb | Snapshot of suggested splits for review |
| status | enum(`pending_review`,`awaiting_guardian`,`applied`) | Supports allocation review stories |
| created_at | timestamptz | |
| applied_at | timestamptz nullable | |

### allowances
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| kid_id | uuid FK -> users.id | |
| amount_cents | bigint | |
| cadence | enum(`weekly`,`biweekly`,`monthly`,`custom`) | |
| next_run_at | timestamptz | For upcoming allowance visibility |
| status | enum(`active`,`paused`,`ended`) | |
| created_by | uuid FK -> users.id | Guardian establishing the allowance |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### allowance_runs
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| allowance_id | uuid FK -> allowances.id | |
| scheduled_for | timestamptz | |
| status | enum(`scheduled`,`processing`,`completed`,`skipped`) | Guardians can skip |
| amount_cents | bigint | |
| processed_at | timestamptz nullable | |
| notes | text | Reason for skip/adjustment |

### missions
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| title | text | TimeBound challenges or Alpha XP |
| description | text | |
| reward_type | enum(`cash`,`xp`) | Missions reinforce money + XP only |
| reward_value | integer | Value in cents or XP |
| reward_vault_catalog_id | uuid FK -> reward_catalog.id nullable | Optional vault entry |
| expires_at | timestamptz nullable | |
| created_by | uuid FK -> users.id | |

### mission_progress
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| mission_id | uuid FK -> missions.id | |
| kid_id | uuid FK -> users.id | |
| status | enum(`active`,`submitted`,`approved`,`completed`,`expired`) | |
| completion_notes | text | |
| reward_granted_at | timestamptz nullable | |

**Relationships**
- `earn_proposals` + `requests` (type `earn_proposal`) capture the kid pitch and guardian approval loop.
- `earn_events` feed into transactions via automations after kid review/guardian approval.
- `allowances` + `allowance_runs` support guardian visibility and flexibility over schedules.
- `missions` align with Alpha XP/timeback narratives and optionally grant Reward Vault items.

## 4. Goals & Savings

### goals
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| owner_user_id | uuid FK -> users.id | Kid who owns the goal |
| account_id | uuid FK -> accounts.id | Typically the Save account |
| name | text | |
| target_cents | bigint | |
| target_date | date nullable | |
| status | enum(`active`,`achieved`,`archived`) | |
| locked_by_guardian_id | uuid FK -> users.id nullable | Guardian lock story |
| auto_allocation_pct | numeric | Default split for new income |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### goal_events
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| goal_id | uuid FK -> goals.id | |
| event_type | enum(`funded`,`withdrawn`,`milestone_25`,`milestone_50`,`milestone_100`,`match_applied`) | Supports celebration triggers |
| amount_cents | bigint nullable | |
| triggered_by | uuid FK -> users.id | Kid or guardian |
| occurred_at | timestamptz | |
| metadata | jsonb | Confetti/reward context |

### goal_transfers
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| from_goal_id | uuid FK -> goals.id nullable | Null when moving from base savings |
| to_goal_id | uuid FK -> goals.id nullable | Null when moving to base savings |
| kid_id | uuid FK -> users.id | Owner initiating |
| amount_cents | bigint | |
| initiated_by | uuid FK -> users.id | Kid or guardian |
| request_id | uuid FK -> requests.id nullable | Guardian approval when required |
| created_at | timestamptz | |

### goal_match_policies
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| guardian_id | uuid FK -> users.id | Configured by guardian |
| goal_id | uuid FK -> goals.id nullable | Apply to specific goal or general |
| trigger_type | enum(`milestone`,`periodic`) | |
| trigger_value | numeric | e.g., milestone percent |
| match_pct | numeric | Percent match |
| max_match_cents | bigint nullable | |
| reward_catalog_id | uuid FK -> reward_catalog.id nullable | Auto-create vault entry when triggered |
| created_at | timestamptz | |

**Relationships**
- `goal_transfers` and `goal_events` support kid-initiated adjustments and guardian oversight.
- `goal_match_policies` implement guardian incentives and optionally tie into Reward Vault entries.
- Savings-focused `account_partitions` can point at `goals`, letting the wow flow and dashboard buckets stay synchronized.

## 5. Practice Investing

### securities
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| symbol | text unique | Simulated ticker/ETF |
| name | text | Display label |
| price_feed_key | text | Links to simulated pricing dataset |
| sector | text nullable | For categorization |
| created_at | timestamptz | |

### investment_positions
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| account_id | uuid FK -> accounts.id | Invest account |
| security_id | uuid FK -> securities.id | |
| quantity_shares | numeric | Current holdings |
| avg_cost_cents | bigint | Weighted average cost |
| updated_at | timestamptz | |

### investment_orders
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| account_id | uuid FK -> accounts.id | |
| kid_id | uuid FK -> users.id | Initiator |
| security_id | uuid FK -> securities.id | |
| order_type | enum(`buy`,`sell`) | |
| quantity_shares | numeric | |
| price_cents | bigint | Simulated fill price |
| status | enum(`draft`,`pending_guardian`,`queued`,`filled`,`rejected`,`canceled`) | Supports guardian gating |
| guardian_action_id | uuid FK -> approval_actions.id nullable | Links to approval |
| submitted_at | timestamptz | |
| filled_at | timestamptz nullable | |

### investment_watchlist
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| kid_id | uuid FK -> users.id | |
| security_id | uuid FK -> securities.id | |
| added_at | timestamptz | |

**Relationships**
- `investment_orders` create queue items for guardian review and drive practice transactions.
- `investment_positions` provide portfolio data for kid dashboard and guardian oversight.
- `investment_watchlist` backs the watchlist UI.

## 6. Automations, Templates & Nudges

### automation_templates
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id nullable | Null for global templates |
| created_by | uuid FK -> users.id nullable | Guardians can author sharable templates |
| name | text | |
| description | text | |
| icon | text nullable | UI hint |
| config | jsonb | Serialized nodes/edges |
| visibility | enum(`global`,`household`,`private`) | Controls discoverability |
| scenario_type | enum(`baseline`,`stress_test`,`custom`) | Distinguishes seeded "bad idea" overlays from neutral templates |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### automation_flows
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| owner_user_id | uuid FK -> users.id | Kid who created the flow |
| name | text | |
| description | text | |
| template_id | uuid FK -> automation_templates.id nullable | Origin template |
| flow_kind | enum(`wow_onboarding`,`kid_sandbox`,`production`) | Allows onboarding drafts to live beside real automations |
| requires_guardian_approval | boolean | Determines if flow changes land in approvals |
| status | enum(`draft`,`active`,`paused`,`archived`) | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### automation_flow_shares
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| flow_id | uuid FK -> automation_flows.id | |
| shared_by_guardian_id | uuid FK -> users.id | |
| kid_id | uuid FK -> users.id | Recipient |
| share_status | enum(`offered`,`accepted`,`declined`) | |
| created_at | timestamptz | |
| responded_at | timestamptz nullable | |

### automation_nodes
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| flow_id | uuid FK -> automation_flows.id | |
| node_type | enum(`income`,`rule`,`bucket`,`account`,`nudge`) | Matches Money Map UX; `account` nodes represent deposit, invest, liability, and destination endpoints |
| label | text | Display name |
| config | jsonb | Trigger, condition, action, and timeline specifics (if/then/else, thresholds, schedules, active periods) |
| position | jsonb | React Flow coordinates |
| created_at | timestamptz | |

### automation_edges
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| flow_id | uuid FK -> automation_flows.id | |
| source_node_id | uuid FK -> automation_nodes.id | |
| target_node_id | uuid FK -> automation_nodes.id | |
| allocation_type | enum(`percent`,`fixed`,`remainder`) | |
| allocation_value | numeric | Percent or fixed amount |
| created_at | timestamptz | |

### automation_executions
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| flow_id | uuid FK -> automation_flows.id | |
| triggered_by_event_id | uuid FK -> household_events.id | Connects to earn events or manual simulations |
| executed_at | timestamptz | |
| status | enum(`preview`,`applied`,`failed`,`rolled_back`) | Preview state supports “see outcome before saving” story |
| summary | jsonb | Breakdown for dashboards |

### automation_execution_items
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| execution_id | uuid FK -> automation_executions.id | |
| from_account_id | uuid FK -> accounts.id | |
| to_account_id | uuid FK -> accounts.id | |
| amount_cents | bigint | |
| result_transaction_id | uuid FK -> transactions.id nullable | Links when applied |

### nudge_templates
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| key | text unique | `round_up`, `save_as_you_spend`, etc. |
| name | text | |
| description | text | |
| config_schema | jsonb | Defines customizable options |
| default_enabled | boolean | |

### nudge_enrollments
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| template_id | uuid FK -> nudge_templates.id | |
| kid_id | uuid FK -> users.id | |
| enabled | boolean | |
| config | jsonb | Per-child settings |
| enabled_by | uuid FK -> users.id | Guardian or kid |
| updated_at | timestamptz | |

### nudge_events
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| enrollment_id | uuid FK -> nudge_enrollments.id | |
| source_transaction_id | uuid FK -> transactions.id | Spend triggering round-up, etc. |
| routed_account_id | uuid FK -> accounts.id | Destination |
| amount_cents | bigint | |
| created_at | timestamptz | |

### household_events
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| event_type | enum(`income.received`,`purchase.logged`,`goal.milestone`,`automation.updated`,`nudge.applied`,`invest.order_submitted`,`invest.order_filled`,`request.created`,`request.updated`,`wow.plan_submitted`,`wow.plan_returned`,`wow.plan_approved`,`reward.available`,`notification.sent`) | Unified event stream |
| actor_id | uuid FK -> users.id nullable | |
| payload | jsonb | |
| occurred_at | timestamptz | |

**Relationships**
- Money Map editor persists to `automation_nodes`/`automation_edges`.
- `automation_templates` (with `scenario_type`) seed baseline flows and stress-test overlays for the wow playground.
- `automation_flows` use `flow_kind` + `status` to distinguish onboarding drafts, sandbox experiments, and production automations under the same primitive.
- Timeline period edits from the wow playground persist inside `automation_nodes.config`, keeping simulations and live automations aligned.
- `automation_flow_shares` let guardians offer flows to kids, honoring the coaching user story.
- `automation_executions` connect to earn events, run preview simulations, and generate transactions when applied.
- Nudge tables allow both kid enrollment and guardian override stories.

## 7. Requests & Approvals

### requests
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| kid_id | uuid FK -> users.id | Initiator |
| request_type | enum(`automation_change`,`new_card`,`limit_change`,`goal_transfer`,`purchase`,`earn_proposal`,`unlock_goal`,`wow_plan`,`custom`) | Covers sidebar Requests scope |
| payload | jsonb | Context for guardians |
| status | enum(`pending`,`approved`,`denied`,`withdrawn`) | |
| created_at | timestamptz | |
| last_updated_at | timestamptz | |

### request_updates
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| request_id | uuid FK -> requests.id | |
| actor_id | uuid FK -> users.id | Kid or guardian |
| action | enum(`comment`,`approve`,`deny`,`return`,`cancel`) | |
| note | text | Feedback loop |
| created_at | timestamptz | |

### approval_actions
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| guardian_id | uuid FK -> users.id | |
| subject_type | text | `chore_assignment`, `request`, `automation_flow`, `purchase`, `investment_order`, `goal_transfer`, `reward_vault_entry` |
| subject_id | uuid | ID of referenced entity |
| action | enum(`approved`,`denied`,`needs_changes`) | |
| acted_at | timestamptz | |
| notes | text | Optional explanation |

**Relationships**
- `requests` feed the Kid “Requests” page; `approval_actions` anchor the Guardian “Approvals” workspace.
- `request_updates` keep status conversations auditable.
- `approval_actions` link to `earn_proposals`, `automation_flows`, `investment_orders`, and other reviewable objects.

## 8. Learning, XP & Reward Vault

### lessons
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| slug | text unique | |
| title | text | |
| summary | text | |
| difficulty | enum(`intro`,`intermediate`,`advanced`) | |
| estimated_minutes | integer | |
| prerequisite_lesson_id | uuid FK -> lessons.id nullable | Unlock sequencing |
| unlocks_feature | text nullable | e.g., `investing`, `credit` |
| created_at | timestamptz | |

### lesson_steps
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| lesson_id | uuid FK -> lessons.id | |
| step_order | integer | |
| content_type | enum(`text`,`video`,`interactive`) | |
| content | jsonb | Portable content |

### quizzes
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| lesson_id | uuid FK -> lessons.id | |
| passing_score | integer | Percentage threshold |

### quiz_questions
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| quiz_id | uuid FK -> quizzes.id | |
| prompt | text | |
| options | text[] | |
| correct_index | integer | |
| explanation | text | Immediate feedback |

### quiz_attempts
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| quiz_id | uuid FK -> quizzes.id | |
| kid_id | uuid FK -> users.id | |
| score_pct | numeric | |
| passed | boolean | |
| answers | jsonb | Selected options |
| attempted_at | timestamptz | |
| reward_vault_entry_id | uuid FK -> reward_vault_entries.id nullable | Optional vault reward |

### lesson_progress
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| lesson_id | uuid FK -> lessons.id | |
| kid_id | uuid FK -> users.id | |
| status | enum(`not_started`,`in_progress`,`completed`) | Controls gating |
| last_viewed_at | timestamptz | |
| completed_at | timestamptz nullable | |

### xp_ledger
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| user_id | uuid FK -> users.id | |
| source_type | enum(`lesson`,`quiz`,`chore`,`mission`,`goal`,`streak`,`automation`,`nudge`,`investing`,`donation`) | |
| source_id | uuid nullable | Linking back to origin |
| delta | integer | XP gained or lost |
| reason | text | Display in activity feed |
| created_at | timestamptz | |

### badges
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| key | text unique | |
| name | text | |
| description | text | |
| criteria | jsonb | Trigger logic |

### badge_awards
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| badge_id | uuid FK -> badges.id | |
| user_id | uuid FK -> users.id | |
| awarded_at | timestamptz | |
| metadata | jsonb | Proof |

### reward_catalog
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id nullable | Null for global defaults |
| key | text | Identifier (unique per household or global) |
| name | text | |
| description | text | Kid-friendly explanation |
| reward_type | enum(`status`,`cosmetic`,`guardian_match`,`virtual_stock_io`,`perk`) | Defines fulfillment style |
| default_value_cents | bigint nullable | Suggested monetary value for match/io |
| metadata | jsonb | e.g., avatar theme, stock symbol |
| created_by | uuid FK -> users.id nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### reward_vault_entries
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| user_id | uuid FK -> users.id | Recipient kid |
| catalog_id | uuid FK -> reward_catalog.id nullable | Optional reference |
| source_type | enum(`goal`,`lesson`,`mission`,`streak`,`guardian_match`,`manual`,`investing`,`automation`,`donation`) | Origin of promise |
| source_id | uuid nullable | Origin entity |
| status | enum(`locked`,`available`,`awaiting_guardian`,`fulfilled`,`retired`) | Controls UI state |
| promise_value_cents | bigint nullable | For matches or future deposits |
| promise_symbol | text nullable | For virtual stock IOUs |
| available_at | timestamptz | When kid can view/claim |
| guardian_commitment | boolean | Indicates guardian needs to fulfill |
| fulfilled_by | uuid FK -> users.id nullable | Guardian who marked fulfilled |
| fulfilled_at | timestamptz nullable | |
| notes | text | Kid-facing note about next steps |
| created_at | timestamptz | |

### reward_vault_actions
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| entry_id | uuid FK -> reward_vault_entries.id | |
| actor_id | uuid FK -> users.id | Kid or guardian |
| action | enum(`acknowledged`,`scheduled`,`fulfilled`,`cancelled`) | Audit trail |
| note | text | Optional comment |
| created_at | timestamptz | |

**Relationships**
- Lessons, quizzes, missions, goal matches, investing streaks, automation success, and generosity milestones can all create `reward_vault_entries`.
- Guardians manage outstanding entries via `reward_vault_actions` and status updates.
- XP ledger and badges provide ongoing status mechanics; Reward Vault handles deferred tangible perks.

## 9. Notifications, Activity & Audit

### notifications
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| type | enum(`reminder`,`approval`,`nudge`,`celebration`,`system`) | |
| severity | enum(`info`,`success`,`warning`,`urgent`) | Presentation hint |
| title | text | |
| body | text | |
| action_type | enum(`open_route`,`open_drawer`,`run_mutation`,`none`) | Drives CTA behavior |
| action_payload | jsonb | Route params, mutation ids, etc. |
| dedupe_key | text nullable | Prevents duplicate inserts for retried events |
| created_at | timestamptz | |

### notification_recipients
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| notification_id | uuid FK -> notifications.id | |
| user_id | uuid FK -> users.id | |
| status | enum(`unread`,`read`,`dismissed`) | |
| read_at | timestamptz nullable | |
| toast_shown | boolean default false | Tracks whether a real-time toast fired |

### activity_log
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| actor_id | uuid FK -> users.id nullable | |
| subject_type | text | Entity affected |
| subject_id | uuid | |
| action | text | e.g., `automation.created`, `goal.locked` |
| metadata | jsonb | |
| occurred_at | timestamptz | |

### household_events
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| event_type | enum(`income.received`,`purchase.logged`,`goal.milestone`,`automation.updated`,`nudge.applied`,`invest.order_submitted`,`invest.order_filled`,`request.created`,`request.updated`,`wow.plan_submitted`,`wow.plan_returned`,`wow.plan_approved`,`reward.available`,`notification.sent`) | Unified event stream |
| actor_id | uuid FK -> users.id nullable | |
| payload | jsonb | Domain-specific context |
| occurred_at | timestamptz | |

**Notification Pipeline**
1. Mutations append normalized records to `household_events` after core writes complete.
2. A Convex action/cron reads new events, applies notification policies (who should know, what CTA applies), and inserts `notifications` plus `notification_recipients` with a `dedupe_key` for idempotency.
3. Frontend clients subscribe to `notification_recipients` by `user_id`, render real-time toasts (`toast_shown` toggled in the mutation), and mark records `read` or `dismissed` upon interaction.
4. Audit trails remain in `household_events` and `activity_log`; notifications simply project events into user-facing reminders.

## 10. Reference & Support Tables

### feature_unlocks
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| feature_key | text unique | `investing`, `credit`, `donate_extended` |
| requirement_type | enum(`lesson`,`guardian_toggle`) | |
| requirement_id | uuid nullable | Points to `lessons` when lesson-based |

### user_feature_states
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| user_id | uuid FK -> users.id | |
| feature_key | text | FK -> feature_unlocks.feature_key |
| status | enum(`locked`,`unlocked`,`pending_guardian`) | |
| updated_at | timestamptz | |

### preset_charities
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text | |
| description | text | |
| category | text | |
| default_impact_copy | text | |

### donations
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| kid_id | uuid FK -> users.id | |
| charity_id | uuid FK -> preset_charities.id nullable | Custom or preset |
| amount_cents | bigint | |
| occurred_at | timestamptz | |
| note | text | |

### guardian_invites
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| household_id | uuid FK -> households.id | |
| email | text | |
| invited_by | uuid FK -> users.id | Existing guardian |
| token | text unique | |
| status | enum(`pending`,`accepted`,`expired`) | |
| created_at | timestamptz | |
| redeemed_at | timestamptz nullable | |

## Relationship Summary
- One `household` aggregates many `users`, `accounts`, `account_partitions`, wealth snapshots, `automations`, `goals`, `chores`, notifications, and Reward Vault entries.
- Guardians manage kids through `guardian_child_settings`, `requests`, `approval_actions`, per-kid guardrail tables (`card_controls`, `nudge_enrollments`, `automation_flow_shares`), and Reward Vault fulfillment (`reward_vault_actions`).
- Kid autonomy flows (earn proposal → approval → earn event → allocation → automation → transactions) traverse `earn_proposals`, `requests`, `earn_events`, `automation_executions`, and `transactions`, ensuring data consistency for dashboards and ledgers.
- Wealth ladder experiences read from `wealth_progress_snapshots` (fed by account snapshots or automation previews) so the wow flow and dashboards stay in sync.
- Practice investing stories are backed by `securities`, `investment_orders`, `investment_positions`, and `investment_watchlist` with approval hooks.
- Learning & growth tables (`lessons`, `xp_ledger`, `reward_catalog`, `reward_vault_entries`) provide status progression and clear paths to future tangible rewards.
- Notifications leverage `household_events` for deterministic fan-out with CTA metadata and idempotent delivery.
- `household_events` include wow playground lifecycle events so approvals, notifications, and analytics stay in sync.

This design keeps the data structures and the MVP user stories in lockstep so future adjustments can modify both artifacts together.
