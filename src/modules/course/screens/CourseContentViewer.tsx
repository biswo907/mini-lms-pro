import PageWrapper from "@/src/shared/PageWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { WebView } from "react-native-webview";

const CourseContentViewer = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const courseTitle = params.title || "Course Content";
  const courseId = params.id || "N/A";

  // Simple local HTML template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 20px;
            background-color: ${isDark ? "#1e293b" : "#f8fafc"};
            color: ${isDark ? "#f1f5f9" : "#1e293b"};
          }
          .header {
            border-bottom: 2px solid #3b82f6;
            margin-bottom: 20px;
            padding-bottom: 10px;
          }
          h1 {
            color: #3b82f6;
            font-size: 24px;
            margin: 0;
          }
          p {
            line-height: 1.6;
            font-size: 16px;
          }
          .lesson-card {
            background-color: ${isDark ? "#334155" : "#ffffff"};
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .badge {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${courseTitle}</h1>
          <p>Course ID: ${courseId}</p>
        </div>
        
        <div class="lesson-card">
          <span class="badge">LESSON 1</span>
          <h3>Introduction to the Course</h3>
          <p>This is a local HTML template being rendered inside a React Native WebView. It demonstrates how you can package content locally while maintaining a native feel.</p>
        </div>

        <div class="lesson-card">
          <span class="badge">LESSON 2</span>
          <h3>Getting Started</h3>
          <p>The app passed custom headers to this WebView (if it were a remote URL). For local source, headers are mainly for demonstration in code.</p>
        </div>

        <p>Stay tuned for more updates!</p>
      </body>
    </html>
  `;

  return (
    <PageWrapper>
      <View className="flex-1 bg-white dark:bg-slate-900">
        {/* Custom Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#f8fafc" : "#1e293b"} />
          </TouchableOpacity>
          <Text className="ml-2 text-lg font-bold text-slate-900 dark:text-white flex-1" numberOfLines={1}>
            {courseTitle}
          </Text>
        </View>

        {/* WebView */}
        <WebView
          originWhitelist={["*"]}
          source={{ 
            html: htmlContent,
            headers: {
              "X-App-Platform": "React-Native-Android",
              "X-Course-Id": courseId.toString(),
              "Authorization": "Bearer demonstration-token"
            }
          }}
          style={{ flex: 1, backgroundColor: "transparent" }}
        />
      </View>
    </PageWrapper>
  );
};

export default CourseContentViewer;
