import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetwork } from '../context/NetworkContext';

export const OfflineBanner = () => {
  const { isConnected } = useNetwork();
  const insets = useSafeAreaInsets();

  // If connected, don't render anything
  if (isConnected) return null;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 30 : 0) }]}>
      <Text style={styles.message}>
        ⚠️ You are currently offline. Please check your internet connection.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#EF4444', // A clean, alert red color
    paddingBottom: 10,
    paddingHorizontal: 16,
    zIndex: 999, // Ensures it stays on top of everything
    elevation: 10, // For Android shadow/layering
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});