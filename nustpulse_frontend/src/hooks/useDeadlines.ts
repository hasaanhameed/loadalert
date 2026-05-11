import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchDeadlines, 
  createDeadline, 
  updateDeadline, 
  deleteDeadline 
} from "@/services/deadlines";
import { CreateDeadlineInput, UpdateDeadlineInput } from "@/lib/types";
import { toast } from "sonner";

export const useDeadlines = () => {
  const queryClient = useQueryClient();

  const deadlinesQuery = useQuery({
    queryKey: ["deadlines"],
    queryFn: fetchDeadlines,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateDeadlineInput) => createDeadline(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Deadline created successfully");
    },
    onError: () => {
      toast.error("Failed to create deadline");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeadlineInput }) => 
      updateDeadline(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Deadline updated successfully");
    },
    onError: () => {
      toast.error("Failed to update deadline");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDeadline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Deadline deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete deadline");
    },
  });

  return {
    deadlines: deadlinesQuery.data ?? [],
    isLoading: deadlinesQuery.isLoading,
    isError: deadlinesQuery.isError,
    createDeadline: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateDeadline: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteDeadline: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
