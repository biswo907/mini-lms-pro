import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info" | "success";
  loading?: boolean;
}

export default function AppModal({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  loading = false,
}: AppModalProps) {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return { name: "alert-circle", color: "#ef4444" };
      case "success":
        return { name: "checkmark-circle", color: "#22c55e" };
      default:
        return { name: "information-circle", color: "#3b82f6" };
    }
  };

  const icon = getIcon();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable className="w-[90%] max-w-[420px] px-4">
          <ThemedView
            className="rounded-3xl p-7 shadow-2xl border border-slate-100 dark:border-slate-800"
            style={styles.modalCard}
          >
            {/* Header Icon */}
            <View className="items-center mb-5 mt-4">
              <View
                className="w-18 h-18 rounded-full items-center justify-center"
                style={{ backgroundColor: `${icon.color}15` }}
              >
                <Ionicons
                  name={icon.name as any}
                  size={40}
                  color={icon.color}
                />
              </View>
            </View>

            {/* Content */}
            <View className="items-center mb-8">
              <ThemedText className="text-2xl font-bold text-center mb-3">
                {title}
              </ThemedText>
              <ThemedText className="text-slate-500 dark:text-slate-400 text-center leading-6 px-2">
                {description}
              </ThemedText>
            </View>

             {/* Actions */}
<View className="flex-row items-center px-6 mt-4 mb-6">

  <TouchableOpacity
    onPress={onClose}
    activeOpacity={0.8}
    className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center"
    style={[styles.secondaryButton, { marginRight: 8 }]}
  >
    <ThemedText className="font-semibold text-slate-600 dark:text-slate-300 text-base">
      {cancelText}
    </ThemedText>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={onConfirm}
    disabled={loading}
    activeOpacity={0.85}
    className={`flex-1 py-4 rounded-2xl items-center ${
      type === "danger" ? "bg-red-500" : "bg-blue-600"
    }`}
    style={[styles.primaryButton, { marginLeft: 8 }]}
  >
    <ThemedText className="font-semibold text-white text-base">
      {loading ? "Processing..." : confirmText}
    </ThemedText>
  </TouchableOpacity>

</View>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)", // slightly stronger for premium feel
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10, // margin from mobile edges
  },
  modalCard: {
    elevation: 12,
  },
  primaryButton: {
    elevation: 4,
  },
  secondaryButton: {
    elevation: 2,
  },
});