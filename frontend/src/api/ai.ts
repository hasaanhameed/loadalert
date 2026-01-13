import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface StressPredictionDay {
  day: string;
  stressLevel: number;
}

export interface StressPredictionResponse {
  daily_stress: StressPredictionDay[];
  weekly_stress_score: number;
  risk_level: "low" | "medium" | "high";
  peak_stress_day: string;
  explanation: string;
}

export const getStressPrediction = async (
  token: string,
  weeklyLoad: { day: string; hours: number; deadlines: number }[]
) => {
  const response = await axios.post<StressPredictionResponse>(
    `${API_URL}/ai/stress-prediction`,
    { weekly_load: weeklyLoad },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
