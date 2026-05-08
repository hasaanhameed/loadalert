import api from "@/lib/axios";
import { DashboardSummary } from "@/lib/types";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
};