/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type SnackbarType = "success" | "error" | "warning" | "info";

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {}
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("info");

  // Animation: Start 150px down (off-screen bottom)
  const translateY = useRef(new Animated.Value(150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSnackbar = useCallback(
    (msg: string, msgType: SnackbarType = "info") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setMessage(msg);
      setType(msgType);

      // Animate Up with a slight bounce
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0, // Move to natural position
          friction: 6, // Controls bounce
          tension: 40, // Controls speed
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();

      // Auto-hide
      timeoutRef.current = setTimeout(() => {
        hideSnackbar();
      }, 3500);
    },
    []
  );

  const hideSnackbar = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 150, // Move back down
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  // UI Configuration based on Type
  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: "✓",
          color: "#4CAF50",
          bgIcon: "rgba(76, 175, 80, 0.2)"
        };
      case "error":
        return {
          icon: "✕",
          color: "#FF5252",
          bgIcon: "rgba(255, 82, 82, 0.2)"
        };
      case "warning":
        return {
          icon: "!",
          color: "#FFD740",
          bgIcon: "rgba(255, 215, 64, 0.2)"
        };
      default:
        return {
          icon: "i",
          color: "#448AFF",
          bgIcon: "rgba(68, 138, 255, 0.2)"
        };
    }
  };

  const config = getConfig();

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Animated.View
        style={[
          styles.container,
          {
            opacity,
            transform: [{ translateY }]
          }
        ]}
      >
        {/* 1. The Inner Content */}
        <View style={styles.contentContainer}>
          {/* 2. Icon Bubble */}
          <View style={[styles.iconBubble, { backgroundColor: config.bgIcon }]}>
            <Text style={[styles.iconText, { color: config.color }]}>
              {config.icon}
            </Text>
          </View>

          {/* 3. Message */}
          <Text style={styles.text}>{message}</Text>

          {/* 4. Close Button */}
          <TouchableOpacity onPress={hideSnackbar} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40, // 40px from bottom (Floating look)
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 9999
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A", // Dark modern background
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 50, // Fully rounded pill shape

    // Heavy Shadow for "Pop" effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,

    width: "100%",
    maxWidth: 400 // Prevent it getting too wide on tablets
  },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  iconText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  text: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
    flex: 1 // Takes available space
  },
  closeBtn: {
    padding: 5,
    marginLeft: 8
  },
  closeText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "bold"
  }
});

// Uses

// const { showSnackbar } = useSnackbar();
// showSnackbar("Logged out successfully.", "success"); // error -  - warning  -- info
