import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSnackbar } from '@/src/context/SnackbarContext';
import { useLoginMutation } from '@/src/service/auth/auth.mutations';
import PageWrapper from '@/src/shared/PageWrapper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const loginMutation = useLoginMutation();

  const handleLogin = async () => {
    if (!username || !password) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    loginMutation.mutate(
      { username: username?.toLowerCase(), password },
      {
        onSuccess: () => {
          showSnackbar('Login successful!', 'success');
        },
        onError: (error: any) => {
          showSnackbar(
            error?.response?.data?.message ||
              'Login failed. Please check your credentials.',
            'error'
          );
        },
      }
    );
  };

  return (
    <PageWrapper>
<View className='flex-1'>

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView className="flex-1 justify-center px-8 bg-slate-50 dark:bg-slate-900">
          <View className="mb-10 items-center">
            <View className="w-20 h-20 bg-blue-600 rounded-3xl items-center justify-center mb-4 shadow-lg">
              <Ionicons name="school" size={40} color="white" />
            </View>
            <ThemedText type="title" className="text-4xl font-bold text-slate-900 dark:text-white">
              Welcome Back
            </ThemedText>
            <ThemedText className="text-slate-500 dark:text-slate-400 mt-2">
              Sign in to continue your learning journey
            </ThemedText>
          </View>

          <View className="space-y-4">
            <View>
              <ThemedText className="mb-2 font-medium text-slate-700 dark:text-slate-300">
                Username
              </ThemedText>
              <TextInput
                className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 text-slate-900 dark:text-white"
                placeholder="Enter your username"
                placeholderTextColor="#94a3b8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View>
              <ThemedText className="mb-2 font-medium text-slate-700 dark:text-slate-300">
                Password
              </ThemedText>
              <View className="relative">
                <TextInput
                  className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 text-slate-900 dark:text-white"
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className="mt-6 w-full h-14 bg-blue-600 rounded-2xl items-center justify-center shadow-md active:bg-blue-700"
              onPress={handleLogin}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText className="text-white font-bold text-lg">
                  Sign In
                </ThemedText>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <ThemedText className="text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/register')}
              >
                <ThemedText className="text-blue-600 font-bold">
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
</View>

    </PageWrapper>

  );
}