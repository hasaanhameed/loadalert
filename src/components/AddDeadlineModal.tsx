import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Deadline } from "./DeadlineCard";

interface AddDeadlineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (deadline: Omit<Deadline, "id">) => void;
  editingDeadline?: Deadline | null;
}

export const AddDeadlineModal = ({
  open,
  onOpenChange,
  onSave,
  editingDeadline,
}: AddDeadlineModalProps) => {
  const [title, setTitle] = useState(editingDeadline?.title || "");
  const [dueDate, setDueDate] = useState(editingDeadline?.dueDate || "");
  const [estimatedHours, setEstimatedHours] = useState(
    editingDeadline?.estimatedHours?.toString() || ""
  );
  const [importance, setImportance] = useState<"low" | "medium" | "high">(
    editingDeadline?.importance || "medium"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      dueDate,
      estimatedHours: parseInt(estimatedHours) || 1,
      importance,
    });
    setTitle("");
    setDueDate("");
    setEstimatedHours("");
    setImportance("medium");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {editingDeadline ? "Edit Deadline" : "Add New Deadline"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter deadline title"
              className="bg-muted/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-muted/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="text-sm font-medium text-foreground">
              Estimated Effort (hours)
            </Label>
            <Input
              id="hours"
              type="number"
              min="1"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g., 5"
              className="bg-muted/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Importance Level</Label>
            <Select value={importance} onValueChange={(v) => setImportance(v as typeof importance)}>
              <SelectTrigger className="bg-muted/50 border-border/50 focus:border-primary">
                <SelectValue placeholder="Select importance" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="glow" className="flex-1">
              {editingDeadline ? "Save Changes" : "Add Deadline"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
