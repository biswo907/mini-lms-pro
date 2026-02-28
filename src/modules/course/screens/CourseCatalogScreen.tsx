import { useAuth } from "@/src/context/AuthContext";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useInstructorsQuery, useProductsInfiniteQuery } from "@/src/service/course/course.queries";
import PageWrapper from "@/src/shared/PageWrapper";
import { getBookmarkKey, storage } from "@/src/utils/auth-storage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CourseCard from "../components/CourseCard";
import SearchBar from "../components/SearchBar";

const CourseCatalogScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const filter = params.filter as string;

  const [searchText, setSearchText] = useState("");
  const debouncedSearchTerm = useDebounce(searchText, 500);

  const [bookmarkedCourses, setBookmarkedCourses] = useState<any[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  useEffect(() => {
    if (filter === "bookmarks") {
      loadBookmarks();
    }
  }, [filter]);

  const loadBookmarks = async () => {
    setLoadingBookmarks(true);
    const bookmarkKey = getBookmarkKey(user?._id);
    const bookmarks = await storage.getValue(bookmarkKey);
    setBookmarkedCourses(bookmarks || []);
    setLoadingBookmarks(false);
  };

  const {
    data: instructorsData,
    isLoading: isLoadingInstructors,
  } = useInstructorsQuery(50, { enabled: filter !== "bookmarks" });

  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingProducts,
    refetch,
    isRefetching,
  } = useProductsInfiniteQuery(debouncedSearchTerm, {
    enabled: filter !== "bookmarks",
  });

  const instructors = useMemo(() => {
    const rawUsers = instructorsData?.data?.data || instructorsData?.data || [];
    return rawUsers.map((user: any) => ({
      id: user.id || user.login?.uuid || Math.random().toString(),
      name: user.name
        ? `${user.name.first || ""} ${user.name.last || ""}`.trim()
        : user.login?.username || "Instructor",
      avatar: user.picture?.medium || user.picture?.thumbnail || "",
      username: user.login?.username || "anonymous",
    }));
  }, [instructorsData]);

  const courses = useMemo(() => {
    if (filter === "bookmarks") {
      return bookmarkedCourses.filter((course: any) =>
        course.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (!productsData || instructors.length === 0) return [];

    return productsData.pages.flatMap((page) => {
      const productsArray = page?.data?.data || [];
      return productsArray.map((product: any) => {
        const productIdStr = product.id?.toString() || "";
        const instructorIndex = productIdStr
          ? Math.abs(
              productIdStr
                .split("")
                .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
            ) % instructors.length
          : 0;

        return {
          id: product.id?.toString() || Math.random().toString(),
          name: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          images: product.images || [],
          instructor:
            instructors[instructorIndex] || {
              id: "0",
              name: "Guest Instructor",
              avatar: "",
              username: "guest",
            },
        };
      });
    });
  }, [productsData, instructors, filter, bookmarkedCourses, debouncedSearchTerm]);

  const onRefresh = async () => {
    if (filter === "bookmarks") {
      await loadBookmarks();
    } else {
      await refetch();
    }
  };

  const onEndReached = () => {
    if (filter === "bookmarks") return;

    if (hasNextPage && !isFetchingNextPage && !isLoadingProducts) {
      fetchNextPage();
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const loading =
    filter === "bookmarks"
      ? loadingBookmarks
      : isLoadingInstructors || isLoadingProducts;

  return (
    <PageWrapper>
      <View className="flex-1 bg-slate-50 dark:bg-slate-900 px-6 pt-8">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#d3dae7ff" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">
            {filter === "bookmarks" ? "My Bookmarks" : "Course Catalog"}
          </Text>
        </View>

        <SearchBar onSearch={handleSearch} />

        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CourseCard course={item} />}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={
                filter === "bookmarks" ? loadingBookmarks : isRefetching
              }
              onRefresh={onRefresh}
              tintColor="#3b82f6"
              colors={["#3b82f6"]}
            />
          }
          ListFooterComponent={() =>
            filter === "bookmarks" ? (
              <View className="py-4" />
            ) : isFetchingNextPage ? (
              <ActivityIndicator size="small" color="#3b82f6" className="py-4" />
            ) : !hasNextPage && courses.length > 0 ? (
              <View className="py-8 items-center">
                <Text className="text-slate-400">No more courses found</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={() =>
            !loading ? (
              <View className="flex-1 items-center justify-center pt-20">
                <Ionicons name="search" size={48} color="#cbd5e1" />
                <Text className="text-slate-500 mt-4 text-lg">
                  No courses found matching "{searchText}"
                </Text>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center pt-20">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-slate-500 mt-4">
                  Loading Courses...
                </Text>
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </PageWrapper>
  );
};

export default CourseCatalogScreen;