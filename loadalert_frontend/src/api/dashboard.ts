import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

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

export const getDashboardSummary = async () => {
  const response = await axios.get<DashboardSummary>(
    `${API_URL}/dashboard/summary`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};