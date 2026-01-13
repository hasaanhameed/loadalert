import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const updateUser = async (data: { name: string; email: string }) => {
  const token = localStorage.getItem("access_token");

  const res = await axios.put(
    `${API_BASE_URL}/users/me`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
