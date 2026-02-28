import { authStorage, STORAGE_KEYS } from "@/src/utils/auth-storage";
import axios from "axios";
import http from "../api/http";

export const updateAvatarApi = async (formData: FormData): Promise<any> => {
  const token = await authStorage.getSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
  
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  // Using PATCH as specified by the user
  const { data } = await axios.patch(`${http.defaults.baseURL}/users/avatar`, formData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token.trim()}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
export const getCurrentUserApi = async (): Promise<any> => {
  const token = await authStorage.getSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
  
  const { data } = await axios.get(`${http.defaults.baseURL}/users/current-user`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token?.trim()}`,
    },
  });
  return data;
};
