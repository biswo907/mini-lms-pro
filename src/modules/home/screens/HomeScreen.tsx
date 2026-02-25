import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ThemedView className="flex-1">
        {/* Header */}
        <ThemedView className="flex-row justify-end p-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 p-2 rounded-full active:opacity-80"
          >
            <Ionicons name="log-out-outline" size={22} color="white" />
          </TouchableOpacity>
        </ThemedView>

        {/* Content */}
        <ThemedView className="flex-1 items-center justify-center">
          <ThemedText type="title">Home Screen</ThemedText>
          <ThemedText className="mt-2 text-slate-500 dark:text-slate-400">
            Welcome to your Learning Management System
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}