import { Navbar } from "@/components/Navbar";
import { PriorityCard } from "@/components/PriorityCard";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const priorityTasks = [
  {
    id: "1",
    title: "Physics Lab Report",
    reason: "Due soonest (Jan 10). Quick win with only 3 hours of work. Completing this first will reduce immediate pressure.",
    estimatedHours: 3,
    dueDate: "2026-01-10",
    priority: 1,
  },
  {
    id: "2",
    title: "Weekly Reading Response",
    reason: "Low effort (2 hours) with an upcoming deadline. Knock this out to clear your task list.",
    estimatedHours: 2,
    dueDate: "2026-01-11",
    priority: 2,
  },
  {
    id: "3",
    title: "CS 301 - Algorithm Analysis Essay",
    reason: "High importance with significant effort required. Start early to avoid last-minute stress.",
    estimatedHours: 6,
    dueDate: "2026-01-12",
    priority: 3,
  },
  {
    id: "4",
    title: "Group Project Meeting Prep",
    reason: "Low effort task. Complete before the meeting to be prepared and contribute effectively.",
    estimatedHours: 1,
    dueDate: "2026-01-13",
    priority: 4,
  },
  {
    id: "5",
    title: "Statistics Midterm Preparation",
    reason: "Most time-intensive task. Break into daily study sessions leading up to Jan 14.",
    estimatedHours: 10,
    dueDate: "2026-01-14",
    priority: 5,
  },
  {
    id: "6",
    title: "History Research Paper Draft",
    reason: "Medium importance. With earlier tasks completed, dedicate focused time closer to the deadline.",
    estimatedHours: 8,
    dueDate: "2026-01-15",
    priority: 6,
  },
];

const Priorities = () => {
  const totalHours = priorityTasks.reduce((sum, t) => sum + t.estimatedHours, 0);

  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <main className="pt-24 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Priority Recommendations</h1>
            <p className="text-muted-foreground">
              {priorityTasks.length} tasks • {totalHours}h total effort • Ordered by recommended priority
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
          <div className="space-y-4 mb-8">
            {priorityTasks.map((task, index) => (
              <PriorityCard key={task.id} task={task} rank={index + 1} />
            ))}
          </div>

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
