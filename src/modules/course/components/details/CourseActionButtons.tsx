import { AppButton } from "@/src/shared/components/AppButton";
import React from "react";
import { View } from "react-native";

interface CourseActionButtonsProps {
  isEnrolled: boolean;
  onEnroll: () => void;
  onViewContent: () => void;
}

const CourseActionButtons: React.FC<CourseActionButtonsProps> = ({
  isEnrolled,
  onEnroll,
  onViewContent,
}) => {
  return (
    <View className="p-6 bg-white dark:bg-slate-800 flex-row items-center border-t border-slate-100 dark:border-slate-700 space-x-4">
      {isEnrolled && (
        <AppButton
          title="View Content"
          variant="secondary"
          onPress={onViewContent}
          className="flex-1 mr-4"
        />
      )}
      <AppButton
        title={isEnrolled ? "Enrolled" : "Enroll Now"}
        variant={isEnrolled ? "secondary" : "primary"}
        onPress={onEnroll}
        disabled={isEnrolled}
        className="flex-1"
        textClassName={isEnrolled ? "text-green-600 dark:text-green-400" : ""}
      />
    </View>
  );
};

export default CourseActionButtons;
