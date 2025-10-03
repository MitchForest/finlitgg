import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/automations')({
  component: Automations,
});

function Automations() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Automations</h1>
      <p className="text-neutral-400">Money Map & rules coming soon...</p>
    </div>
  );
}


