import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSnackbar } from '@/src/context/SnackbarContext';
import { useRegisterMutation } from '@/src/service/auth/auth.mutations';
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
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const registerMutation = useRegisterMutation();

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    // Trimming username and email
    const cleanValue = (field === 'username' || field === 'email') ? value.trim() : value;
    
    setFormData(prev => ({ ...prev, [field]: cleanValue }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { username: '', email: '', password: '' };

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation (8+ chars, uppercase, lowercase, number, special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    registerMutation.mutate(
      { 
        username: formData.username.toLowerCase(), 
        email: formData.email, 
        password: formData.password, 
        role: 'ADMIN' 
      },
      {
        onSuccess: () => {
          showSnackbar('Account created successfully!', 'success');
          router.replace('/(auth)/login');
        },
        onError: (error: any) => {
          showSnackbar(
            error?.response?.data?.message ||
              'Registration failed. Please try again.',
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
            <ThemedView className="flex-1 bg-slate-50 dark:bg-slate-900">
              <ScrollView
                className="flex-1 px-8"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingTop: 48, paddingBottom: 40 }}
              >
                <TouchableOpacity
                  className="w-10 h-10 items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-sm mb-6"
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={24} color="#334155" />
                </TouchableOpacity>

                <View className="mb-8">
                  <ThemedText
                    type="title"
                    className="text-3xl font-bold text-slate-900 dark:text-white"
                  >
                    Create Account
                  </ThemedText>
                  <ThemedText className="text-slate-500 dark:text-slate-400 mt-2">
                    Join our community and start learning today
                  </ThemedText>
                </View>

                <View className="space-y-4">
                  <AppInput
                    label="Username"
                    placeholder="Pick a unique username"
                    value={formData.username}
                    onChangeText={(val) => handleInputChange('username', val)}
                    autoCapitalize="none"
                    error={errors.username}
                    icon="person-outline"
                  />

                  <AppInput
                    label="Email Address"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChangeText={(val) => handleInputChange('email', val)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                    icon="mail-outline"
                  />

                  <AppInput
                    label="Password"
                    placeholder="Strong password"
                    value={formData.password}
                    onChangeText={(val) => handleInputChange('password', val)}
                    isPassword
                    error={errors.password}
                    icon="lock-closed-outline"
                  />

                  <AppButton
                    title="Create Account"
                    onPress={handleRegister}
                    isLoading={registerMutation.isPending}
                    className="mt-8"
                  />

                  <View className="flex-row justify-center mt-6 mb-10">
                    <ThemedText className="text-slate-500 dark:text-slate-400">
                      Already have an account?{' '}
                    </ThemedText>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                      <ThemedText className="text-blue-600 font-bold">
                        Sign In
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </ThemedView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </PageWrapper>
  );
}
