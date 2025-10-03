import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/learn')({
  component: Learn,
});

function Learn() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Lessons & Missions"
        description="Master budgeting, credit, investing, and generosity with snackable lessons and quizzes."
        action={<Button variant="default">Start Next Lesson</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Featured Lesson" subtitle="Needs vs. Wants" />
        <PlaceholderCard title="Quiz Rewards" subtitle="XP, badges, Reward Vault entries" />
      </div>

      <PlaceholderCard title="Learning Path" subtitle="Unlock features like investing through required modules" />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Micro Challenges" subtitle="Daily nudges to reinforce concepts" />
        <PlaceholderCard title="Mission Progress" subtitle="XP streaks and guardian assigned tasks" />
      </div>
    </div>
  );
}

