import { useAuth } from "@/src/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, registerApi } from "./auth.api";
import { LoginPayload, RegisterPayload } from "./auth.types";

// 🔐 Login Mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const responseBody = await loginApi(credentials);
      return responseBody;
    },

    onSuccess: async (response: any) => {
      const { user, accessToken, refreshToken } = response?.data || {};

      if (accessToken) {
        await login(user, accessToken, refreshToken);
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      }
    }
  });
};

// 📝 Register Mutation
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload)
  });
};

// 🔓 Logout Mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await logout();
      queryClient.clear();
    }
  });
};



