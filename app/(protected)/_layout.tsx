import { Stack } from 'expo-router';
import React from 'react';

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="courses/index" />
      <Stack.Screen name="courses/[id]" />
    </Stack>
  );
}
