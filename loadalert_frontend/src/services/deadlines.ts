import api from "@/lib/axios";
import { Deadline, CreateDeadlineInput, UpdateDeadlineInput } from "@/lib/types";

export const fetchDeadlines = async (): Promise<Deadline[]> => {
  const res = await api.get<Deadline[]>("/deadlines/");
  return res.data;
};

export const createDeadline = async (data: CreateDeadlineInput): Promise<Deadline> => {
  const res = await api.post<Deadline>("/deadlines/", data);
  return res.data;
};

export const updateDeadline = async (
  id: number,
  data: UpdateDeadlineInput
): Promise<Deadline> => {
  const res = await api.put<Deadline>(`/deadlines/${id}`, data);
  return res.data;
};

export const deleteDeadline = async (id: number): Promise<void> => {
  await api.delete(`/deadlines/${id}`);
};