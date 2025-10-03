import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/donate')({
  component: Donate,
});

function Donate() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Donate</h1>
      <p className="text-neutral-400">Charity selection coming soon...</p>
    </div>
  );
}


