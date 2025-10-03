import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/earn')({
  component: Earn,
});

function Earn() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Earn & TimeBack"
        description="Plan chores, streak bonuses, and TimeBack missions to grow your earnings."
        action={<Button variant="default">Log a new chore</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Available Chores" subtitle="Choose from weekly missions and multipliers" />
        <PlaceholderCard title="Active Assignments" subtitle="Track due dates and streaks" />
      </div>

      <PlaceholderCard title="Streak Meter" subtitle="Consistency boosts XP and earnings" height="sm" />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="TimeBack Ideas" subtitle="Suggest ways to save the household time" />
        <PlaceholderCard title="Reward Vault Earn Entries" subtitle="Auto-generated boosts from milestones" />
      </div>
    </div>
  );
}

