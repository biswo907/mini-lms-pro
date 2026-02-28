import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface CourseFeaturesGridProps {
  rating?: number;
}

const CourseFeaturesGrid: React.FC<CourseFeaturesGridProps> = ({ rating }) => {
  return (
    <View className="flex-row flex-wrap justify-between mb-8">
      <DetailItem icon="star-outline" label={`${rating || "4.5"} Rating`} />
      <DetailItem icon="people-outline" label="1.2k Students" />
      <DetailItem icon="time-outline" label="12 Hours" />
      <DetailItem icon="document-text-outline" label="24 Lessons" />
    </View>
  );
};

const DetailItem = ({ icon, label }: { icon: any; label: string }) => (
  <View className="w-[48%] flex-row items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-2xl mb-3">
    <Ionicons name={icon} size={20} color="#3b82f6" />
    <Text className="ml-2 text-slate-700 dark:text-slate-300 font-medium">
      {label}
    </Text>
  </View>
);

export default CourseFeaturesGrid;
