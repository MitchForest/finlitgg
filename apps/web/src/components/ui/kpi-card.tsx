import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { type AccentDomain } from "@/lib/design"

interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  domain: AccentDomain
  icon?: React.ReactNode
  label: string
  value: string
  delta?: {
    value: string
    positive: boolean
  }
  sparkline?: React.ReactNode
}

export function KpiCard({
  domain,
  icon,
  label,
  value,
  delta,
  sparkline,
  className,
  ...props
}: KpiCardProps) {
  const accentVar = `var(--accent-${domain === 'save' ? 'balance' : domain})`
  
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-3xl border-0 p-6 text-white transition-smooth hover:shadow-[var(--shadow-float)]",
        className
      )}
      style={{
        "--accent-current": accentVar,
        background: `linear-gradient(135deg, color-mix(in srgb, ${accentVar} 75%, #000000 5%) 0%, color-mix(in srgb, ${accentVar} 55%, #000000 15%) 40%, color-mix(in srgb, ${accentVar} 40%, #000000 25%) 100%)`
      } as React.CSSProperties}
      {...props}
    >
      {/* Ambient glow effect */}
      <div 
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-50"
        style={{ backgroundColor: 'color-mix(in srgb, var(--accent-current) 55%, transparent)' }}
        aria-hidden="true"
      />
      
      {/* Subtle texture overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20" 
        style={{ background: `radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--accent-current) 40%, transparent), transparent 55%)` }}
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Header with icon */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-overline text-white/70">{label}</p>
            <p className="mt-2 text-kpi tabular-nums text-white">{value}</p>
          </div>
          {icon && (
            <div 
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl text-white transition-transform group-hover:scale-105"
            >
              {icon}
            </div>
          )}
        </div>
        
        {/* Sparkline */}
        {sparkline && (
          <div className="-mx-2 h-16">
            {sparkline}
          </div>
        )}
        
        {/* Delta chip */}
        {delta && (
          <div className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium tabular-nums",
            delta.positive 
              ? "bg-white/20 text-white" 
              : "bg-black/25 text-white"
          )}>
            {delta.positive ? "↑" : "↓"} {delta.value}
          </div>
        )}
      </div>
    </Card>
  )
}
