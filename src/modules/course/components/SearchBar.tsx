import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, View } from "react-native";

interface SearchBarProps {
  onSearch: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search courses..." }) => {
  const [text, setText] = useState("");

  const handleTextChange = (value: string) => {
    setText(value);
    onSearch(value);
  };

  return (
    <View className="flex-row items-center bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
      <Ionicons name="search-outline" size={20} color="#94a3b8" />
      <TextInput
        className="flex-1 ml-2 text-slate-900 dark:text-white py-2"
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={text}
        onChangeText={handleTextChange}
      />
      {text.length > 0 && (
        <Ionicons
          name="close-circle"
          size={18}
          color="#94a3b8"
          onPress={() => handleTextChange("")}
        />
      )}
    </View>
  );
};

export default SearchBar;
