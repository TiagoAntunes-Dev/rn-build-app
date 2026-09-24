import "@/app/globals.css"
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { View, Image, ScrollView } from "react-native";
 
export default function App() {
  const router = useRouter();

  return (
  <View className="flex-1 bg-primary">
    <Image 
      source={images.bg}
      className="absolute w-full z-0"
    />

    <ScrollView 
      className="flex-1 px-5"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
      
      {/* Container dedicado para centralizar perfeitamente o logo */}
      <View className="w-full items-center">
        <Image 
          source={icons.logo}
          className="w-24 h-20 mt-20 mb-5 ml-3" 
        />
      </View>

      <View className="flex-1 mt-5">
        <SearchBar 
          onPress={() => router.push("/search")}
          placeholder="Pesquisar"
        />
      </View>
    </ScrollView>
  </View>
)}