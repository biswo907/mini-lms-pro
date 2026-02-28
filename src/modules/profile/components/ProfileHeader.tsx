import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
  onBack: () => void;
  onLogout: () => void;
  title?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  onBack, 
  onLogout, 
  title = "Profile" 
}) => {
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <TouchableOpacity
        onPress={onBack}
        className="w-10 h-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm">
        <Ionicons name="chevron-back" size={24} color="#64748b" />
      </TouchableOpacity>
      
      <ThemedText className="text-xl font-bold">{title}</ThemedText>
      
      <TouchableOpacity
        onPress={onLogout}
        className="w-10 h-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 shadow-sm">
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};
