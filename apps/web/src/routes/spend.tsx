import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/spend')({
  component: Spend,
});

function Spend() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Spend</h1>
      <p className="text-neutral-400">Virtual cards & transactions coming soon...</p>
    </div>
  );
}


