import { useMutation } from "@tanstack/react-query";
import { loginUser, googleAuthorize } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      toast.success("Login successful");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Login failed");
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: (token: string) => googleAuthorize(token),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast.error("Failed to connect Google account");
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("gmail_nudge_seen");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    connectGoogle: googleAuthMutation.mutate,
    isConnectingGoogle: googleAuthMutation.isPending,
    logout,
  };
};
