import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface Club {
  id: number;
  clubId: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
}

export function useAuth() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: club, isLoading } = useQuery<Club | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) return null;
        const data = await response.json();
        return data.data?.club || null;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "فشل تسجيل الدخول");
      }
      return response.json();
    },
    onSuccess: async (data) => {
      // Invalidate and refetch the auth query immediately
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      // Navigate after auth state is updated
      navigate("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  return {
    club,
    isLoading,
    isAuthenticated: !!club,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginMutation,
    logoutMutation,
  };
}
