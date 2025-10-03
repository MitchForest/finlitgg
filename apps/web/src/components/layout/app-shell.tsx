import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Coins,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Heart,
  Workflow,
  GraduationCap,
  Bell,
  CheckSquare,
  Settings2,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { getAccentColorVar, type AccentDomain } from '@/lib/design';
import { cn } from '@/lib/utils';

const navItems: Array<{ label: string; href: string; icon: typeof LayoutDashboard; domain: AccentDomain; badge?: string | number }> = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, domain: 'dashboard' },
  { label: 'Earn', href: '/earn', icon: Coins, domain: 'earn' },
  { label: 'Save', href: '/save', icon: PiggyBank, domain: 'save' },
  { label: 'Invest', href: '/invest', icon: TrendingUp, domain: 'invest' },
  { label: 'Spend', href: '/spend', icon: CreditCard, domain: 'spend' },
  { label: 'Donate', href: '/donate', icon: Heart, domain: 'donate' },
  { label: 'Automations', href: '/automations', icon: Workflow, domain: 'automations' },
  { label: 'Learn', href: '/learn', icon: GraduationCap, domain: 'learn' },
  { label: 'Requests', href: '/requests', icon: Bell, domain: 'dashboard', badge: 3 },
  { label: 'Approvals', href: '/approvals', icon: CheckSquare, domain: 'dashboard', badge: 1 },
];

function useActivePath() {
  const state = useRouterState();
  return state.location.pathname;
}

export function AppShell() {
  const activePath = useActivePath();
  const lastScrollY = useRef(0);
  const [isHeaderHidden, setHeaderHidden] = useState(false);

  const items = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        active: activePath === item.href,
        accentVar: getAccentColorVar(item.domain),
      })),
    [activePath]
  );

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;
      if (current > 60 && delta > 4) {
        setHeaderHidden(true);
      } else if (delta < -4 || current < 40) {
        setHeaderHidden(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-surface-background text-foreground">
        <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
          <SidebarContent className="flex h-full flex-col gap-6 px-4 py-6">
            <div className="flex items-center gap-3 px-2">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-upgrade)] to-[var(--accent-invest)] text-xl font-bold text-white shadow-lg">
                FG
              </div>
              <p className="text-lg font-semibold tracking-tight text-white">Guap</p>
            </div>

            <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
            Money Flows
          </SidebarGroupLabel>
              <SidebarMenu className="gap-1.5">
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.active}
                      className={cn(
                        'group/item rounded-2xl px-3 py-2.5 transition-all duration-200',
                        'hover:!bg-[color-mix(in_srgb,var(--accent-current)_12%,transparent)]',
                        'data-[active=true]:!bg-[color-mix(in_srgb,var(--accent-current)_18%,transparent)]',
                        '!shadow-none'
                      )}
                      style={{ '--accent-current': item.accentVar } as CSSProperties}
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <span
                          className={cn(
                            'flex size-9 items-center justify-center transition-transform duration-200 text-lg',
                            item.active ? 'scale-105' : 'group-hover/item:scale-105'
                          )}
                          style={{ color: 'var(--accent-current)' }}
                        >
                          <item.icon className="size-5" />
                        </span>
                        <span className={cn(
                          'text-sm font-medium transition-colors',
                          item.active ? 'text-white' : 'text-white/65 group-hover/item:text-white'
                        )}>
                          {item.label}
                        </span>
                        {item.active ? (
                          <span
                            className="ml-auto inline-flex size-2 rounded-full"
                            style={{ backgroundColor: 'var(--accent-current)' }}
                          />
                        ) : null}
                        {item.badge && (
                          <SidebarMenuBadge
                            className={cn(
                              'ml-auto min-w-[1.6rem] rounded-full px-1.5 text-[11px] font-semibold leading-none text-white',
                              item.label === 'Approvals'
                                ? 'bg-status-warning/35'
                                : 'bg-[color-mix(in srgb,var(--accent-current) 38%, transparent)]'
                            )}
                          >
                            {String(item.badge)}
                          </SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

        </Sidebar>

        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <header
            className={cn(
              'sticky top-0 z-30 w-full border-b border-border/40 bg-surface-background transition-transform duration-200 ease-out',
              isHeaderHidden ? '-translate-y-full' : 'translate-y-0'
            )}
          >
            <div className="flex h-18 items-center justify-between px-8">
              {/* Enhanced search */}
              <div className="group relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[var(--accent-upgrade)]" />
                <input
                  className={cn(
                    "h-11 w-80 rounded-2xl border border-border/50 bg-card/50 pl-11 pr-4 text-sm text-foreground",
                    "placeholder:text-muted-foreground backdrop-blur-sm",
                    "transition-all focus:border-[var(--accent-upgrade)]/50 focus:outline-none focus:ring-4 focus:ring-[var(--accent-upgrade)]/10"
                  )}
                  placeholder="Search anything..."
                />
              </div>
              
              <div className="flex items-center gap-4">
                {/* XP Progress Bar (Kid view) */}
                <div className="hidden items-center gap-3 lg:flex">
                  <div className="flex flex-col items-end">
                    <p className="text-xs font-medium text-muted-foreground">Level 3</p>
                    <p className="text-xs text-muted-foreground/70">247/500 XP</p>
                  </div>
                  <div className="relative h-2 w-32 overflow-hidden rounded-full bg-neutral-200">
                    <div 
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--accent-invest)] to-[var(--accent-upgrade)] transition-all"
                      style={{ width: '49%' }}
                    />
                  </div>
                </div>

                {/* Notifications with dot */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                >
                  <Bell className="size-5" />
                  <span className="absolute right-2 top-2 flex size-2 rounded-full bg-status-warning ring-2 ring-card" />
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="icon">
                  <Settings2 className="size-5" />
                </Button>

                <Separator orientation="vertical" className="h-8" />

                {/* Profile */}
                <Avatar className="size-10 ring-2 ring-[var(--accent-upgrade)]/20">
                  <AvatarFallback className="bg-gradient-to-br from-[var(--accent-upgrade)] to-[var(--accent-invest)] text-white font-semibold">
                    MJ
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="w-full flex-1 px-8 py-10">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
