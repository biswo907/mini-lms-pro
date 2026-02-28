import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSnackbar } from '@/src/context/SnackbarContext';
import { useLoginMutation } from '@/src/service/auth/auth.mutations';
import { AppButton } from '@/src/shared/components/AppButton';
import { AppInput } from '@/src/shared/components/AppInput';
import PageWrapper from '@/src/shared/PageWrapper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const loginMutation = useLoginMutation();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));

  if (field === 'password' && value.length >= 6) {
    setErrors(prev => ({ ...prev, password: '' }));
  }

  if (field === 'username' && value.trim().length > 0) {
    setErrors(prev => ({ ...prev, username: '' }));
  }
};

  const validate = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!formData.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    loginMutation.mutate(
      { 
          username: formData.username.trim().toLowerCase(),
      password: formData.password, 
      },
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
      <View className="flex-1">
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
                <AppInput
                  label="Username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChangeText={(val) => handleInputChange('username', val)}
                  autoCapitalize="none"
                  error={errors.username}
                  icon="person-outline"
                />

                <AppInput
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(val) => handleInputChange('password', val)}
                  isPassword
                  error={errors.password}
                  icon="lock-closed-outline"
                />

                <AppButton
                  title="Sign In"
                  onPress={handleLogin}
                  isLoading={loginMutation.isPending}
                  className="mt-6"
                />

                <View className="flex-row justify-center mt-6">
                  <ThemedText className="text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                  </ThemedText>
                  <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
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