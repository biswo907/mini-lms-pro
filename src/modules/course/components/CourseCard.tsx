import { Product } from "@/src/service/course/course.api";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CourseCardProps {
  course: Product;

}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="bg-white dark:bg-slate-800 rounded-3xl p-4 mb-4 shadow-sm flex-row"
      activeOpacity={0.7}
      onPress={() => router.push({
        pathname: "/(protected)/courses/[id]",
        params: { id: course.id, instructor: JSON.stringify(course.instructor) }
      })}
    >
    
      <Image
  source={{
    uri:
      course?.image?.[0] ||
      `https://picsum.photos/200?random=${course?.id || 1}`,
  }}
  onError={(e) => {
    e.currentTarget.setNativeProps({
      src: `https://picsum.photos/200?random=${course?.id || 1}`,
    });
  }}
  className="w-24 h-24 rounded-2xl bg-slate-100"
  resizeMode="cover"
/>
      <View className="flex-1 ml-4 justify-between">
        <View>
          <Text className="text-slate-900 dark:text-white font-bold text-lg leading-tight mb-1" numberOfLines={2}>
            {course.name}
          </Text>
          <View className="flex-row items-center">
            {course.instructor?.avatar && (
              <Image
                source={{ uri: course.instructor.avatar }}
                className="w-5 h-5 rounded-full mr-2"
              />
            )}
            <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {course.instructor?.name || "Anonymous Instructor"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-blue-600 dark:text-blue-400 font-bold text-base">
            ₹ {course.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;
