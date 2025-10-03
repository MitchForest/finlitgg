import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/save')({
  component: Save,
});

function Save() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Savings Goals"
        description="Create buckets, automate transfers, and celebrate milestones on your wealth ladder journey."
        action={<Button variant="default">New Goal</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Goal Progress" subtitle="Track funding toward short- and long-term goals" />
        <PlaceholderCard title="Auto-Allocation Rules" subtitle="Preview payday splits and sweep logic" />
      </div>

      <PlaceholderCard title="Milestone Celebrations" subtitle="Confetti, badges, and Reward Vault boosts" height="sm" />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Savings Ledger" subtitle="Transparent history of moves between goals" />
        <PlaceholderCard title="Guardian Matching" subtitle="See match policies and pending boosts" />
      </div>
    </div>
  );
}

