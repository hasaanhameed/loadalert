import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface WeeklyLoadDay {
  day: string;
  date: string;
  deadlines: number;
  hours: number;
}

export interface DashboardSummary {
  upcoming_deadlines: number;
  total_hours: number;
  weekly_load: WeeklyLoadDay[];
}

export const getDashboardSummary = async (token: string) => {
  const response = await axios.get<DashboardSummary>(
    `${API_URL}/dashboard/summary`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
