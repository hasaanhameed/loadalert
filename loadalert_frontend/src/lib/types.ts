// Common Types
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

// Deadline Types
export interface Deadline {
  id: number;
  title: string;
  due_date: string;
  estimated_effort: number;
  importance_level: string;
  user_id: number;
}

export interface CreateDeadlineInput {
  title: string;
  due_date: string;
  estimated_effort: number;
  importance_level: string;
}

export interface UpdateDeadlineInput {
  title?: string;
  due_date?: string;
  estimated_effort?: number;
  importance_level?: string;
}

// AI & Prediction Types
export interface StressPredictionDay {
  day: string;
  stressLevel: number;
}

export interface StressPredictionResponse {
  daily_stress: StressPredictionDay[];
  weekly_stress_score: number;
  risk_level: string;
  peak_stress_day: string;
  explanation: string;
}

export interface StressPredictionInputDay {
  day: string;
  hours: number;
  deadlines: number;
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

// Stress Analysis Types
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

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserUpdateInput {
  name: string;
  email: string;
}

export interface PasswordChangeInput {
  current_password: string;
  new_password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
