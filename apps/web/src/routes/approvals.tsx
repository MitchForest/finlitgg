import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';

export const Route = createFileRoute('/approvals')({
  component: Approvals,
});

function Approvals() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Approvals"
        description="Guardians can review pending chores, spending requests, automations, and investing actions."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Needs Attention" subtitle="Items waiting for a decision" />
        <PlaceholderCard title="Recently Decided" subtitle="Highlight feedback shared with kids" />
      </div>

      <PlaceholderCard title="Bulk Actions" subtitle="Approve common items with templates" height="sm" />
    </div>
  );
}
