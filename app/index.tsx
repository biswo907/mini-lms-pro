import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ActivityIndicator } from "react-native";

export default function LoadingScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center bg-white dark:bg-black">
      <ActivityIndicator size="large" />

      <ThemedText className="mt-4 text-base text-gray-600 dark:text-gray-300">
        Loading, please wait...
      </ThemedText>
    </ThemedView>
  );
}