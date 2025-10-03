import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/invest')({
  component: Invest,
});

function Invest() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Invest</h1>
      <p className="text-neutral-400">Virtual portfolio & fragments coming soon...</p>
    </div>
  );
}


