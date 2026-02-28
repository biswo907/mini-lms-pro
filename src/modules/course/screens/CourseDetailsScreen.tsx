import { useAuth } from "@/src/context/AuthContext";
import { useSnackbar } from "@/src/context/SnackbarContext";
import { useProductDetailsQuery } from "@/src/service/course/course.queries";
import { NotificationService } from "@/src/service/notification/NotificationService";
import AppModal from "@/src/shared/AppModal";
import PageWrapper from "@/src/shared/PageWrapper";
import { getBookmarkKey, storage } from "@/src/utils/auth-storage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View, useColorScheme } from "react-native";
import CourseActionButtons from "../components/details/CourseActionButtons";
import CourseDescription from "../components/details/CourseDescription";
import CourseFeaturesGrid from "../components/details/CourseFeaturesGrid";
import CourseHeader from "../components/details/CourseHeader";
import CourseImageSwiper from "../components/details/CourseImageSwiper";
import InstructorCard from "../components/details/InstructorCard";

const CourseDetailsScreen = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
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
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const course = useMemo(() => {
    const product = productData?.data;
    if (!product) return null;

    let instructor = null;
    try {
      instructor = params.instructor ? JSON.parse(params.instructor as string) : null;
    } catch (e) {
      console.error("Error parsing instructor:", e);
    }

   
    const randomImages = [1, 2, 3, 4].map(
      (item) => `https://picsum.photos/800/600?random=${product.id}-${item}`
    );
    const combinedImages = [...randomImages];

    return {
      id: product.id,
      name: product.title,
      description: product.description,
      price: product.price,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      brand: product.brand,
      category: product.category,
      image: product.thumbnail || product.image,
      images: combinedImages,
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
    const bookmarkKey = getBookmarkKey(user?._id);
    const bookmarks = await storage.getValue(bookmarkKey) || [];
    setIsBookmarked(bookmarks.some((b: any) => b.id === course.id));
  };

  const handleConfirmBookmark = async () => {
    if (!course?.id) return;
    const bookmarkKey = getBookmarkKey(user?._id);
    let bookmarks = (await storage.getValue(bookmarkKey)) || [];
    if (isBookmarked) {
      bookmarks = bookmarks.filter((b: any) => b.id !== course.id);
    } else {
      bookmarks.push(course);
    }

    await storage.setValue(bookmarkKey, bookmarks);
    setIsBookmarked(!isBookmarked);
    showSnackbar(
      isBookmarked ? "Course removed from your bookmarks." : "Course added to your bookmarks! 📚",
      isBookmarked ? "info" : "success"
    );
    setShowBookmarkModal(false);

    if (!isBookmarked && bookmarks.length === 5) {
      await NotificationService.scheduleBookmarkMilestoneNotification(bookmarks.length);
    }
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    setShowEnrollModal(true);
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
          We couldn't find the course you're looking for.
        </Text>
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
          description="You have successfully enrolled in this course!"
          confirmText="Got it"
          type="success"
        />

        <CourseImageSwiper
          images={course.images}
          image={course.image}
          onBack={() => router.back()}
          onToggleBookmark={() => setShowBookmarkModal(true)}
          isBookmarked={isBookmarked}
          iconColor={iconColor}
        />

        <ScrollView className="flex-1 -mt-6 bg-slate-50 dark:bg-slate-900 rounded-t-[32px] px-6 pt-8">
          <CourseHeader
            name={course.name}
            category={course.category}
            brand={course.brand}
            price={course.price}
            discountPercentage={course.discountPercentage}
          />

          <InstructorCard instructor={course.instructor} />

          <CourseDescription description={course.description} />

          <CourseFeaturesGrid rating={course.rating} />
        </ScrollView>

        <CourseActionButtons
          isEnrolled={isEnrolled}
          onEnroll={handleEnroll}
          onViewContent={() => router.push({
            pathname: "/(protected)/courses/content",
            params: { id: course.id, title: course.name }
          })}
        />
      </View>
    </PageWrapper>
  );
};

export default CourseDetailsScreen;


