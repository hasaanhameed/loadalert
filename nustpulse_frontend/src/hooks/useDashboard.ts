import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/services/dashboard";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
