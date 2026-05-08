import api from "@/lib/axios";
import { 
  StressContributorInput, 
  StressContributorsResponse, 
  StressPredictionInputDay, 
  StressPredictionResponse 
} from "@/lib/types";

export const getStressContributors = async (
  deadlines: StressContributorInput[]
): Promise<StressContributorsResponse> => {
  const response = await api.post<StressContributorsResponse>(
    "/stress/contributors",
    { deadlines }
  );
  return response.data;
};

export const getStressPrediction = async (
  weekly_load: StressPredictionInputDay[]
): Promise<StressPredictionResponse> => {
  const response = await api.post<StressPredictionResponse>(
    "/ai/stress-prediction",
    { weekly_load }
  );
  return response.data;
};