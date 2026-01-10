const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/**
 * LOGIN
 */
export async function loginUser(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email); // FastAPI OAuth2 expects "username"
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail ?? "Login failed");
  }

  return response.json(); // { access_token, token_type }
}

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

/**
 * EXTRACT EMAIL FROM JWT
 */
export function getEmailFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/**
 * FETCH USER BY EMAIL
 */
export async function getUserByEmail(email: string) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/users/by-email/${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}
