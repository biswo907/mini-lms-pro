import { authStorage, storage, STORAGE_KEYS } from "@/src/utils/auth-storage";
import axios from "axios";
import { router } from "expo-router";

const http = axios.create({
  baseURL: "https://api.freeapi.app/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request Interceptor
http.interceptors.request.use(
  async (config) => {
    try {
      const token = await authStorage.getSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        if (!config.headers) config.headers = {} as any;
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("[HTTP] Request Interceptor Error:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isLoginUrl = originalRequest?.url?.includes("/users/login");
    const isRefreshUrl = originalRequest?.url?.includes("/users/refresh-token");

    // Handle 401 Unauthorized
    if (status === 401 && !isLoginUrl && !isRefreshUrl && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await authStorage.getSecureValue(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          // Attempt to refresh token
          // Note: Depending on your API, you might need to send refreshToken in body or headers
          const response = await axios.post("https://api.freeapi.app/api/v1/users/refresh-token", {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          await authStorage.setSecureValue(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          await authStorage.setSecureValue(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return http(originalRequest);
        }
      } catch (refreshError) {
        console.log("[HTTP] Refresh token failed or expired -> Logging out");
      }

      // If refresh fails or no refresh token, perform logout
      await authStorage.removeSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
      await authStorage.removeSecureValue(STORAGE_KEYS.REFRESH_TOKEN);
      await storage.removeValue(STORAGE_KEYS.USER_PROFILE);
 
      if (router) {
        router.replace("/(auth)/login");
      }
    }

    return Promise.reject(error);
  }
);

export default http;
