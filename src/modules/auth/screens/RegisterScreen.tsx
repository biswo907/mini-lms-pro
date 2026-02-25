import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSnackbar } from '@/src/context/SnackbarContext';
import { useRegisterMutation } from '@/src/service/auth/auth.mutations';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const registerMutation = useRegisterMutation();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    registerMutation.mutate(
      { username:username?.toLowerCase(), email, password, role: 'ADMIN' }, // . role as student
      {
        onSuccess: () => {
          showSnackbar('Account created successfully!', 'success');
          router.replace('/(auth)/login');
        },
        onError: (error: any) => {
          showSnackbar(error?.response?.data?.message || 'Registration failed. Please try again.', 'error');
        },
      }
    );
  };

  return (
    <ThemedView className="flex-1 bg-slate-50 dark:bg-slate-900 pt-12">
      <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-sm mb-6"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>

        <View className="mb-8">
          <ThemedText type="title" className="text-3xl font-bold text-slate-900 dark:text-white">
            Create Account
          </ThemedText>
          <ThemedText className="text-slate-500 dark:text-slate-400 mt-2">
            Join our community and start learning today
          </ThemedText>
        </View>

        <View className="space-y-4">
          <View>
            <ThemedText className="mb-2 font-medium text-slate-700 dark:text-slate-300">Username</ThemedText>
            <TextInput
              className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 text-slate-900 dark:text-white"
              placeholder="Pick a unique username"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View>
            <ThemedText className="mb-2 font-medium text-slate-700 dark:text-slate-300">Email Address</ThemedText>
            <TextInput
              className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 text-slate-900 dark:text-white"
              placeholder="example@mail.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <ThemedText className="mb-2 font-medium text-slate-700 dark:text-slate-300">Password</ThemedText>
            <View className="relative">
              <TextInput
                className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 text-slate-900 dark:text-white"
                placeholder="At least 6 characters"
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
                  name={showPassword ? "eye-off" : "eye"} 
                  size={22} 
                  color="#64748b" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            className="mt-8 w-full h-14 bg-blue-600 rounded-2xl items-center justify-center shadow-md active:bg-blue-700"
            onPress={handleRegister}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText className="text-white font-bold text-lg">Create Account</ThemedText>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6 mb-10">
            <ThemedText className="text-slate-500 dark:text-slate-400">Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <ThemedText className="text-blue-600 font-bold">Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
