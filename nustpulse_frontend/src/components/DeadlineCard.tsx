import { useState } from "react";
import { Calendar, AlertTriangle, Trash2, GraduationCap, Plus, X, Loader2 } from "lucide-react";
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
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const daysUntilDue = Math.ceil(
    (new Date(deadline.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const handleToggle = async () => {
    if (!onToggleMyDeadlines) return;
    setIsToggling(true);
    try {
      await onToggleMyDeadlines(String(deadline.id), !deadline.is_pinned);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(String(deadline.id));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-pure-snow border border-obsidian-blood/5 p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group rounded-xl",
        deadline.is_pinned && "border-l-4 border-l-fired-cream"
      )}
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-obsidian-blood/5 text-obsidian-blood/60 rounded flex items-center gap-1.5">
                 <GraduationCap className="h-3 w-3" /> {deadline.courseName || deadline.course_name || "General"}
               </span>
               {deadline.is_pinned && (
                 <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-fired-cream/20 text-obsidian-blood/60 rounded flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                   <Plus className="h-3 w-3" /> Added to My List
                 </span>
               )}
             </div>
            <h3 className="text-lg md:text-xl font-black text-obsidian-blood uppercase tracking-tight italic leading-tight">{deadline.title}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(deadline.dueDate).toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} at {new Date(deadline.dueDate).toLocaleTimeString(undefined, { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            
            {daysUntilDue <= 5 && daysUntilDue >= 0 && (
              <div className={cn(
                "flex items-center gap-1.5 font-black",
                daysUntilDue <= 2 ? "text-red-500" : "text-amber-500"
              )}>
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{daysUntilDue === 0 ? "Due today!" : `${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'} remaining`}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-obsidian-blood/5 justify-end">
          {deadline.lms_event_id && onToggleMyDeadlines && (
            <Button
              variant="link"
              size="sm"
              onClick={handleToggle}
              disabled={isToggling}
              className={cn(
                "h-auto p-0 flex items-center gap-2 transition-all font-black uppercase text-[9px] tracking-widest hover:no-underline",
                deadline.is_pinned 
                  ? "text-primary hover:text-fired-cream" 
                  : "text-obsidian-blood/40 hover:text-obsidian-blood"
              )}
            >
              {isToggling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : deadline.is_pinned ? (
                <>
                  <X className="h-4 w-4" />
                  <span className="hidden xs:inline">Remove from My Deadlines</span>
                  <span className="xs:hidden">Remove</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden xs:inline">Add to My List</span>
                  <span className="xs:hidden">Add</span>
                </>
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-10 w-10 text-obsidian-blood/30 hover:text-red-500 hover:bg-red-50 transition-colors ml-auto md:ml-0"
          >
            {isDeleting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
