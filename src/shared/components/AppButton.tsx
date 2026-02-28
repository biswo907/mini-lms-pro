import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  textClassName?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  isLoading,
  variant = 'primary',
  icon,
  className = '',
  textClassName = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-slate-200 dark:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600';
      case 'outline':
        return 'bg-transparent border border-blue-600 active:bg-blue-50';
      case 'danger':
        return 'bg-red-600 active:bg-red-700';
      case 'primary':
      default:
        return 'bg-blue-600 active:bg-blue-700';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'text-slate-900 dark:text-white';
      case 'outline':
        return 'text-blue-600';
      case 'primary':
      case 'danger':
      default:
        return 'text-white';
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      className={`h-14 rounded-2xl flex-row items-center justify-center shadow-sm px-6 ${getVariantStyles()} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563eb' : 'white'} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={variant === 'outline' ? '#2563eb' : 'white'}
              style={{ marginRight: 8 }}
            />
          )}
          <ThemedText className={`text-center font-bold text-lg ${getTextStyles()} ${textClassName}`}>
            {title}
          </ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
};
