import { Calendar, AlertTriangle, Trash2, GraduationCap, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Deadline } from "@/lib/types";

interface DeadlineCardProps {
  deadline: Deadline;
  onEdit?: (deadline: Deadline) => void;
  onDelete?: (id: string) => void;
  onToggleMyDeadlines?: (id: string, isAdded: boolean) => void;
}

export const DeadlineCard = ({ deadline, onDelete, onToggleMyDeadlines }: DeadlineCardProps) => {
  const daysUntilDue = Math.ceil(
    (new Date(deadline.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className={cn(
        "bg-pure-snow border border-obsidian-blood/5 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group rounded-xl",
        deadline.is_pinned && "border-l-4 border-l-fired-cream"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-obsidian-blood/5 text-obsidian-blood/60 rounded flex items-center gap-1.5">
                 <GraduationCap className="h-3 w-3" /> {deadline.courseName || deadline.course_name || "General"}
               </span>
               {deadline.is_pinned && (
                 <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-fired-cream/20 text-obsidian-blood/60 rounded flex items-center gap-1.5">
                   <Plus className="h-3 w-3" /> Added to My List
                 </span>
               )}
             </div>
            <h3 className="text-xl font-black text-obsidian-blood uppercase tracking-tight italic">{deadline.title}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(deadline.dueDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            {daysUntilDue <= 5 && daysUntilDue >= 0 && (
              <div className={cn(
                "flex items-center gap-1.5 font-black",
                daysUntilDue <= 2 ? "text-red-500" : "text-amber-500"
              )}>
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{daysUntilDue === 0 ? "Due today!" : `${daysUntilDue} days remaining`}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {deadline.lms_event_id && onToggleMyDeadlines && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleMyDeadlines(String(deadline.id), !deadline.is_pinned)}
              className={cn(
                "h-10 px-3 rounded-lg flex items-center gap-2 transition-all font-black uppercase text-[9px] tracking-widest",
                deadline.is_pinned 
                  ? "text-fired-cream hover:text-fired-cream/80 bg-fired-cream/5" 
                  : "text-obsidian-blood/30 hover:text-obsidian-blood hover:bg-obsidian-blood/5"
              )}
            >
              {deadline.is_pinned ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Remove List</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add to My List</span>
                </>
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(String(deadline.id))}
            className="h-10 w-10 text-obsidian-blood/30 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
