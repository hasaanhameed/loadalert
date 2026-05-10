import api from "@/lib/axios";
import { DashboardSummary } from "@/lib/types";

/**
 * GET DASHBOARD SUMMARY
 */
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await api.get<DashboardSummary>("/dashboard/summary");
  return res.data;
};