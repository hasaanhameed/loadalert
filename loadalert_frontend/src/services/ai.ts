import api from "@/lib/axios";
import { 
  StressPredictionResponse, 
  PriorityTaskInput, 
  PriorityTaskOutput,
  StressPredictionInputDay
} from "@/lib/types";

export const getStressPrediction = async (
  weeklyLoad: StressPredictionInputDay[]
): Promise<StressPredictionResponse> => {
  const response = await api.post<StressPredictionResponse>(
    "/ai/stress-prediction",
    { weekly_load: weeklyLoad }
  );
  return response.data;
};

export const getPriorities = async (
  tasks: PriorityTaskInput[]
): Promise<PriorityTaskOutput[]> => {
  const response = await api.post<{ tasks: PriorityTaskOutput[] }>(
    "/ai/priorities", 
    { tasks }
  );
  // Based on previous implementation, it returns a list of priorities
  // The previous implementation used fetch and returned res.json()
  // Assuming the structure matches PriorityTaskOutput[]
  return (response.data as any).tasks || response.data;
};