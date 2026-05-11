import { useMutation } from "@tanstack/react-query";
import { loginUser, signupUser } from "@/services/auth";
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

  const signupMutation = useMutation({
    mutationFn: ({ name, email, password }: any) =>
      signupUser(name, email, password),
    onSuccess: () => {
      toast.success("Signup successful! Please login.");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Signup failed");
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    logout,
  };
};
