import { cn } from "@/lib/utils";
import { ArrowRight, Clock, Target } from "lucide-react";

interface PriorityTask {
  id: string;
  title: string;
  reason: string;
  estimatedHours: number;
  dueDate: string;
  priority: number;
}

interface PriorityCardProps {
  task: PriorityTask;
  rank: number;
}

export const PriorityCard = ({ task, rank }: PriorityCardProps) => {
  const rankColors = {
    1: "from-primary to-accent",
    2: "from-warning to-orange-500",
    3: "from-muted-foreground to-secondary",
  };

  return (
    <div className="glass-card p-5 transition-all duration-300 hover:shadow-lg group">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl text-lg font-bold bg-gradient-to-br text-primary-foreground shrink-0",
            rankColors[rank as keyof typeof rankColors] || "from-secondary to-muted"
          )}
        >
          {rank}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{task.reason}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{task.estimatedHours}h effort</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </div>
  );
};
