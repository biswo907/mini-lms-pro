import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  containerClassName?: string;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  icon,
  isPassword,
  containerClassName = '',
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isSecure = isPassword && !showPassword;

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <ThemedText className="mb-2 font-medium text-slate-700 dark:text-slate-300">
          {label}
        </ThemedText>
      )}
      <View className="relative">
        {icon && (
          <View className="absolute left-4 top-4 z-10">
            <Ionicons name={icon} size={20} color="#64748b" />
          </View>
        )}
        <TextInput
          className={`w-full h-14 bg-white dark:bg-slate-800 border ${
            error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
          } rounded-2xl ${icon ? 'pl-12' : 'px-4'} pr-12 text-slate-900 dark:text-white`}
          placeholderTextColor="#94a3b8"
          secureTextEntry={isSecure}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            className="absolute right-4 top-4 z-10 h-6 w-6 items-center justify-center"
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#64748b"
            />
          </TouchableOpacity>
        )}
      </View>



      {error && (
        <Text className="mt-1 text-xs text-red-500 font-medium ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};
