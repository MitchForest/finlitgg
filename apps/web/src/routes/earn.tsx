import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/earn')({
  component: Earn,
});

function Earn() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Earn</h1>
      <p className="text-neutral-400">Chores, XP, TimeBack coming soon...</p>
    </div>
  );
}


