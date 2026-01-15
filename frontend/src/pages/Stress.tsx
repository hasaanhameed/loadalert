import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { WeeklyChart } from "@/components/WeeklyChart";
import { StressContributor } from "@/components/StressContributor";
import { RiskBadge } from "@/components/RiskBadge";
import { Activity, TrendingDown, TrendingUp} from "lucide-react";
import { getDashboardSummary, DashboardSummary } from "@/api/dashboard";
import { fetchDeadlines, Deadline } from "@/api/deadlines";
import {
  getStressContributors,
  getStressPrediction,
  StressContributorOutput,
  StressPredictionResponse,
} from "@/api/stress";
import { useToast } from "@/hooks/use-toast";

import {
  generateWeeklyLoadHash,
  getCachedStressPrediction,
  cacheStressPrediction,
  generateStressContributorsHash,
  getCachedStressContributors,
  cacheStressContributors,
} from "@/utils/stressCache";


const Stress = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [stressPrediction, setStressPrediction] = useState<StressPredictionResponse | null>(null);
  const [stressContributors, setStressContributors] = useState<StressContributorOutput[]>([]);
  const [maxContribution, setMaxContribution] = useState(0);

  useEffect(() => {
    fetchStressData();
  }, []);

  const fetchStressData = async () => {
    try {
      setLoading(true);

      // Check if token exists
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to view stress data",
        });
        return;
      }

      // Fetch dashboard summary (for weekly load)
      const dashboard = await getDashboardSummary();
      setDashboardData(dashboard);

      // Fetch all deadlines (for contributors)
      const deadlines: Deadline[] = await fetchDeadlines();

      // Get stress prediction
      const weeklyLoad = dashboard.weekly_load.map((day) => ({
        day: day.day,
        hours: day.hours,
        deadlines: day.deadlines,
      }));

      const weeklyHash = generateWeeklyLoadHash(weeklyLoad);
      const cachedPrediction = getCachedStressPrediction(weeklyHash);

      if (cachedPrediction) {
        setStressPrediction(cachedPrediction);
      } else {
        const prediction = await getStressPrediction(weeklyLoad);
        setStressPrediction(prediction);
        cacheStressPrediction(weeklyHash, prediction);
      }


      // Get stress contributors (only for upcoming deadlines)
      if (deadlines.length > 0) {
        const deadlineInputs = deadlines.map((d: Deadline) => ({
          id: d.id,
          title: d.title,
          due_date: d.due_date,
          estimated_effort: d.estimated_effort,
          importance_level: d.importance_level,
        }));

        const sortedDeadlines = [...deadlineInputs].sort((a, b) => a.id - b.id);
        const contributorsHash = generateStressContributorsHash(sortedDeadlines);

        const cachedContributors = getCachedStressContributors(contributorsHash);

        if (cachedContributors) {
          setStressContributors(cachedContributors.contributors);
          setMaxContribution(cachedContributors.max_contribution);
        } else {
          const contributorsData = await getStressContributors(sortedDeadlines);
          setStressContributors(contributorsData.contributors);
          setMaxContribution(contributorsData.max_contribution);
          cacheStressContributors(contributorsHash, contributorsData);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.detail || "Failed to load stress data",
      });
    } finally {
      setLoading(false);
    }
  };

  // Prepare weekly chart data - include all required properties
  const weeklyChartData = dashboardData?.weekly_load.map((day) => {
    const stressDay = stressPrediction?.daily_stress.find((s) => s.day === day.day);
    return {
      day: day.day,
      hours: day.hours,
      deadlines: day.deadlines,
      stressLevel: stressDay?.stressLevel || 0,
    };
  }) || [];

  // Find best recovery day (lowest stress)
  const bestRecoveryDay = stressPrediction?.daily_stress.reduce((min, day) =>
    day.stressLevel < min.stressLevel ? day : min
  );

  // Find peak stress info
  const peakStressInfo = stressPrediction?.daily_stress.find(
    (day) => day.day === stressPrediction?.peak_stress_day
  );

  // Safely cast risk_level to the expected type
  const riskLevel = (stressPrediction?.risk_level as "low" | "medium" | "high") || "low";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/40 rounded-full animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Loading Stress Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Analyzing your workload and stress patterns...
            </p>
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
              <RiskBadge level={riskLevel} size="lg" />
              <p className="text-sm text-muted-foreground mt-3">
                Based on deadline proximity and workload
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Peak Stress Day</span>
                <TrendingUp className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stressPrediction?.peak_stress_day || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {peakStressInfo
                  ? `${peakStressInfo.stressLevel}% stress level predicted`
                  : "No data available"}
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Best Recovery Day</span>
                <TrendingDown className="h-5 w-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {bestRecoveryDay?.day || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {bestRecoveryDay
                  ? `Only ${bestRecoveryDay.stressLevel}% stress level`
                  : "No data available"}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            {/* Weekly Chart - Takes 3 columns */}
            <div className="lg:col-span-3">
              <WeeklyChart data={weeklyChartData} />
            </div>

            {/* Contributors - Takes 2 columns */}
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Top Stress Contributors
              </h3>
              <div className="space-y-5">
                {stressContributors.length > 0 ? (
                  stressContributors.slice(0, 5).map((contributor) => (
                    <StressContributor
                      key={contributor.id}
                      title={contributor.title}
                      contribution={contributor.contribution}
                      dueDate={contributor.due_date}
                      maxContribution={maxContribution}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No upcoming deadlines
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stress;