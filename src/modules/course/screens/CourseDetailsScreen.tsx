import { useProductDetailsQuery } from "@/src/service/course/course.queries";
import AppModal from "@/src/shared/AppModal";
import PageWrapper from "@/src/shared/PageWrapper";
import { storage, STORAGE_KEYS } from "@/src/utils/auth-storage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CourseDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id as string;
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f8fafc' : '#1e293b';
  
  const {
    data: productData,
    isLoading: loading,
  } = useProductDetailsQuery(productId);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);

  const course = useMemo(() => {
    const product = productData?.data;
    if (!product) return null;

    let instructor = null;
    try {
      instructor = params.instructor ? JSON.parse(params.instructor as string) : null;
    } catch (e) {
      console.error("Error parsing instructor:", e);
    }

    return {
      id: product.id,
      name: product.title,
      description: product.description,
      price: product.price,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      brand: product.brand,
      category: product.category,
      image: product.images?.[0] || product.thumbnail || product.image,
      images: product.images || [],
      instructor: instructor,
    };
  }, [productData, params.instructor]);

  useEffect(() => {
    if (course?.id) {
      checkBookmarkStatus();
    }
  }, [course?.id]);

  const checkBookmarkStatus = async () => {
    if (!course?.id) return;
    const bookmarks = await storage.getValue(STORAGE_KEYS?.BOOKMARKS_KEY) || [];
    setIsBookmarked(bookmarks.some((b: any) => b.id === course.id));
  };

  const toggleBookmark = async () => {
    if (!course?.id) return;
    setShowBookmarkModal(true);
  };

  const handleConfirmBookmark = async () => {
    if (!course?.id) return;
    let bookmarks = (await storage.getValue(STORAGE_KEYS?.BOOKMARKS_KEY)) || [];
    if (isBookmarked) {
      bookmarks = bookmarks.filter((b: any) => b.id !== course.id);
    } else {
      bookmarks.push(course);
    }

    await storage.setValue(STORAGE_KEYS?.BOOKMARKS_KEY, bookmarks);
    setIsBookmarked(!isBookmarked);
    setShowBookmarkModal(false);
  };

  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const handleEnroll = () => {
    setIsEnrolled(true);
    setShowEnrollModal(true);
  };

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveImageIndex(roundIndex);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-slate-500">Loading course details...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Course Not Found</Text>
        <Text className="mt-2 text-slate-500 text-center">
          We couldn't find the course you're looking for. It may have been removed or the ID is invalid.
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mt-8 px-8 py-4 bg-blue-600 rounded-2xl"
        >
          <Text className="text-white font-bold text-lg">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <PageWrapper>
      <View className="flex-1 bg-slate-50 dark:bg-slate-900">
        <AppModal
          visible={showBookmarkModal}
          onClose={() => setShowBookmarkModal(false)}
          onConfirm={handleConfirmBookmark}
          title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          description={isBookmarked ? "Are you sure you want to remove this course from your bookmarks?" : "Are you sure you want to bookmark this course for later?"}
          confirmText={isBookmarked ? "Remove" : "Bookmark"}
          type={isBookmarked ? "danger" : "info"}
        />

        <AppModal
          visible={showEnrollModal}
          onClose={() => setShowEnrollModal(false)}
          onConfirm={() => setShowEnrollModal(false)}
          title="Success!"
          description="You have successfully enrolled in this course! You can now access all the lessons."
          confirmText="Got it"
          type="success"
        />
        {/* Swiper Image Selection */}
        <View className="relative h-80">
          <FlatList
            data={course.images && course.images.length > 0 ? course.images : [course.image]}
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
            {(course.images && course.images.length > 1) && course.images.map((_: any, index: number) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${activeImageIndex === index ? 'w-6 bg-blue-600' : 'w-2 bg-white/60'}`}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-6 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full items-center justify-center shadow-lg"
          >
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleBookmark}
            className="absolute top-12 right-6 w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full items-center justify-center shadow-lg"
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isBookmarked ? "#3b82f6" : iconColor}
            />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 -mt-6 bg-slate-50 dark:bg-slate-900 rounded-t-[32px] px-6 pt-8">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-blue-600 font-bold mr-2">{course.category?.toUpperCase() || "COURSE"}</Text>
                {course.brand && (
                  <View className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                    <Text className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase">{course.brand}</Text>
                  </View>
                )}
              </View>
              <Text className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {course.name}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-blue-600 ml-4">₹ {course.price}</Text>
              {course.discountPercentage && (
                <Text className="text-green-600 text-xs font-bold mt-1">-{course.discountPercentage}% OFF</Text>
              )}
            </View>
          </View>

          {/* Instructor Box */}
          <View className="flex-row items-center bg-white dark:bg-slate-800 p-4 rounded-3xl mb-6 shadow-sm">
            <Image
              source={{ uri: course.instructor?.avatar }}
              className="w-12 h-12 rounded-2xl"
            />
            <View className="ml-4">
              <Text className="text-slate-900 dark:text-white font-bold">{course.instructor?.name}</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm">Course Instructor</Text>
            </View>
          </View>

          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2">About this course</Text>
          <Text className="text-slate-600 dark:text-slate-400 leading-6 mb-8">
            {course.description}
          </Text>

          {/* Features Grid */}
          <View className="flex-row flex-wrap justify-between mb-8">
            <DetailItem icon="star-outline" label={`${course.rating || "4.5"} Rating`} />
            <DetailItem icon="people-outline" label="1.2k Students" />
            <DetailItem icon="time-outline" label="12 Hours" />
            <DetailItem icon="document-text-outline" label="24 Lessons" />
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View className="p-6 bg-white dark:bg-slate-800 flex-row items-center border-t border-slate-100 dark:border-slate-700 space-x-4">
          {isEnrolled && (
            <TouchableOpacity
              className="flex-1 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl items-center justify-center"
              onPress={() => router.push({
                pathname: "/(protected)/courses/content",
                params: { id: course.id, title: course.name }
              })}
            >
              <Text className="text-slate-900 dark:text-white font-bold text-lg">
                View Content
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className={`flex-1 h-14 rounded-2xl items-center justify-center ${isEnrolled ? 'bg-green-500' : 'bg-blue-600'}`}
            onPress={handleEnroll}
            disabled={isEnrolled}
          >
            <Text className="text-white font-bold text-lg">
              {isEnrolled ? "Enrolled" : "Enroll Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageWrapper>
  );
};

const DetailItem = ({ icon, label }: { icon: any; label: string }) => (
  <View className="w-[48%] flex-row items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-2xl mb-3">
    <Ionicons name={icon} size={20} color="#3b82f6" />
    <Text className="ml-2 text-slate-700 dark:text-slate-300 font-medium">{label}</Text>
  </View>
);

export default CourseDetailsScreen;
