import { Navbar } from "@/components/Navbar";
import { PriorityCard } from "@/components/PriorityCard";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchDeadlines } from "@/api/deadlines";
import { getPriorities } from "@/api/ai";
import { generatePrioritiesHash, getCachedPriorities, cachePriorities } from "@/utils/aiCache";

const Priorities = () => {
  const { token } = useAuth();
  const [priorities, setPriorities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPriorities = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const deadlines = await fetchDeadlines();

        const tasks = deadlines.map((d: any) => ({
          id: d.id,
          title: d.title,
          due_date: d.due_date,
          estimated_effort: d.estimated_hours || d.estimated_effort,
          importance_level: d.importance || d.importance_level,
        }));

        // Generate hash from current tasks
        const currentHash = generatePrioritiesHash(tasks);
        
        // Try to get cached priorities
        const cachedData = getCachedPriorities(currentHash);
        
        if (cachedData) {
          // Use cached data
          console.log("Using cached priorities");
          const formattedPriorities = cachedData.map((task: any) => ({
            id: task.id.toString(),
            title: task.title,
            reason: task.reason,
            estimatedHours: task.estimated_effort,
            dueDate: task.due_date,
            priority: task.rank,
          }));
          setPriorities(formattedPriorities);
          setLoading(false);
          return;
        }

        // No cache, fetch from API
        console.log("Fetching priorities from API");
        const result = await getPriorities(token, tasks);
        
        // Cache the raw result
        cachePriorities(currentHash, result.priorities);
        
        // Transform snake_case API response to camelCase for PriorityCard
        const formattedPriorities = result.priorities.map((task: any) => ({
          id: task.id.toString(),
          title: task.title,
          reason: task.reason,
          estimatedHours: task.estimated_effort,
          dueDate: task.due_date,
          priority: task.rank,
        }));
        
        setPriorities(formattedPriorities);
      } catch (err) {
        console.error("Failed to load priorities", err);
      } finally {
        setLoading(false);
      }
    };

    loadPriorities();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-primary/40 rounded-full animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Loading Priorities
            </h2>
            <p className="text-sm text-muted-foreground">
              Preparing your priority recommendations...
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
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Priority Recommendations</h1>
            <p className="text-muted-foreground">
              {priorities.length} tasks • Ordered by recommended priority
            </p>
          </div>

          {/* Insight Banner */}
          <div className="glass-card p-6 mb-8 border-primary/30 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Smart Priority Algorithm
                </h3>
                <p className="text-muted-foreground">
                  Tasks are prioritized based on deadline proximity, estimated effort, and 
                  importance level. Quick wins are boosted to help you build momentum and 
                  reduce cognitive load early.
                </p>
              </div>
            </div>
          </div>

          {/* Priority List */}
          {priorities.length > 0 ? (
            <div className="space-y-4 mb-8">
              {priorities.map((task) => (
                <PriorityCard key={task.id} task={task} rank={task.priority} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center mb-8">
              <p className="text-muted-foreground">
                No tasks found. Add some deadlines to get priority recommendations.
              </p>
            </div>
          )}

          {/* Action Section */}
          <div className="glass-card p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Ready to tackle your priorities?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Head to your deadlines page to mark tasks as complete and update your progress.
            </p>
            <Button variant="glow" size="lg" asChild>
              <Link to="/deadlines" className="group">
                Go to Deadlines
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Priorities;