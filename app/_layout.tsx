import { AuthProvider } from "@/src/context/AuthContext";
import { QueryProvider } from "@/src/context/QueryProvider";
import { SnackbarProvider } from "@/src/context/SnackbarContext";
import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import "../global.css";


export default function RootLayout() {
  return (
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
  );
}