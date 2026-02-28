import { useQuery } from "@tanstack/react-query";
import { getCurrentUserApi } from "./user.api";

export const useGetCurrentUserQuery = () => {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: () => getCurrentUserApi(),
  });
};
