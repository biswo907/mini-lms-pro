import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ThemedView className="flex-1 items-center justify-center gap-4">
      <ThemedText type="title" className="text-blue-500 dark:text-red-500 text-center">
        Welcome to Nativewind!
      </ThemedText>
      
      <ThemedText className="text-center px-4">
        Current Theme: <ThemedText type="defaultSemiBold">{colorScheme}</ThemedText>
      </ThemedText>

      <TouchableOpacity 
        onPress={toggleColorScheme}
        className="bg-blue-500 dark:bg-red-500 px-6 py-3 rounded-full active:opacity-80"
      >
        <ThemedText className="color-white font-bold">
          Toggle Theme
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

