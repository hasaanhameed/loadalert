// Common Types
export interface WeeklyLoadDay {
  day: string;
  date: string;
  deadlines: number;
}

export interface CourseSummary {
  course_name: string;
  count: number;
}

export interface DashboardSummary {
  upcoming_deadlines: number;
  weekly_load: WeeklyLoadDay[];
  course_summary: CourseSummary[];
}

// Deadline Types
export interface Deadline {
  id: string | number;
  title: string;
  dueDate: string; // CamelCase for frontend
  due_date?: string; // SnakeCase for backend mapping
  courseName?: string | null;
  course_name?: string | null;
  estimatedHours?: number;
  importance?: string;
  lms_event_id?: number | null;
  is_pinned?: boolean;
}

export interface CreateDeadlineInput {
  title: string;
  due_date: string;
  estimated_effort: number;
  importance_level: string;
}

export interface UpdateDeadlineInput extends Partial<CreateDeadlineInput> {}

// User Types
export interface User {
  id: number;
  name: string;
  email?: string; // Added back to resolve UserContext errors
  lms_username: string;
}

export interface UserUpdateInput {
  name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface PasswordChangeInput {
  current_password: string;
  new_password: string;
}
