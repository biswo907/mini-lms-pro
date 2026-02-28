import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, FlatList, Image, TouchableOpacity, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CourseImageSwiperProps {
  images: string[];
  image: string;
  onBack: () => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
  iconColor: string;
}

const CourseImageSwiper: React.FC<CourseImageSwiperProps> = ({
  images,
  image,
  onBack,
  onToggleBookmark,
  isBookmarked,
  iconColor,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveImageIndex(roundIndex);
  };

  const displayImages = images && images.length > 0 ? images : [image];

  return (
    <View className="relative h-80">
      <FlatList
        data={displayImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            className="w-screen h-full"
            resizeMode="cover"
            style={{ width: SCREEN_WIDTH }}
          />
        )}
      />

      {/* Pagination Dots */}
      <View className="absolute bottom-10 w-full flex-row justify-center items-center">
        {displayImages.length > 1 && displayImages.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              activeImageIndex === index ? 'w-6 bg-blue-600' : 'w-2 bg-white/60'
            }`}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={onBack}
        className="absolute top-12 left-6 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="arrow-back" size={24} color={iconColor} />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onToggleBookmark}
        className="absolute top-12 right-6 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons
          name={isBookmarked ? "bookmark" : "bookmark-outline"}
          size={24}
          color={isBookmarked ? "#3b82f6" : iconColor}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CourseImageSwiper;
