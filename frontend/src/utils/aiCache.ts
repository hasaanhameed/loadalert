import { StressPredictionResponse } from "@/api/ai";
import { WeeklyLoadDay } from "@/api/dashboard";

// Cache keys
const AI_PREDICTION_CACHE_KEY = "ai_stress_prediction_cache";
const PRIORITIES_CACHE_KEY = "ai_priorities_cache";

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

// Generate hash for priorities based on task data
export const generatePrioritiesHash = (tasks: {
  id: number;
  due_date: string;
  estimated_effort: number;
  importance_level: string;
}[]) => {
  return JSON.stringify(
    tasks.map(t => ({
      id: t.id,
      due: t.due_date,
      effort: t.estimated_effort,
      importance: t.importance_level,
    }))
  );
};

// Get cached priorities if hash matches
export const getCachedPriorities = (currentHash: string) => {
  try {
    const cached = localStorage.getItem(PRIORITIES_CACHE_KEY);
    if (cached) {
      const { hash, priorities } = JSON.parse(cached);
      if (hash === currentHash) {
        console.log("Cache hit for priorities");
        return priorities;
      }
      console.log("Cache miss - hash mismatch");
    }
  } catch (error) {
    console.error("Failed to read cached priorities", error);
  }
  return null;
};

// Cache priorities with hash
export const cachePriorities = (hash: string, priorities: any) => {
  try {
    localStorage.setItem(PRIORITIES_CACHE_KEY, JSON.stringify({ hash, priorities }));
    console.log("Priorities cached successfully");
  } catch (error) {
    console.error("Failed to cache priorities", error);
  }
};

// Invalidate priorities cache (call when deadlines are added/removed/updated)
export const invalidatePrioritiesCache = () => {
  localStorage.removeItem(PRIORITIES_CACHE_KEY);
};

// Invalidate all AI caches
export const invalidateAllAICaches = () => {
  invalidateAIPredictionCache();
  invalidatePrioritiesCache();
};