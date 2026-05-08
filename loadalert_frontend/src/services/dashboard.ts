import api from "@/lib/axios";

export interface WeeklyLoadDay {
  day: str;
  date: string;
  deadlines: number;
}

export interface CourseSummary {
  course_name: string;
  count: number;
}

export interface DashboardSummary {
  upcoming_deadlines: number;
  weekly_load: WeeklyLoadDay[];
  course_summary: CourseSummary[];
}

/**
 * GET DASHBOARD SUMMARY
 */
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await api.get<DashboardSummary>("/dashboard/summary");
  return res.data;
};