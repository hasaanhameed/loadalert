import { cn } from "@/lib/utils";

type DayData = {
  day: string;
  deadlines: number;
};

interface WeeklyChartProps {
  data: DayData[];
}

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const maxDeadlines = Math.max(...data.map((d) => d.deadlines), 1);
  
  return (
    <div className="bg-pure-snow border border-obsidian-blood/5 rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="bg-fired-cream px-8 py-4 border-b border-obsidian-blood/5">
        <h3 className="text-xs font-black text-pure-snow uppercase tracking-[0.2em]">
          Weekly Distribution
        </h3>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex-1 flex items-end justify-between gap-4 min-h-[220px]">
          {data.map((day, index) => {
            const percentage = (day.deadlines / maxDeadlines) * 100;
            
            return (
              <div
                key={day.day}
                className="flex-1 flex flex-col items-center gap-6 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-full flex flex-col items-center justify-end h-48">
                  <span className={cn(
                    "text-[10px] font-black mb-3 transition-all duration-300 italic",
                    day.deadlines > 0 ? "text-fired-cream opacity-100" : "text-obsidian-blood/10 opacity-0 group-hover:opacity-100"
                  )}>
                    {day.deadlines}
                  </span>
                  
                  <div 
                    className={cn(
                      "w-full max-w-[24px] rounded-t-sm transition-all duration-1000 ease-out shadow-sm",
                      day.deadlines > 0 ? "bg-fired-cream" : "bg-obsidian-blood/5"
                    )}
                    style={{ 
                      height: `${Math.max(percentage, 2)}%`,
                    }}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-blood/60 group-hover:text-fired-cream transition-colors">
                    {day.day}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-obsidian-blood/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-fired-cream shadow-sm" />
            <span className="text-[9px] font-black uppercase tracking-widest text-obsidian-blood/40">Deadline Count</span>
          </div>
          <div className="text-[9px] font-black uppercase tracking-widest text-obsidian-blood/20 italic">
            Pulse Active
          </div>
        </div>
      </div>
    </div>
  );
};