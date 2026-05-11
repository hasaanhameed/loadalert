import api from "@/lib/axios";
import { UserUpdateInput, PasswordChangeInput } from "@/lib/types";

export const updateUser = async (data: UserUpdateInput) => {
  const res = await api.put("/users/me", data);
  return res.data;
};

export const changePassword = async (payload: PasswordChangeInput) => {
  const response = await api.put("/users/change-password", payload);
  return response.data;
};
