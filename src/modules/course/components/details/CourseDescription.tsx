import React from "react";
import { Text } from "react-native";

interface CourseDescriptionProps {
  description: string;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ description }) => {
  return (
    <>
      <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        About this course
      </Text>
      <Text className="text-slate-600 dark:text-slate-400 leading-6 mb-8">
        {description}
      </Text>
    </>
  );
};

export default CourseDescription;
