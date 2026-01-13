import { cn } from "@/lib/utils";

type DayData = {
  day: string;
  hours: number;
  deadlines: number;
  stressLevel?: number; // optional
};


interface WeeklyChartProps {
  data: DayData[];
}

const getStressColor = (level: number) => {
  if (level <= 30) return "bg-success";
  if (level <= 60) return "bg-warning";
  return "bg-destructive";
};

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const maxStress = Math.max(...data.map((d) => d.stressLevel), 100);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Weekly Stress Timeline</h3>
      
      <div className="flex items-end justify-between gap-3 h-48">
        {data.map((day, index) => {
          const heightPercent = (day.stressLevel / maxStress) * 100;
          
          return (
            <div
              key={day.day}
              className="flex-1 flex flex-col items-center gap-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative w-full flex flex-col items-center">
                <span className="text-xs text-muted-foreground mb-1">
                  {day.stressLevel}%
                </span>
                <div
                  className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out"
                  style={{ height: `${heightPercent}%`, minHeight: "8px" }}
                >
                  <div
                    className={cn(
                      "w-full h-full rounded-t-lg transition-colors",
                      getStressColor(day.stressLevel)
                    )}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{day.day}</p>
                <p className="text-xs text-muted-foreground">
                  {day.deadlines} task{day.deadlines !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Low (0-30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Medium (31-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">High (61-100%)</span>
        </div>
      </div>
    </div>
  );
};
