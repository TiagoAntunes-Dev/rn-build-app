
import { icons } from "@/constants/icons";
import { Image, TextInput, View } from "react-native";

interface Props {
  placeholder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SearchBar({
  placeholder,
  onPress,
  value,
  onChangeText,
}: Props) {
  return (
    <View className="flex-row items-center bg-dark-20 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />

      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="white"
        className="flex-1 ml-2 text-white"
      />
    </View>
  );
}
