import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { authStorage, storage, STORAGE_KEYS } from "../utils/auth-storage";
import { queryClient } from "./QueryProvider";


interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (userData: any, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  // 1️⃣ Load user and selected project from storage on startup
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const storedUser = await storage.getValue(STORAGE_KEYS.USER_PROFILE);
        const accessToken = await authStorage.getSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
        
        if (storedUser && accessToken) {
          setUser(storedUser);
        }
        console.log("Auth Data loaded:", { user: storedUser, hasToken: !!accessToken });
      } catch (e) {
        console.error("Failed to load auth data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedData();
  }, []);

  // 2️⃣ Handle routing
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const atRoot = (segments as any).length === 0;

    // Case A: Not logged in → Force to Login (if not already in auth group)
    if (!user) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
      return;
    }

    // Case B: Logged in → Redirect to Protected (if in auth group or at root)
    if (user) {
      if (inAuthGroup || atRoot) {
        router.replace("/(protected)");
      }
    }
  }, [user, isLoading, segments]);

  // 3️⃣ Login Implementation
  const login = async (userData: any, accessToken: string, refreshToken: string) => {
    // Update State
    setUser(userData);
    console.log("Login Success. User:", userData.userName || userData.username);

    // Save to Storage
    await storage.setValue(STORAGE_KEYS.USER_PROFILE, userData);
    await authStorage.setSecureValue(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await authStorage.setSecureValue(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  };

  // 4️⃣ Logout Implementation
  const logout = async () => {
    setUser(null);
    await storage.removeValue(STORAGE_KEYS.USER_PROFILE);
    await authStorage.removeSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
    await authStorage.removeSecureValue(STORAGE_KEYS.REFRESH_TOKEN);

    // Clear React Query Cache to prevent data leakage between sessions
    queryClient.clear();

    router.replace("/(auth)/login");
  };

  // 5️⃣ Update User Implementation
  const updateUser = async (userData: any) => {
    setUser(userData);
    await storage.setValue(STORAGE_KEYS.USER_PROFILE, userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
