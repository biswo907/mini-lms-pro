import React from "react";
import { Text, View } from "react-native";

interface CourseHeaderProps {
  name: string;
  category?: string;
  brand?: string;
  price: number;
  discountPercentage?: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  name,
  category,
  brand,
  price,
  discountPercentage,
}) => {
  return (
    <View className="flex-row justify-between items-start mb-4">
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-blue-600 font-bold mr-2">
            {category?.toUpperCase() || "COURSE"}
          </Text>
          {brand && (
            <View className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
              <Text className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase">
                {brand}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
          {name}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-2xl font-bold text-blue-600 ml-4">₹ {price}</Text>
        {discountPercentage && (
          <Text className="text-green-600 text-xs font-bold mt-1">
            -{discountPercentage}% OFF
          </Text>
        )}
      </View>
    </View>
  );
};

export default CourseHeader;
