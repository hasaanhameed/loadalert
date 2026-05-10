import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/services/dashboard";
import { DashboardSummary } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

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
      <div className="min-h-screen bg-pure-snow">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-obsidian-blood/20" />
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

            <div className="bg-pure-snow border border-obsidian-blood/5 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-fired-cream px-8 py-4 border-b border-obsidian-blood/5">
                <h3 className="text-xs font-black text-pure-snow uppercase tracking-[0.2em]">
                  Module Distribution
                </h3>
              </div>
              
              <div className="p-8 space-y-6 flex-1">
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
          
          {/* Agenda Section */}
          <div className="mb-12">
            <div className="bg-fired-cream px-8 py-4 rounded-t-2xl border-b border-obsidian-blood/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-pure-snow uppercase tracking-[0.2em]">
                Agenda • Weekly Pulse
              </h3>
              <span className="text-[10px] font-black text-pure-snow/60 uppercase tracking-widest italic">
                {summary?.upcoming_deadlines} Total Items
              </span>
            </div>
            <div className="bg-pure-snow border-x border-b border-obsidian-blood/5 rounded-b-2xl p-4 grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {summary?.weekly_load.map((day) => (
                <div key={day.date} className="bg-obsidian-blood/[0.02] border border-obsidian-blood/[0.03] rounded-xl p-4 hover:bg-obsidian-blood/[0.04] transition-all flex flex-col min-h-[160px]">
                  <div className="flex flex-col gap-1 mb-4 pb-3 border-b border-obsidian-blood/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-fired-cream italic">
                      {day.day}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-obsidian-blood/40">
                      {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {day.deadlines_list && day.deadlines_list.length > 0 ? (
                      day.deadlines_list.map((deadline) => (
                        <div key={deadline.id} className="group cursor-default">
                          <p className="text-[10px] font-black text-obsidian-blood/80 uppercase tracking-tight leading-tight mb-1 group-hover:text-fired-cream transition-colors">
                            {deadline.title}
                          </p>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] font-black uppercase tracking-[0.1em] text-fired-cream/70">
                              {new Date(deadline.due_date).toLocaleTimeString(undefined, { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </span>
                            <span className="text-[7px] font-black uppercase tracking-widest text-obsidian-blood/20 truncate group-hover:text-obsidian-blood/40 transition-colors">
                              {deadline.course_name || "General"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center py-4">
                        <span className="text-[8px] font-black uppercase tracking-widest text-obsidian-blood/10 italic">
                          Clear
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
                  My Deadlines
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