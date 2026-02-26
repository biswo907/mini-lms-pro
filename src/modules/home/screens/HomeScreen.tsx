import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/src/context/AuthContext";
import PageWrapper from "@/src/shared/PageWrapper";
import { storage, STORAGE_KEYS } from "@/src/utils/auth-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const getBookmarks = async () => {
        const bookmarks = await storage.getValue(STORAGE_KEYS.BOOKMARKS_KEY);
        if (bookmarks) {
          setBookmarkCount(bookmarks.length);
        } else {
          setBookmarkCount(0);
        }
      };
      getBookmarks();
    }, [])
  );

  const handleNavigateToCourses = (filter?: string) => {
    router.push({
      pathname: "/(protected)/courses",
      params: filter ? { filter } : {}
    } as any);
  };

  return (
    <PageWrapper>
      {/* Keep ThemedView only for main background */}
      <ThemedView className="flex-1 bg-slate-50 dark:bg-slate-900 pt-16 px-6">
        
        {/* Header */}
        <View className="flex-row justify-between items-center mb-10">
          <View>
            <ThemedText className="text-slate-500 dark:text-slate-400 font-medium">
              Welcome back,
            </ThemedText>
            <ThemedText
              type="subtitle"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              {user?.username || "User"}
            </ThemedText>
          </View>

          <TouchableOpacity
            className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl items-center justify-center shadow-sm"
            onPress={() => router.push("/(protected)/profile")}
          >
            <Ionicons name="person-circle-outline" size={26} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <View className="bg-blue-600 rounded-3xl p-6 shadow-lg mb-8">
          <ThemedText className="text-blue-100 font-medium mb-1">
            Your Progress
          </ThemedText>
          <ThemedText className="text-white text-3xl font-bold mb-4">
            You're doing great!
          </ThemedText>

          <View className="h-2 bg-blue-400 rounded-full overflow-hidden">
            <View className="h-full bg-white w-3/4 rounded-full" />
          </View>

          <ThemedText className="text-blue-100 mt-2 text-sm italic">
            75% of your weekly goal completed
          </ThemedText>
        </View>

        {/* Featured Courses Section */}
        <View className="flex-row justify-between items-center mb-4">
          <ThemedText type="subtitle">Featured Courses</ThemedText>
          <TouchableOpacity onPress={() => handleNavigateToCourses()}>
            <Text className="text-blue-600 font-medium">See All</Text>
          </TouchableOpacity>
        </View>

        {/* Since we don't have courses on home yet, I'll add a placeholder or a few manual ones 
            that link to the catalog, or I could fetch them. For now, I'll just make the "See All" 
            and "Quick Actions" work as requested. */}

        {/* Quick Actions */}
        <ThemedText type="subtitle" className="mb-4">
          Quick Actions
        </ThemedText>

        <View className="flex-row flex-wrap justify-between">
          
          <TouchableOpacity 
            className="w-[48%] bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm mb-4"
            onPress={() => handleNavigateToCourses()}
          >
            <View className="w-10 h-10 bg-purple-100 rounded-xl items-center justify-center mb-3">
              <Ionicons name="book" size={20} color="#a855f7" />
            </View>
            <ThemedText className="font-bold">Explore Courses</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-[48%] bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm mb-4"
            onPress={() => handleNavigateToCourses("bookmarks")}
          >
            <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mb-3">
              <Ionicons name="bookmark" size={20} color="#3b82f6" />
            </View>
            <ThemedText className="font-bold">Bookmarks</ThemedText>
            <Text className="text-slate-500 text-xs mt-1">{bookmarkCount} items</Text>
          </TouchableOpacity>

        </View>
      </ThemedView>
    </PageWrapper>
  );
}