import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface ProfileHeroProps {
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
  onPickImage: () => void;
  isUpdatingAvatar?: boolean;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  username,
  email,
  role,
  avatarUrl,
  onPickImage,
  isUpdatingAvatar = false,
}) => {
  return (
    <ThemedView className="items-center mt-6 px-6">
      <View className="relative">
        <ThemedView className="w-32 h-32 rounded-full p-1 bg-blue-500 shadow-lg">
          <Image
            source={{ uri: avatarUrl }}
            className="w-full h-full rounded-full"
          />
        </ThemedView>
        <TouchableOpacity
          onPress={onPickImage}
          disabled={isUpdatingAvatar}
          className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full border-4 border-white dark:border-slate-900 shadow-md">
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ThemedView className="items-center mt-4">
        <ThemedText className="text-2xl font-bold">{username}</ThemedText>
        <ThemedText className="text-slate-500 dark:text-slate-400 mt-1">{email}</ThemedText>
        <ThemedView className="mt-3 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <ThemedText className="text-blue-600 dark:text-blue-400 text-xs font-semibold">{role}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};
