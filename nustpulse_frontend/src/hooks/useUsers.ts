import { useMutation } from "@tanstack/react-query";
import { updateUser, changePassword } from "@/services/users";
import { UserUpdateInput, PasswordChangeInput } from "@/lib/types";
import { toast } from "sonner";

export const useUsers = () => {
  const updateMutation = useMutation({
    mutationFn: (data: UserUpdateInput) => updateUser(data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordChangeInput) => changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to change password");
    },
  });

  return {
    updateProfile: updateMutation.mutate,
    isUpdatingProfile: updateMutation.isPending,
    changePassword: passwordMutation.mutate,
    isChangingPassword: passwordMutation.isPending,
  };
};
