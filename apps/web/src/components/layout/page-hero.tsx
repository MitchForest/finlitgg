import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHero({ title, description, action, className }: PageHeroProps) {
  return (
    <div className={cn(
      'relative flex flex-col gap-3 overflow-hidden rounded-3xl border-0 bg-card p-8 shadow-[var(--shadow-raised)] transition-smooth',
      className
    )}>
      {/* Mesh gradient background */}
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent-upgrade)]/40 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-[var(--accent-invest)]/30 blur-3xl" />
      </div>
      
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
