import { useAuth } from "@/src/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAvatarApi } from "./user.api";

export const useUpdateAvatarMutation = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (formData: FormData) => updateAvatarApi(formData),
    onSuccess: async (response: any) => {
      const updatedUser = response.data;
      
      // Update local storage and context with new user data
      if (updatedUser) {
        await updateUser(updatedUser);
      }
      
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });
};
