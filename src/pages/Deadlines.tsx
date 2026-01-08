import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DeadlineCard, Deadline } from "@/components/DeadlineCard";
import { AddDeadlineModal } from "@/components/AddDeadlineModal";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Filter } from "lucide-react";

const initialDeadlines: Deadline[] = [
  {
    id: "1",
    title: "CS 301 - Algorithm Analysis Essay",
    dueDate: "2026-01-12",
    estimatedHours: 6,
    importance: "high",
  },
  {
    id: "2",
    title: "Statistics Midterm Preparation",
    dueDate: "2026-01-14",
    estimatedHours: 10,
    importance: "high",
  },
  {
    id: "3",
    title: "History Research Paper Draft",
    dueDate: "2026-01-15",
    estimatedHours: 8,
    importance: "medium",
  },
  {
    id: "4",
    title: "Physics Lab Report",
    dueDate: "2026-01-10",
    estimatedHours: 3,
    importance: "medium",
  },
  {
    id: "5",
    title: "Weekly Reading Response",
    dueDate: "2026-01-11",
    estimatedHours: 2,
    importance: "low",
  },
  {
    id: "6",
    title: "Group Project Meeting Prep",
    dueDate: "2026-01-13",
    estimatedHours: 1,
    importance: "low",
  },
];

const Deadlines = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const handleAddDeadline = (newDeadline: Omit<Deadline, "id">) => {
    if (editingDeadline) {
      setDeadlines((prev) =>
        prev.map((d) =>
          d.id === editingDeadline.id ? { ...newDeadline, id: d.id } : d
        )
      );
      setEditingDeadline(null);
    } else {
      setDeadlines((prev) => [
        ...prev,
        { ...newDeadline, id: Date.now().toString() },
      ]);
    }
  };

  const handleEdit = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
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
        onSave={handleAddDeadline}
        editingDeadline={editingDeadline}
      />
    </div>
  );
};

export default Deadlines;
