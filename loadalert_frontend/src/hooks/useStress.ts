import { useMutation } from "@tanstack/react-query";
import { getStressContributors, getStressPrediction } from "@/services/stress";
import { StressContributorInput, StressPredictionInputDay } from "@/lib/types";

export const useStress = () => {
  const contributorsMutation = useMutation({
    mutationFn: (deadlines: StressContributorInput[]) => 
      getStressContributors(deadlines),
  });

  const predictionMutation = useMutation({
    mutationFn: (weeklyLoad: StressPredictionInputDay[]) => 
      getStressPrediction(weeklyLoad),
  });

  return {
    getContributors: contributorsMutation.mutateAsync,
    isGettingContributors: contributorsMutation.isPending,
    getPrediction: predictionMutation.mutateAsync,
    isPredicting: predictionMutation.isPending,
  };
};
