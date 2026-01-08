import { Navbar } from "@/components/Navbar";
import { WeeklyChart } from "@/components/WeeklyChart";
import { StressContributor } from "@/components/StressContributor";
import { RiskBadge } from "@/components/RiskBadge";
import { Activity, Info, TrendingDown, TrendingUp } from "lucide-react";

const weeklyData = [
  { day: "Mon", stressLevel: 35, deadlines: 2 },
  { day: "Tue", stressLevel: 45, deadlines: 1 },
  { day: "Wed", stressLevel: 72, deadlines: 3 },
  { day: "Thu", stressLevel: 85, deadlines: 4 },
  { day: "Fri", stressLevel: 60, deadlines: 2 },
  { day: "Sat", stressLevel: 25, deadlines: 1 },
  { day: "Sun", stressLevel: 15, deadlines: 0 },
];

const stressContributors = [
  {
    title: "Statistics Midterm Preparation",
    contribution: 35,
    dueDate: "2026-01-14",
  },
  {
    title: "CS 301 - Algorithm Analysis Essay",
    contribution: 25,
    dueDate: "2026-01-12",
  },
  {
    title: "History Research Paper Draft",
    contribution: 20,
    dueDate: "2026-01-15",
  },
  {
    title: "Physics Lab Report",
    contribution: 12,
    dueDate: "2026-01-10",
  },
  {
    title: "Weekly Reading Response",
    contribution: 8,
    dueDate: "2026-01-11",
  },
];

const maxContribution = Math.max(...stressContributors.map((c) => c.contribution));

const Stress = () => {
  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <main className="pt-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Stress Overview</h1>
            <p className="text-muted-foreground">
              Understand what's contributing to your workload stress.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Current Status</span>
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <RiskBadge level="medium" size="lg" />
              <p className="text-sm text-muted-foreground mt-3">
                Based on deadline proximity and workload
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Peak Stress Day</span>
                <TrendingUp className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-2xl font-bold text-foreground">Thursday</p>
              <p className="text-sm text-muted-foreground mt-1">
                85% stress level predicted
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Best Recovery Day</span>
                <TrendingDown className="h-5 w-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">Sunday</p>
              <p className="text-sm text-muted-foreground mt-1">
                Only 15% stress level
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            {/* Weekly Chart - Takes 3 columns */}
            <div className="lg:col-span-3">
              <WeeklyChart data={weeklyData} />
            </div>

            {/* Contributors - Takes 2 columns */}
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Top Stress Contributors
              </h3>
              <div className="space-y-5">
                {stressContributors.map((contributor) => (
                  <StressContributor
                    key={contributor.title}
                    {...contributor}
                    maxContribution={maxContribution}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Insights Section */}
          <div className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Understanding Your Stress Pattern
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Your stress levels typically build up mid-week as deadlines approach. 
                    The Statistics Midterm and Algorithm Essay are your biggest contributors, 
                    accounting for 60% of your total stress this week.
                  </p>
                  <p>
                    <strong className="text-foreground">Recommendation:</strong> Consider 
                    starting your Statistics preparation on Monday to distribute the workload 
                    more evenly. Breaking down the Algorithm Essay into smaller daily tasks 
                    could also help reduce Thursday's peak stress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stress;
