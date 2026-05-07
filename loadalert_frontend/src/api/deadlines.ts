import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface Deadline {
  id: number;
  title: string;
  due_date: string;
  estimated_effort: number;
  importance_level: string;
  user_id: number;
}

export const fetchDeadlines = async () => {
  const res = await axios.get(`${API_URL}/deadlines/`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createDeadline = async (data: {
  title: string;
  due_date: string;
  estimated_effort: number;
  importance_level: string;
}) => {
  const res = await axios.post(`${API_URL}/deadlines/`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateDeadline = async (
  id: number,
  data: {
    title?: string;
    due_date?: string;
    estimated_effort?: number;
    importance_level?: string;
  }
) => {
  const res = await axios.put(`${API_URL}/deadlines/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteDeadline = async (id: number) => {
  await axios.delete(`${API_URL}/deadlines/${id}`, {
    headers: getAuthHeaders(),
  });
};