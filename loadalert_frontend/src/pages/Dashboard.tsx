import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardSummary, DashboardSummary } from "@/services/dashboard";
import { useAuth } from "@/context/AuthContext";

import { Link } from "react-router-dom";

const Dashboard = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;

        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to load dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pure-snow">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-obsidian-blood/5 border-t-fired-cream rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black text-obsidian-blood uppercase italic tracking-tight">Pulse Loading</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">Preparing workload summary...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pure-snow pb-20">
      <Navbar />

      <main className="pt-28 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black text-obsidian-blood uppercase tracking-tighter italic mb-2">Dashboard</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-obsidian-blood/40">
              System Health • Weekly Workload Overview
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
            <StatsCard
              title="Upcoming Deadlines"
              value={summary?.upcoming_deadlines.toString() ?? "0"}
              subtitle="7-Day active window"
              variant="default"
            />
            <StatsCard
              title="Active Pulse Streams"
              value={summary?.course_summary.length.toString() ?? "0"}
              subtitle="Monitored course modules"
              variant="warning"
            />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2">
              <WeeklyChart
                data={
                  summary?.weekly_load.map(day => ({
                    day: day.day,
                    deadlines: day.deadlines
                  })) ?? []
                }
              />
            </div>

            <div className="bg-pure-snow border border-obsidian-blood/5 p-8 rounded-2xl shadow-sm">
              <h3 className="text-xs font-black text-obsidian-blood uppercase tracking-[0.2em] mb-8 pb-4 border-b border-obsidian-blood/5">
                Module Distribution
              </h3>

              <div className="space-y-6">
                {summary?.course_summary && summary.course_summary.length > 0 ? (
                  summary.course_summary.map((course, index) => (
                    <div key={course.course_name} className="flex flex-col gap-2 group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/60 truncate max-w-[180px] group-hover:text-obsidian-blood transition-colors">
                          {course.course_name}
                        </span>
                        <span className="text-[10px] font-black text-fired-cream italic">
                          {course.count}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-obsidian-blood/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-fired-cream rounded-full transition-all duration-700"
                          style={{ 
                            width: `${(course.count / summary.upcoming_deadlines) * 100}%`,
                            transitionDelay: `${index * 50}ms`
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/20">
                      No stream data available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              to="/deadlines"
              className="bg-pure-snow border border-obsidian-blood/5 p-10 rounded-2xl group hover:border-fired-cream/30 transition-all shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black text-obsidian-blood uppercase tracking-tight italic group-hover:text-fired-cream transition-colors">
                  Pulse Tracker
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">
                  Manage personal academic deadlines
                </p>
              </div>
            </Link>

            <Link
              to="/universal-pulse"
              className="bg-pure-snow border border-obsidian-blood/5 p-10 rounded-2xl group hover:border-fired-cream/30 transition-all shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black text-obsidian-blood uppercase tracking-tight italic group-hover:text-fired-cream transition-colors">
                  Global Stream
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">
                  Synchronize with university LMS
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;