import api from "@/lib/axios";
import { AuthResponse } from "@/lib/types";

/**
 * LOGIN
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await api.post<AuthResponse>("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data;
};

/**
 * SIGNUP
 */
export async function signupUser(
  name: string,
  email: string,
  password: string
) {
  const response = await api.post("/users/", { name, email, password });
  return response.data;
}