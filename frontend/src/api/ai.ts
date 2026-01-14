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

export interface PriorityTaskInput {
  id: number;
  title: string;
  due_date: string;
  estimated_effort: number;
  importance_level: string;
}

export interface PriorityTaskOutput {
  id: number;
  title: string;
  rank: number;
  reason: string;
  estimated_effort: number;
  due_date: string;
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


export const getPriorities = async (
  token: string,
  tasks: PriorityTaskInput[]
) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/priorities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tasks }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch priorities");
  }

  return res.json();
};