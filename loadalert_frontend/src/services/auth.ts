import api from "@/lib/axios";
import { AuthResponse } from "@/lib/types";

/**
 * LOGIN / CONNECT PORTAL
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/login", {
    email,
    password
  });

  return res.data;
};

// Signup is removed as users are auto-created via login