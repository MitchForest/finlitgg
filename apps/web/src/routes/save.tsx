import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/save')({
  component: Save,
});

function Save() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Save</h1>
      <p className="text-neutral-400">Goals & savings accounts coming soon...</p>
    </div>
  );
}


