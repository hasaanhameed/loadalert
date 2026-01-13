import { cn } from "@/lib/utils";

type DayData = {
  day: string;
  hours: number;
  deadlines: number;
  stress?: number; // Changed from stressLevel to stress
  stressLevel?: number; // Keep for backward compatibility
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
  // Check if we have any stress data
  const hasStressData = data.some((d) => (d.stress !== undefined && d.stress !== null) || (d.stressLevel !== undefined && d.stressLevel !== null));
  
  if (!hasStressData) {
    // Show a simple workload chart if no stress data
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Weekly Workload</h3>
        
        <div className="flex items-end justify-between gap-3 h-48">
          {data.map((day, index) => {
            const maxValue = Math.max(...data.map(d => Math.max(d.hours, d.deadlines * 2)), 10);
            const hoursHeight = (day.hours / maxValue) * 100;
            const deadlinesHeight = (day.deadlines * 2 / maxValue) * 100;
            
            return (
              <div
                key={day.day}
                className="flex-1 flex flex-col items-center gap-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-full flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-1">
                    {day.hours}h
                  </span>
                  <div className="w-full flex gap-1 items-end" style={{ height: '100%', minHeight: '120px' }}>
                    <div
                      className="flex-1 bg-primary rounded-t-lg transition-all duration-500"
                      style={{ height: `${hoursHeight}%`, minHeight: hoursHeight > 0 ? "8px" : "0" }}
                      title={`${day.hours} hours`}
                    />
                    <div
                      className="flex-1 bg-chart-2 rounded-t-lg transition-all duration-500"
                      style={{ height: `${deadlinesHeight}%`, minHeight: deadlinesHeight > 0 ? "8px" : "0" }}
                      title={`${day.deadlines} deadlines`}
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
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Deadlines</span>
          </div>
        </div>
      </div>
    );
  }

  // Show stress chart if we have stress data
  const maxStress = 100;

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Weekly Stress Timeline</h3>
      
      <div className="space-y-2">
        {/* Percentage labels row - fixed at top */}
        <div className="flex justify-between gap-3 h-6">
          {data.map((day) => {
            const stressValue = (day.deadlines === 0 && day.hours === 0) 
              ? 0 
              : (day.stress ?? day.stressLevel ?? 0);
            return (
              <div key={`label-${day.day}`} className="flex-1 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  {stressValue}%
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Chart bars container - fixed height */}
        <div className="flex items-end justify-between gap-3" style={{ height: '192px' }}>
          {data.map((day, index) => {
            // If there are no tasks/deadlines, stress must be 0
            const stressValue = (day.deadlines === 0 && day.hours === 0) 
              ? 0 
              : (day.stress ?? day.stressLevel ?? 0);
            // Calculate bar height as percentage of container height (192px)
            const barHeight = Math.min((stressValue / maxStress) * 192, 192);
            
            return (
              <div
                key={day.day}
                className="flex-1 flex justify-center items-end h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={cn(
                    "w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out",
                    getStressColor(stressValue)
                  )}
                  style={{ 
                    height: `${barHeight}px`, 
                    minHeight: stressValue > 0 ? "8px" : "4px",
                    maxHeight: '192px'
                  }}
                />
              </div>
            );
          })}
        </div>
        
        {/* Day labels row - fixed at bottom */}
        <div className="flex justify-between gap-3 h-12 mt-2">
          {data.map((day) => (
            <div key={`day-${day.day}`} className="flex-1 flex flex-col items-center justify-start">
              <p className="text-sm font-medium text-foreground">{day.day}</p>
              <p className="text-xs text-muted-foreground">
                {day.deadlines} task{day.deadlines !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
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