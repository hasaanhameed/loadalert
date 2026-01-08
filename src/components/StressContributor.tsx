import { cn } from "@/lib/utils";

interface StressContributorProps {
  title: string;
  contribution: number;
  dueDate: string;
  maxContribution: number;
}

export const StressContributor = ({
  title,
  contribution,
  dueDate,
  maxContribution,
}: StressContributorProps) => {
  const widthPercent = (contribution / maxContribution) * 100;

  const getBarColor = (percent: number) => {
    if (percent <= 30) return "bg-success";
    if (percent <= 60) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">
            Due {new Date(dueDate).toLocaleDateString()}
          </p>
        </div>
        <span className="text-sm font-semibold text-foreground">{contribution}%</span>
      </div>
      
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            getBarColor(contribution)
          )}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
};
