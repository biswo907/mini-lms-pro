import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const STORAGE_KEYS = {
  USER_PROFILE: "LMS_User",
  ACCESS_TOKEN: "LMS_AccessToken",
  REFRESH_TOKEN: "LMS_RefreshToken",
  BOOKMARKS_KEY: "LMS_Course_Bookmarks"
};

/**
 * Returns a user-specific bookmark storage key.
 * If userId is not provided, it falls back to the legacy global key.
 */
export const getBookmarkKey = (userId?: string) => {
  if (!userId) return STORAGE_KEYS.BOOKMARKS_KEY;
  return `${STORAGE_KEYS.BOOKMARKS_KEY}_${userId}`;
};

// ==============================
// Secure Value Storage (Tokens, etc)
// ==============================
export const authStorage = {
  async setSecureValue(key: string, value: string) {
    try {
      if (Platform.OS === "web") {
        // Web → fallback to AsyncStorage
        await AsyncStorage.setItem(key, value);
      } else {
        // Mobile → SecureStore
        await SecureStore.setItemAsync(
          key,
          value,
          {
            keychainAccessible:
              SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          }
        );
      }
    } catch (e) {
      console.error(`Secure Save Error for key ${key}`, e);
    }
  },

  async getSecureValue(key: string) {
    try {
      if (Platform.OS === "web") {
        return await AsyncStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (e) {
      console.error(`Secure Get Error for key ${key}`, e);
      return null;
    }
  },

  async removeSecureValue(key: string) {
    try {
      if (Platform.OS === "web") {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (e) {
      console.error(`Secure Remove Error for key ${key}`, e);
    }
  },
};

// ==============================
// General App Storage (User data, settings, etc)
// ==============================
export const storage = {
  async setValue(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error(`Storage Save Error for key ${key}`, e);
    }
  },

  async getValue(key: string) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error(`Storage Get Error for key ${key}`, e);
      return null;
    }
  },

  async removeValue(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Storage Remove Error for key ${key}`, e);
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.clear();
      if (Platform.OS !== "web") {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      }
    } catch (e) {
      console.error("Storage Clear Error", e);
    }
  },
};
