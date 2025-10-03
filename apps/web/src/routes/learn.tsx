import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/learn')({
  component: Learn,
});

function Learn() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Learn</h1>
      <p className="text-neutral-400">Lessons & quizzes coming soon...</p>
    </div>
  );
}


