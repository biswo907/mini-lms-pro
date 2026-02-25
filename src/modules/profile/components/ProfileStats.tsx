import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { View } from "react-native";

interface StatItemProps {
  label: string;
  value: string | number;
  isLast?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, isLast }) => (
  <ThemedView className={`flex-1 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 ${!isLast ? 'mr-3' : ''}`}>
    <ThemedText className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{label}</ThemedText>
    <ThemedText className="text-xl font-bold mt-1">{value}</ThemedText>
  </ThemedView>
);

interface ProfileStatsProps {
  stats: Array<{ label: string; value: string | number }>;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <View className="flex-row justify-between px-6 mt-10">
      {stats.map((stat, index) => (
        <StatItem 
          key={stat.label} 
          label={stat.label} 
          value={stat.value} 
          isLast={index === stats.length - 1} 
        />
      ))}
    </View>
  );
};
