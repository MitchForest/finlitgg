import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-neutral-400">Welcome to finlit.gg kids app</p>
    </div>
  );
}


