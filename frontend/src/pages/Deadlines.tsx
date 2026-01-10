import { useEffect, useState } from "react";
import {fetchDeadlines,createDeadline,updateDeadline,deleteDeadline} from "@/api/deadlines";

import { Navbar } from "@/components/Navbar";
import { DeadlineCard, Deadline } from "@/components/DeadlineCard";
import { AddDeadlineModal } from "@/components/AddDeadlineModal";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Filter } from "lucide-react";



const Deadlines = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">("all");

  useEffect(() => {
    const loadDeadlines = async () => {
      try {
        const data = await fetchDeadlines();
  
        // map backend → frontend shape
        const formatted = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          dueDate: d.due_date,
          estimatedHours: d.estimated_effort,
          importance: d.importance_level.toLowerCase(),
        }));
  
        setDeadlines(formatted);
      } catch (err) {
        console.error("Failed to fetch deadlines", err);
      } finally {
        setLoading(false);
      }
    };
  
    loadDeadlines();
  }, []);  


  const handleSaveDeadline = async (data: Omit<Deadline, "id">) => {
    const payload = {
      title: data.title,
      due_date: data.dueDate,
      estimated_effort: data.estimatedHours,
      importance_level:
        data.importance.charAt(0).toUpperCase() + data.importance.slice(1),
    };
  
    try {
      // 🟢 EDIT
      if (editingDeadline) {
        const updated = await updateDeadline(
          Number(editingDeadline.id),
          payload
        );
  
        setDeadlines((prev) =>
          prev.map((d) =>
            d.id === editingDeadline.id
              ? {
                  id: updated.id,
                  title: updated.title,
                  dueDate: updated.due_date,
                  estimatedHours: updated.estimated_effort,
                  importance: updated.importance_level.toLowerCase(),
                }
              : d
          )
        );
      }
      else {
        const created = await createDeadline(payload);
  
        setDeadlines((prev) => [
          ...prev,
          {
            id: created.id,
            title: created.title,
            dueDate: created.due_date,
            estimatedHours: created.estimated_effort,
            importance: created.importance_level.toLowerCase(),
          },
        ]);
      }
  
      setIsModalOpen(false);
      setEditingDeadline(null);
    } catch (err) {
      console.error("Failed to save deadline", err);
    }
  };

  const handleEdit = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    setIsModalOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteDeadline(Number(id));
      setDeadlines((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to delete deadline", err);
    }
  };
  const filteredDeadlines = deadlines
    .filter((d) => filter === "all" || d.importance === filter)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const totalHours = filteredDeadlines.reduce((sum, d) => sum + d.estimatedHours, 0);

  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <main className="pt-24 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Deadlines</h1>
              <p className="text-muted-foreground">
                {filteredDeadlines.length} deadlines • {totalHours}h total effort
              </p>
            </div>
            <Button
              variant="glow"
              onClick={() => {
                setEditingDeadline(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Deadline
            </Button>
          </div>

          {/* Filters */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter by importance:</span>
              </div>
              <div className="flex gap-2">
                {(["all", "low", "medium", "high"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilter(level)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filter === level
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Deadlines List */}
          <div className="space-y-4">
            {filteredDeadlines.length > 0 ? (
              filteredDeadlines.map((deadline) => (
                <DeadlineCard
                  key={deadline.id}
                  deadline={deadline}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="glass-card p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No deadlines found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {filter !== "all"
                    ? "Try changing the filter or add a new deadline."
                    : "Get started by adding your first deadline."}
                </p>
                <Button
                  variant="heroFilled"
                  onClick={() => {
                    setEditingDeadline(null);
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deadline
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <AddDeadlineModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      onSave={handleSaveDeadline}
      editingDeadline={editingDeadline}
      />

    </div>
  );
};

export default Deadlines;
