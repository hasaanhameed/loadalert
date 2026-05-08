import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/**
 * LOGIN
 */
export const loginUser = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await axios.post(`${API_BASE_URL}/login`, formData, {
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
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail ?? "Signup failed");
  }

  return response.json();
}