import { useEffect, useState } from "react";
import { fetchDeadlines, syncDeadlines, deleteDeadline, togglePin } from "@/services/deadlines";
import { Navbar } from "@/components/Navbar";
import { DeadlineCard } from "@/components/DeadlineCard";
import { Deadline } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, GraduationCap, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Deadlines = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const loadDeadlines = async () => {
    try {
      setLoading(true);
      const data = await fetchDeadlines();
      
      // Filter: Manual (lms_event_id is null) OR Pinned (is_pinned is true)
      const myDeadlines = data.filter(d => d.lms_event_id === null || d.is_pinned === true);
      
      const formatted = myDeadlines.map((d: any) => ({
        id: String(d.id),
        title: d.title,
        dueDate: d.due_date,
        courseName: d.course_name,
        lms_event_id: d.lms_event_id,
        is_pinned: d.is_pinned
      }));
      setDeadlines(formatted);
    } catch (err) {
      console.error("Failed to fetch deadlines", err);
      toast.error("Failed to load your deadlines");
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
      toast.success("Deadlines updated");
      await loadDeadlines();
    } catch (err) {
      console.error("Sync failed", err);
      toast.error("Sync failed. Check LMS credentials.");
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDeadline(Number(id));
      setDeadlines((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deadline removed");
    } catch (err) {
      console.error("Failed to delete deadline", err);
      toast.error("Action failed");
    }
  };

  const handlePin = async (id: string, isPinned: boolean) => {
    try {
      await togglePin(Number(id), isPinned);
      if (!isPinned) {
        // If unpinned, remove from this view if it's an LMS item
        setDeadlines((prev) => prev.filter((d) => d.id !== id || d.lms_event_id === null));
      } else {
        setDeadlines((prev) => 
          prev.map((d) => d.id === id ? { ...d, is_pinned: isPinned } : d)
        );
      }
      toast.success(isPinned ? "Added to My Deadlines" : "Removed from My Deadlines");
    } catch (err) {
      console.error("Failed to toggle pin", err);
      toast.error("Action failed");
    }
  };

  const courses = Array.from(new Set(deadlines.map(d => d.courseName).filter(Boolean)));

  const filteredDeadlines = deadlines
    .filter((d) => filter === "all" || d.courseName === filter)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (loading && deadlines.length === 0) {
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

      <main className="pt-24 md:pt-28 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-12">
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-obsidian-blood uppercase tracking-tight italic">My Deadlines</h1>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-blood/40">
                {deadlines.length} Active Deadlines • Personal List
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-2">
              <Button
                variant="default"
                size="lg"
                onClick={handleSync}
                disabled={syncing}
                className="w-full sm:w-auto h-12 md:h-14 px-8 rounded-xl bg-fired-cream text-obsidian-blood text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:bg-fired-cream/80 border-0 transition-all"
              >
                {syncing ? (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-3 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-3" />
                    Update List
                  </>
                )}
              </Button>
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-obsidian-blood/30 text-center sm:text-right">
                Sync LMS & auto-remove submitted tasks
              </p>
            </div>
          </div>

          {/* Subject Filter */}
          <div className="bg-pure-snow border border-obsidian-blood/5 p-4 md:p-6 rounded-2xl mb-8 md:mb-10 shadow-sm">
            <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none">
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 bg-obsidian-blood/5 rounded-lg">
                  <Filter className="h-4 w-4 text-obsidian-blood/60" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/60">Subject:</span>
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
                  All Tasks
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
                  onToggleMyDeadlines={handlePin}
                />
              ))
            ) : (
              <div className="bg-pure-snow border border-dashed border-obsidian-blood/10 rounded-2xl p-20 text-center">
                <div className="w-16 h-16 bg-obsidian-blood/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-obsidian-blood/20" />
                </div>
                <h3 className="text-xl font-black text-obsidian-blood uppercase tracking-tight italic mb-3">
                  No Personal Deadlines
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-blood/40 max-w-xs mx-auto leading-relaxed">
                  Your personal list is empty. Sync your LMS and browse the <Link to="/universal-pulse" className="text-obsidian-blood underline">Global Feed</Link> to add deadlines.
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
