import React from "react";
import { Image, Text, View } from "react-native";

interface InstructorCardProps {
  instructor: {
    name: string;
    avatar: string;
  } | null;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  if (!instructor) return null;

  return (
    <View className="flex-row items-center bg-white dark:bg-slate-800 p-4 rounded-3xl mb-6 shadow-sm">
      <Image
        source={{
          uri: instructor.avatar || `https://picsum.photos/200?random=instructor`,
        }}
        className="w-12 h-12 rounded-2xl"
      />
      <View className="ml-4">
        <Text className="text-slate-900 dark:text-white font-bold">
          {instructor.name}
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-sm">
          Course Instructor
        </Text>
      </View>
    </View>
  );
};

export default InstructorCard;
