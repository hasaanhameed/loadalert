import { Calendar, Clock, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  estimatedHours: number;
  importance: "low" | "medium" | "high";
}

interface DeadlineCardProps {
  deadline: Deadline;
  onEdit?: (deadline: Deadline) => void;
  onDelete?: (id: string) => void;
}

const importanceStyles = {
  low: "border-success/30 bg-success/5",
  medium: "border-warning/30 bg-warning/5",
  high: "border-destructive/30 bg-destructive/5",
};

const importanceBadge = {
  low: "bg-success/20 text-success",
  medium: "bg-warning/20 text-warning",
  high: "bg-destructive/20 text-destructive",
};

export const DeadlineCard = ({ deadline, onEdit, onDelete }: DeadlineCardProps) => {
  const daysUntilDue = Math.ceil(
    (new Date(deadline.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className={cn(
        "glass-card p-5 transition-all duration-300 hover:shadow-lg group",
        importanceStyles[deadline.importance]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">{deadline.title}</h3>
            <span
              className={cn(
                "px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                importanceBadge[deadline.importance]
              )}
            >
              {deadline.importance}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{new Date(deadline.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{deadline.estimatedHours}h estimated</span>
            </div>
            {daysUntilDue <= 3 && daysUntilDue >= 0 && (
              <div className="flex items-center gap-1.5 text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span>{daysUntilDue === 0 ? "Due today!" : `${daysUntilDue} days left`}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(deadline)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(deadline.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
