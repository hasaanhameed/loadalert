import { StressPredictionResponse } from "@/api/stress";

export interface CachedStressContributors {
  contributors: {
    id: number;
    title: string;
    contribution: number;
    due_date: string;
  }[];
  max_contribution: number;
}

const STRESS_PREDICTION_PREFIX = "stress_prediction_cache_";
const STRESS_CONTRIBUTORS_PREFIX = "stress_contributors_cache_";

export const generateWeeklyLoadHash = (
  weeklyLoad: { day: string; hours: number; deadlines: number }[]
): string => {
  return JSON.stringify(
    weeklyLoad.map(d => ({
      day: d.day,
      hours: d.hours,
      deadlines: d.deadlines,
    }))
  );
};

export const generateStressContributorsHash = (
  deadlines: {
    id: number;
    due_date: string;
    estimated_effort: number;
    importance_level: string;
  }[]
): string => {
  return JSON.stringify(
    deadlines.map(d => ({
      id: d.id,
      due_date: d.due_date,
      estimated_effort: d.estimated_effort,
      importance_level: d.importance_level,
    }))
  );
};

export const getCachedStressPrediction = (
  hash: string
): StressPredictionResponse | null => {
  try {
    const raw = localStorage.getItem(STRESS_PREDICTION_PREFIX + hash);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const cacheStressPrediction = (
  hash: string,
  data: StressPredictionResponse
) => {
  try {
    localStorage.setItem(
      STRESS_PREDICTION_PREFIX + hash,
      JSON.stringify(data)
    );
  } catch {
    // Fail silently — cache should never crash UI
  }
};

export const getCachedStressContributors = (
  hash: string
): CachedStressContributors | null => {
  try {
    const raw = localStorage.getItem(STRESS_CONTRIBUTORS_PREFIX + hash);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const cacheStressContributors = (
  hash: string,
  data: CachedStressContributors
) => {
  try {
    localStorage.setItem(
      STRESS_CONTRIBUTORS_PREFIX + hash,
      JSON.stringify(data)
    );
  } catch {
    // Fail silently
  }
};
