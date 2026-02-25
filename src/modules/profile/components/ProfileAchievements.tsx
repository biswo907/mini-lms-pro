import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface ProfileAchievementsProps {
  title?: string;
  onViewAll?: () => void;
  emptyMessage?: string;
}

export const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({
  title = "Achievements",
  onViewAll,
  emptyMessage = "Start learning to unlock your first achievement!",
}) => {
  return (
    <View className="px-6 mt-8 mb-10">
      <ThemedView className="flex-row items-center justify-between mb-4">
        <ThemedText className="text-lg font-bold">{title}</ThemedText>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <ThemedText className="text-blue-500 font-medium">View all</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
      
      <ThemedView className="p-8 bg-white dark:bg-slate-800 rounded-2xl items-center border border-dashed border-slate-200 dark:border-slate-700">
        <View className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full items-center justify-center mb-3">
          <Ionicons name="trophy-outline" size={32} color="#94a3b8" />
        </View>
        <ThemedText className="text-slate-400 text-center">{emptyMessage}</ThemedText>
      </ThemedView>
    </View>
  );
};
