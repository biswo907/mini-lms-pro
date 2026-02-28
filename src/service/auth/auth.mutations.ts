import { useAuth } from "@/src/context/AuthContext";
import { useSnackbar } from "@/src/context/SnackbarContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, registerApi } from "./auth.api";
import { LoginPayload, RegisterPayload } from "./auth.types";

// 🔐 Login Mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const responseBody = await loginApi(credentials);
      return responseBody;
    },

    onSuccess: async (response: any) => {
      const { user, accessToken, refreshToken } = response?.data || {};

      if (accessToken) {
        await login(user, accessToken, refreshToken);
        showSnackbar("Welcome back! You've logged in successfully. 👋", "success");
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
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async () => {
      await logout();
      showSnackbar("You've been logged out. See you again soon! 👋", "success");
      queryClient.clear();
    }
  });
};



