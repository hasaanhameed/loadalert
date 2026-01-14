import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { RiskBadge } from "@/components/RiskBadge";
import { WeeklyChart } from "@/components/WeeklyChart";
import { Activity, Calendar, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardSummary, DashboardSummary } from "@/api/dashboard";
import { getStressPrediction, StressPredictionResponse } from "@/api/ai";
import { useAuth } from "@/context/AuthContext";
import { generateWeeklyLoadHash, getCachedPrediction, cachePrediction } from "@/utils/aiCache";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [stressPrediction, setStressPrediction] = useState<StressPredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
        
        // Fetch dashboard summary
        const data = await getDashboardSummary(token);
        setSummary(data);

        // Fetch AI stress prediction if there's data
        if (data.weekly_load && data.weekly_load.length > 0) {
          const currentHash = generateWeeklyLoadHash(data.weekly_load);
          
          // Check cache first
          const cachedPrediction = getCachedPrediction(currentHash);
          if (cachedPrediction) {
            setStressPrediction(cachedPrediction);
          } else {
            // Only call AI if cache is invalid or missing
            setAiLoading(true);
            try {
              const prediction = await getStressPrediction(token, data.weekly_load);
              setStressPrediction(prediction);
              cachePrediction(currentHash, prediction);
            } catch (error) {
              console.error("Failed to load stress prediction", error);
            } finally {
              setAiLoading(false);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Get risk color for styling
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  // Get peak stress day percentage
  const getPeakStressPercentage = () => {
    if (!stressPrediction?.peak_stress_day || !stressPrediction?.daily_stress) return 0;
    
    const peakDay = stressPrediction.daily_stress.find(
      d => d.day === stressPrediction.peak_stress_day
    );
    return peakDay ? peakDay.stressLevel : 0;
  };
  const peakStress = getPeakStressPercentage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-1">Loading Dashboard</h2>
            <p className="text-sm text-muted-foreground">Preparing your workload overview...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <main className="pt-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Your weekly workload overview at a glance.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Weekly Stress Score"
              value={aiLoading ? "..." : (stressPrediction?.weekly_stress_score.toString() ?? "—")}
              subtitle={aiLoading ? "Calculating..." : (stressPrediction ? "AI prediction" : "No data")}
              icon={Activity}
              variant="default"
            />
            <StatsCard
              title="Risk Level"
              value={aiLoading ? "..." : (stressPrediction?.risk_level.toUpperCase() ?? "—")}
              subtitle={aiLoading ? "Analyzing..." : (stressPrediction ? "Current status" : "No data")}
              icon={AlertTriangle}
              variant="default"
            />
            <StatsCard
              title="Upcoming Deadlines"
              value={summary?.upcoming_deadlines.toString() ?? "0"}
              subtitle="In the next 7 days"
              icon={Calendar}
              variant="default"
            />
            <StatsCard
              title="Hours Needed"
              value={`${summary?.total_hours ?? 0}h`}
              subtitle="Estimated total effort"
              icon={Clock}
              variant="default"
            />
          </div>

          {/* AI Stress Insights */}
          {stressPrediction && !aiLoading && (
            <div className={`glass-card p-6 mb-8 border-${
              stressPrediction.risk_level === "high" ? "destructive" :
              stressPrediction.risk_level === "medium" ? "warning" : "green-500"
            }/30 bg-${
              stressPrediction.risk_level === "high" ? "destructive" :
              stressPrediction.risk_level === "medium" ? "warning" : "green-500"
            }/5`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`p-3 rounded-xl bg-${
                  stressPrediction.risk_level === "high" ? "destructive" :
                  stressPrediction.risk_level === "medium" ? "warning" : "green-500"
                }/10`}>
                  <AlertTriangle className={`h-6 w-6 ${
                    stressPrediction.risk_level === "high" ? "text-destructive" :
                    stressPrediction.risk_level === "medium" ? "text-warning" : "text-green-500"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    AI Stress Insights
                  </h3>
                  <p className="text-muted-foreground">
                    {stressPrediction.explanation}
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
          )}

          {/* Loading state for AI */}
          {aiLoading && (
            <div className="glass-card p-6 mb-8 border-primary/30 bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 animate-pulse">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Analyzing Your Workload...
                  </h3>
                  <p className="text-muted-foreground">
                    AI is calculating your stress levels and providing insights.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No data state */}
          {!stressPrediction && !aiLoading && !loading && (
            <div className="glass-card p-6 mb-8 border-warning/30 bg-warning/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    No Stress Data Available
                  </h3>
                  <p className="text-muted-foreground">
                    Add some deadlines to get AI-powered stress predictions and insights.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="heroFilled" size="sm" asChild>
                    <Link to="/deadlines">Add Deadlines</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <WeeklyChart
                data={
                  summary?.weekly_load.map(day => {
                    const stressData = stressPrediction?.daily_stress.find(d => d.day === day.day);
                    // If there are no tasks/deadlines, stress should be 0
                    const stress = (day.deadlines === 0 && day.hours === 0) 
                      ? 0 
                      : stressData?.stressLevel ?? 0;
                    return {
                      day: day.day,
                      deadlines: day.deadlines,
                      hours: day.hours,
                      stress: stress
                    };
                  }) ?? []
                }
              />
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Stats
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Current Risk Level
                    </span>
                  </div>
                  {stressPrediction && !aiLoading ? (
                    <RiskBadge level={stressPrediction.risk_level} size="lg" />
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Peak Stress Day
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {stressPrediction && !aiLoading ? stressPrediction.peak_stress_day : "—"}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-destructive rounded-full transition-all duration-500"
                      style={{ width: `${getPeakStressPercentage()}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">
                      Peak Stress Level
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {peakStress}%
                    </span>
                  </div>

                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-destructive rounded-full transition-all"
                      style={{ width: `${peakStress}%` }}
                    />
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
              <p className="text-sm text-muted-foreground">
                Add, edit, or remove deadlines
              </p>
            </Link>

            <Link
              to="/stress"
              className="glass-card p-6 group hover:border-primary/30 transition-all"
            >
              <Activity className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                Stress Breakdown
              </h3>
              <p className="text-sm text-muted-foreground">
                See what's causing stress
              </p>
            </Link>

            <Link
              to="/priorities"
              className="glass-card p-6 group hover:border-primary/30 transition-all"
            >
              <TrendingUp className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                Get Priorities
              </h3>
              <p className="text-sm text-muted-foreground">
                Know what to work on first
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;