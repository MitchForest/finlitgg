import { cn } from '@/lib/utils';

interface PlaceholderCardProps {
  title: string;
  subtitle?: string;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

const heightMap = {
  sm: 'h-32',
  md: 'h-48',
  lg: 'h-64',
};

export function PlaceholderCard({ title, subtitle, height = 'md', className }: PlaceholderCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border-0 bg-card p-6 shadow-[var(--shadow-raised)] transition-smooth hover:shadow-[var(--shadow-float)]',
        heightMap[height],
        className
      )}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="relative z-10">
          <p className="text-overline text-muted-foreground">Coming Soon</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">{title}</h2>
          {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        
        {/* Ambient glow effects */}
        <div className="pointer-events-none absolute inset-0 opacity-30 transition-opacity group-hover:opacity-50" aria-hidden>
          <div className="absolute -right-16 top-10 h-48 w-48 rounded-full bg-[var(--accent-upgrade)]/40 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[var(--accent-balance)]/30 blur-3xl" />
        </div>
        
        {/* Subtle texture */}
        <div 
          className="pointer-events-none absolute inset-0" 
          style={{ background: `radial-gradient(circle at 50% 120%, var(--accent-upgrade) 0%, transparent 50%)`, opacity: 0.05 }}
          aria-hidden
        />
      </div>
    </div>
  );
}
