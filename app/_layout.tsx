import { AuthProvider } from "@/src/context/AuthContext";
import { NetworkProvider } from "@/src/context/NetworkContext";
import { QueryProvider } from "@/src/context/QueryProvider";
import { SnackbarProvider } from "@/src/context/SnackbarContext";
import { useNotifications } from "@/src/hooks/useNotifications";
import { OfflineBanner } from "@/src/shared/OfflineBanner";
import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import "../global.css";


export default function RootLayout() {
  useNotifications();

  return (
    <NetworkProvider>
      <OfflineBanner />
    <QueryProvider>
      <AuthProvider>
        <SnackbarProvider>
            <StatusBar
              barStyle="dark-content"
              translucent={false}
            />
            <Slot />
        </SnackbarProvider>
      </AuthProvider>
    </QueryProvider>
    </NetworkProvider>
  );
}