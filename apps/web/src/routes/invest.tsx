import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/invest')({
  component: Invest,
});

function Invest() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Practice Investing"
        description="Simulate trades, track positions, and earn virtual share IOUs that unlock real value later."
        action={<Button variant="default">Place Simulated Trade</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Portfolio Overview" subtitle="Positions, cost basis, and market value" />
        <PlaceholderCard title="Watchlist" subtitle="Symbols you're researching" />
      </div>

      <PlaceholderCard title="Orders & Approvals" subtitle="Guardian and kid views of pending trades" />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Reward Vault IOUs" subtitle="Virtual shares to be fulfilled later" />
        <PlaceholderCard title="Lessons Required" subtitle="Investing mastery prerequisites" />
      </div>
    </div>
  );
}

