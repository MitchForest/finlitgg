import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/donate')({
  component: Donate,
});

function Donate() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Giving & Generosity"
        description="Choose causes, track impact, and celebrate generosity milestones with your household."
        action={<Button variant="default">Make a Donation</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Curated Causes" subtitle="Browse categories with impact blurbs" />
        <PlaceholderCard title="Donation History" subtitle="See how generosity grows over time" />
      </div>

      <PlaceholderCard title="Giving Streak" subtitle="Earn Reward Vault boosts for consistency" height="sm" />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Guardian Preferences" subtitle="Whitelist charities and caps" />
        <PlaceholderCard title="Impact Stories" subtitle="Celebrate giving milestones together" />
      </div>
    </div>
  );
}

