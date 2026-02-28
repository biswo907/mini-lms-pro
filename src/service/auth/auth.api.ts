import http from "../api/http";
import { LoginPayload, RegisterPayload } from "./auth.types";

// 🔐 Login
export const loginApi = async (
  payload: LoginPayload
): Promise<any> => {
  const { data } = await http.post("/users/login", payload);
  return data;
};
export const registerApi = async (
  payload: RegisterPayload
): Promise<any> => {
  const { data } = await http.post("/users/register", payload);
  return data;
};




