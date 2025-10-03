import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';

export const Route = createFileRoute('/settings')({
  component: Settings,
});

function Settings() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Settings"
        description="Update profile details, household membership, notifications, and device security."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Profile" subtitle="Display name, avatar, preferences" />
        <PlaceholderCard title="Household" subtitle="Invite guardians, manage kids" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Notifications" subtitle="Choose channels per reminder" />
        <PlaceholderCard title="Device Security" subtitle="PIN, biometric controls" />
      </div>
    </div>
  );
}
