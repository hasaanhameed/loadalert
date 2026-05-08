import { useEffect, useState } from "react";
import { fetchDeadlines, syncDeadlines, deleteDeadline } from "@/services/deadlines";
import { Navbar } from "@/components/Navbar";
import { DeadlineCard } from "@/components/DeadlineCard";
import { Deadline } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Calendar, Filter, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Deadlines = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const loadDeadlines = async () => {
    try {
      setLoading(true);
      const data = await fetchDeadlines();
      const formatted = data.map((d: any) => ({
        id: String(d.id),
        title: d.title,
        dueDate: d.due_date,
        courseName: d.course_name
      }));
      setDeadlines(formatted);
    } catch (err) {
      console.error("Failed to fetch deadlines", err);
      toast.error("Failed to load deadlines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeadlines();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await syncDeadlines();
      toast.success("Portal synchronized successfully");
      await loadDeadlines();
    } catch (err) {
      console.error("Sync failed", err);
      toast.error("Portal synchronization failed. Check LMS credentials.");
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDeadline(Number(id));
      setDeadlines((prev) => prev.filter((d) => d.id !== id));
      toast.success("Assignment dismissed");
    } catch (err) {
      console.error("Failed to delete deadline", err);
      toast.error("Action failed");
    }
  };

  // Extract unique courses for filtering
  const courses = Array.from(new Set(deadlines.map(d => d.courseName).filter(Boolean)));

  const filteredDeadlines = deadlines
    .filter((d) => filter === "all" || d.courseName === filter)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (loading && deadlines.length === 0) {
    return (
      <div className="min-h-screen bg-fired-cream">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-obsidian-blood/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fired-cream pb-20">
      <Navbar />

      <main className="pt-28 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-obsidian-blood uppercase tracking-tight italic">Pulse List</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-blood/40">
                {deadlines.length} Active Assignments • Synced via LMS
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={handleSync}
              disabled={syncing}
              className="h-16 px-8 rounded-xl bg-pure-snow text-obsidian-blood text-[10px] font-black uppercase italic tracking-[0.2em] shadow-xl hover:bg-pure-snow/90 hover:scale-[1.02] active:scale-[0.98] border border-obsidian-blood/5 transition-all duration-300"
            >
              {syncing ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-3 animate-spin" />
                  Syncing Pulse...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 mr-3" />
                  Sync Portal
                </>
              )}
            </Button>
          </div>

          {/* Subject Filter */}
          <div className="bg-pure-snow border border-obsidian-blood/5 p-6 rounded-2xl mb-10 shadow-sm">
            <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none">
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 bg-obsidian-blood/5 rounded-lg">
                  <Filter className="h-4 w-4 text-obsidian-blood/60" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/60">Subjects:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                    filter === "all"
                      ? "bg-obsidian-blood text-pure-snow shadow-lg"
                      : "bg-obsidian-blood/5 text-obsidian-blood/40 hover:bg-obsidian-blood/10"
                  )}
                >
                  All PULSE
                </button>
                {courses.map((course) => (
                  <button
                    key={course}
                    onClick={() => setFilter(course!)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                      filter === course
                        ? "bg-obsidian-blood text-pure-snow shadow-lg"
                        : "bg-obsidian-blood/5 text-obsidian-blood/40 hover:bg-obsidian-blood/10"
                    )}
                  >
                    {course}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Deadlines List */}
          <div className="space-y-6">
            {filteredDeadlines.length > 0 ? (
              filteredDeadlines.map((deadline) => (
                <DeadlineCard
                  key={deadline.id}
                  deadline={deadline}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="bg-pure-snow border border-dashed border-obsidian-blood/10 rounded-2xl p-20 text-center">
                <div className="w-16 h-16 bg-obsidian-blood/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-8 w-8 text-obsidian-blood/20" />
                </div>
                <h3 className="text-xl font-black text-obsidian-blood uppercase tracking-tight italic mb-3">
                  No Assignments Found
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-blood/40 max-w-xs mx-auto leading-relaxed">
                  {filter !== "all"
                    ? "Try checking another subject for pulse activity."
                    : "Connect your portal or click sync to fetch latest data."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Deadlines;
