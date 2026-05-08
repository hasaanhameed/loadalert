import { useMutation } from "@tanstack/react-query";
import { getStressPrediction, getPriorities } from "@/services/ai";
import { StressPredictionInputDay, PriorityTaskInput } from "@/lib/types";

export const useAI = () => {
  const stressPredictionMutation = useMutation({
    mutationFn: (weeklyLoad: StressPredictionInputDay[]) => 
      getStressPrediction(weeklyLoad),
  });

  const prioritiesMutation = useMutation({
    mutationFn: (tasks: PriorityTaskInput[]) => 
      getPriorities(tasks),
  });

  return {
    getStressPrediction: stressPredictionMutation.mutateAsync,
    isPredictingStress: stressPredictionMutation.isPending,
    getPriorities: prioritiesMutation.mutateAsync,
    isGettingPriorities: prioritiesMutation.isPending,
  };
};
