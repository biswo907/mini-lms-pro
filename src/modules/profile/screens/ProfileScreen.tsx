import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/src/context/AuthContext";
import { useSnackbar } from "@/src/context/SnackbarContext";
import AppModal from "@/src/shared/AppModal";
import PageWrapper from "@/src/shared/PageWrapper";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import { useUpdateAvatarMutation } from "@/src/service/user/user.mutations";
import { useGetCurrentUserQuery } from "@/src/service/user/user.queries";
import { pickImageFromLibrary } from "@/src/utils/image-picker";
import { ProfileAchievements } from "../components/ProfileAchievements";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileHero } from "../components/ProfileHero";
import { ProfileStats } from "../components/ProfileStats";

export default function ProfileScreen() {
  const { user: authUser, logout, updateUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const updateAvatar = useUpdateAvatarMutation();
  const router = useRouter();
  
  // 1️⃣ Fetch full user data including avatar
  const { data: currentUserResponse, isLoading: isUserLoading, refetch } = useGetCurrentUserQuery();
  const userData = currentUserResponse?.data || authUser;

  // Sync back to AuthContext if needed (optional, but ensures global state is fresh)
  useEffect(() => {
    if (currentUserResponse?.data) {
      updateUser(currentUserResponse.data);
    }
  }, [currentUserResponse]);

  const handleLogout = async () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setIsLogoutModalVisible(false);
    await logout();
  };

  const handlePickImage = async () => {
    try {
      const selectedImage = await pickImageFromLibrary();
      
      if (selectedImage) {
        setProfileImage(selectedImage.uri);

        // Create FormData and upload
        const formData = new FormData();
        
        // In React Native, FormData needs an object with uri, name, and type
        formData.append("avatar", {
          uri: selectedImage.uri,
          name: selectedImage.name,
          type: selectedImage.type,
        } as any);

        updateAvatar.mutate(formData, {
          onSuccess: (data) => {
            showSnackbar("Profile picture updated successfully!", "success");
            refetch(); // Refresh user data to get the new avatar URL from server
            setProfileImage(null); // Clear local preview if server refreshes
          },
          onError: (error: any) => {
            console.error("Upload error detailed:", error.response?.data || error.message);
            showSnackbar(error.response?.data?.message || "Failed to upload profile picture", "error");
            setProfileImage(null); // Reset on error
          },
        });
      }
    } catch (error: any) {
      showSnackbar(error.message, "error");
    }
  };

  const currentAvatarUrl = profileImage || userData?.avatar?.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  return (
    <PageWrapper>
      <ThemedView className="flex-1">
        <ProfileHeader 
          onBack={() => router.back()} 
          onLogout={handleLogout} 
        />

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <ProfileHero 
            username={userData?.username || userData?.userName || "User"}
            email={userData?.email || "user@example.com"}
            role={userData?.role || "STUDENT"}
            avatarUrl={currentAvatarUrl}
            onPickImage={handlePickImage}
            isUpdatingAvatar={updateAvatar.isPending}
          />

          <ProfileStats 
            stats={[
              { label: "Courses", value: 5 },
              { label: "Avg. Progress", value: "75%" }
            ]}
          />

          <ProfileAchievements 
            onViewAll={() => { /* Navigate to achievements if implemented */ }}
          />
        </ScrollView>
      </ThemedView>

      <AppModal
        visible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        description="Are you sure you want to log out of your account? You will need to sign in again to access your data."
        confirmText="Logout"
        type="danger"
      />
    </PageWrapper>
  );
}
