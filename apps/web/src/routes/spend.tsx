import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/spend')({
  component: Spend,
});

function Spend() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Smart Spending"
        description="Use virtual debit and secured credit cards, categorize needs vs wants, and automate round-ups into investments."
        action={<Button variant="default">Request New Card</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Virtual Cards" subtitle="Limits, controls, freeze/unfreeze" />
        <PlaceholderCard title="Transactions Ledger" subtitle="Needs vs. wants classification" />
      </div>

      <PlaceholderCard title="Round-Up & Nudges" subtitle="Track automated micro-investments and savings" />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Spending Insights" subtitle="Category breakdown with trends" />
        <PlaceholderCard title="Credit Practice" subtitle="Simulated repayment schedule" />
      </div>
    </div>
  );
}

