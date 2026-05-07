import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface StressContributorInput {
  id: number;
  title: string;
  due_date: string;
  estimated_effort: number;
  importance_level: string;
}

export interface StressContributorOutput {
  id: number;
  title: string;
  contribution: number;
  due_date: string;
}

export interface StressContributorsResponse {
  contributors: StressContributorOutput[];
  max_contribution: number;
}

export interface StressPredictionDayInput {
  day: string;
  hours: number;
  deadlines: number;
}

export interface StressPredictionDayOutput {
  day: string;
  stressLevel: number;
}

export interface StressPredictionResponse {
  daily_stress: StressPredictionDayOutput[];
  weekly_stress_score: number;
  risk_level: string;
  peak_stress_day: string;
  explanation: string;
}

export const getStressContributors = async (
  deadlines: StressContributorInput[]
): Promise<StressContributorsResponse> => {
  const response = await axios.post<StressContributorsResponse>(
    `${API_URL}/stress/contributors`,
    { deadlines },
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

export const getStressPrediction = async (
  weekly_load: StressPredictionDayInput[]
): Promise<StressPredictionResponse> => {
  const response = await axios.post<StressPredictionResponse>(
    `${API_URL}/ai/stress-prediction`,
    { weekly_load },
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};