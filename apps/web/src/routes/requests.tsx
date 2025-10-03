import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';

export const Route = createFileRoute('/requests')({
  component: Requests,
});

function Requests() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Requests"
        description="Track submissions awaiting guardian approval and learn what happens next."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Pending Requests" subtitle="Card changes, automations, goal unlocks" />
        <PlaceholderCard title="Recently Approved" subtitle="See what was granted and when" />
      </div>

      <PlaceholderCard title="Tips" subtitle="What information helps guardians approve faster" height="sm" />
    </div>
  );
}
