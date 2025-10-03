import { createFileRoute } from '@tanstack/react-router';
import { PageHero } from '@/components/layout/page-hero';
import { PlaceholderCard } from '@/components/layout/placeholder-card';
import { KpiCard } from '@/components/ui/kpi-card';
import { Button } from '@/components/ui/button';
import { PiggyBank, Coins, TrendingUp, Heart } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

// Mock data for sparklines
const balanceData = [
  { value: 2200 }, { value: 2350 }, { value: 2280 }, { value: 2500 }, 
  { value: 2650 }, { value: 2750 }, { value: 2847 }
];

const earnData = [
  { value: 15 }, { value: 20 }, { value: 18 }, { value: 25 }, 
  { value: 30 }, { value: 28 }, { value: 35 }
];

const investData = [
  { value: 450 }, { value: 470 }, { value: 460 }, { value: 490 }, 
  { value: 510 }, { value: 495 }, { value: 520 }
];

const donateData = [
  { value: 5 }, { value: 8 }, { value: 12 }, { value: 15 }, 
  { value: 18 }, { value: 22 }, { value: 28 }
];

function Dashboard() {
  return (
    <div className="grid gap-6">
      <PageHero
        title="Household Wealth Overview"
        description="Track balances, see your next wealth ladder milestone, and jump into the Money Flow simulator."
        action={
          <Button variant="upgrade" size="lg" className="hover-lift">
            Launch Money Flow Simulator
          </Button>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          domain="save"
          label="Total Balance"
          value="$2,847.50"
          icon={<PiggyBank />}
          delta={{ value: "+17.2%", positive: true }}
          sparkline={
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="rgba(255,255,255,0.9)" 
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          }
        />
        
        <KpiCard
          domain="earn"
          label="Earned This Week"
          value="$35.00"
          icon={<Coins />}
          delta={{ value: "+8.5%", positive: true }}
          sparkline={
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earnData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="rgba(255,255,255,0.9)" 
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          }
        />
        
        <KpiCard
          domain="invest"
          label="Practice Portfolio"
          value="$520.00"
          icon={<TrendingUp />}
          delta={{ value: "+12.4%", positive: true }}
          sparkline={
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={investData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="rgba(255,255,255,0.9)" 
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          }
        />
        
        <KpiCard
          domain="donate"
          label="Giving This Month"
          value="$28.00"
          icon={<Heart />}
          delta={{ value: "+24.1%", positive: true }}
          sparkline={
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donateData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="rgba(255,255,255,0.9)" 
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          }
        />
      </div>

      <PlaceholderCard
        title="Compound Growth Preview"
        subtitle="Adjust deposits and see future net worth on the wealth ladder."
        height="lg"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlaceholderCard title="Upcoming Reminders" subtitle="Lessons, approvals, nudges" />
        <PlaceholderCard title="Recent Activity" subtitle="Transfers, approvals, achievements" />
      </div>
    </div>
  );
}
