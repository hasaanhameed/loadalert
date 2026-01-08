import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { RiskBadge } from "@/components/RiskBadge";
import { WeeklyChart } from "@/components/WeeklyChart";
import { Activity, Calendar, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const weeklyData = [
  { day: "Mon", stressLevel: 35, deadlines: 2 },
  { day: "Tue", stressLevel: 45, deadlines: 1 },
  { day: "Wed", stressLevel: 72, deadlines: 3 },
  { day: "Thu", stressLevel: 85, deadlines: 4 },
  { day: "Fri", stressLevel: 60, deadlines: 2 },
  { day: "Sat", stressLevel: 25, deadlines: 1 },
  { day: "Sun", stressLevel: 15, deadlines: 0 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <main className="pt-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Your weekly workload overview at a glance.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Weekly Stress Score"
              value="68%"
              subtitle="Higher than last week"
              icon={Activity}
              variant="warning"
            />
            <StatsCard
              title="Risk Level"
              value="Medium"
              subtitle="Based on upcoming deadlines"
              icon={AlertTriangle}
              variant="warning"
            />
            <StatsCard
              title="Upcoming Deadlines"
              value="7"
              subtitle="In the next 7 days"
              icon={Calendar}
              variant="default"
            />
            <StatsCard
              title="Hours Needed"
              value="24h"
              subtitle="Estimated total effort"
              icon={Clock}
              variant="default"
            />
          </div>

          {/* High Risk Warning */}
          <div className="glass-card p-6 mb-8 border-warning/30 bg-warning/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  High-Risk Week Ahead
                </h3>
                <p className="text-muted-foreground">
                  Thursday is predicted to be your most stressful day with 4 deadlines. 
                  Consider starting preparations early to manage your workload effectively.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="hero" size="sm" asChild>
                  <Link to="/priorities">View Priorities</Link>
                </Button>
                <Button variant="heroFilled" size="sm" asChild>
                  <Link to="/deadlines">Manage Deadlines</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <WeeklyChart data={weeklyData} />
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Current Risk Level</span>
                  </div>
                  <RiskBadge level="medium" size="lg" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Peak Stress Day</span>
                    <span className="text-sm font-medium text-foreground">Thursday</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-destructive rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Week Progress</span>
                    <span className="text-sm font-medium text-foreground">40%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[40%] bg-primary rounded-full" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">2 tasks completed this week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="/deadlines"
              className="glass-card p-6 group hover:border-primary/30 transition-all"
            >
              <Calendar className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                Manage Deadlines
              </h3>
              <p className="text-sm text-muted-foreground">Add, edit, or remove deadlines</p>
            </Link>

            <Link
              to="/stress"
              className="glass-card p-6 group hover:border-primary/30 transition-all"
            >
              <Activity className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                Stress Breakdown
              </h3>
              <p className="text-sm text-muted-foreground">See what's causing stress</p>
            </Link>

            <Link
              to="/priorities"
              className="glass-card p-6 group hover:border-primary/30 transition-all"
            >
              <TrendingUp className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                Get Priorities
              </h3>
              <p className="text-sm text-muted-foreground">Know what to work on first</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
