import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/automations')({
  component: Automations,
});

function Automations() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Money Map Automations"
        description="Design flows that route every dollar into Save, Spend, Invest, and Donate buckets automatically."
        action={<Button variant="default">Create Flow</Button>}
      />

      <PlaceholderCard title="Canvas Preview" subtitle="Drag-and-drop nodes to route income" height="lg" />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Rule Templates" subtitle="50/30/20, Save-First, Donation tithe" />
        <PlaceholderCard title="Execution Log" subtitle="See how recent income followed your rules" />
      </div>

      <PlaceholderCard title="Guardian Approvals" subtitle="Requests and locks for household oversight" />
    </div>
  );
}

