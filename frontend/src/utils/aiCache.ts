import { StressPredictionResponse } from "@/api/ai";
import { WeeklyLoadDay } from "@/api/dashboard";

// Cache key for AI predictions
const AI_PREDICTION_CACHE_KEY = "ai_stress_prediction_cache";

// Generate a hash of weekly load data to detect changes
export const generateWeeklyLoadHash = (weeklyLoad: WeeklyLoadDay[]): string => {
  const data = weeklyLoad.map(day => ({
    day: day.day,
    deadlines: day.deadlines,
    hours: day.hours
  }));
  return JSON.stringify(data);
};

// Get cached prediction if available and hash matches
export const getCachedPrediction = (currentHash: string): StressPredictionResponse | null => {
  try {
    const cached = localStorage.getItem(AI_PREDICTION_CACHE_KEY);
    if (cached) {
      const { hash, prediction } = JSON.parse(cached);
      if (hash === currentHash) {
        return prediction;
      }
    }
  } catch (error) {
    console.error("Failed to read cached prediction", error);
  }
  return null;
};

// Cache prediction with hash
export const cachePrediction = (hash: string, prediction: StressPredictionResponse) => {
  try {
    localStorage.setItem(AI_PREDICTION_CACHE_KEY, JSON.stringify({ hash, prediction }));
  } catch (error) {
    console.error("Failed to cache prediction", error);
  }
};

// Invalidate cache (call this when deadlines change)
export const invalidateAIPredictionCache = () => {
  localStorage.removeItem(AI_PREDICTION_CACHE_KEY);
};
