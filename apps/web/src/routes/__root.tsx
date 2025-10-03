import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <nav className="border-b border-neutral-800 p-4">
        <div className="flex gap-4">
          <Link to="/" className="[&.active]:font-bold">
            Dashboard
          </Link>
          <Link to="/earn" className="[&.active]:font-bold">
            Earn
          </Link>
          <Link to="/save" className="[&.active]:font-bold">
            Save
          </Link>
          <Link to="/invest" className="[&.active]:font-bold">
            Invest
          </Link>
          <Link to="/spend" className="[&.active]:font-bold">
            Spend
          </Link>
          <Link to="/donate" className="[&.active]:font-bold">
            Donate
          </Link>
          <Link to="/automations" className="[&.active]:font-bold">
            Automations
          </Link>
          <Link to="/learn" className="[&.active]:font-bold">
            Learn
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  ),
});


