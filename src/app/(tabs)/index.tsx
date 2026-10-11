import "@/app/globals.css";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import MoviesCard from "@/components/moviesCard";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function App() {
  const router = useRouter();

  const fetchLatestMovies = useCallback(() => fetchMovies({ query: "" }), []);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(fetchLatestMovies, true);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      {moviesLoading ? (
        <ActivityIndicator size="large" color="#0000ff" className="flex-1" />
      ) : moviesError ? (
        <Text className="text-white mt-10 px-5">
          Error: {moviesError.message}
        </Text>
      ) : (
        <FlatList
          className="mt-2 pb-30"
          data={movies ?? []}
         renderItem={({ item }) => (
            <MoviesCard {...item} />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            marginLeft: 10,
            gap: 12,
            marginBottom: 10,
          }}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          scrollEnabled={true}
          ListHeaderComponent={
            <View>
              <View className="w-full items-center">
                <Image
                  source={icons.logo}
                  className="w-24 h-20 mt-20 mb-5 ml-3"
                  resizeMode="contain"
                />
              </View>

              <SearchBar
                onPress={() => router.push("/search")}
                placeholder="Pesquisar"
              />

              <Text className="text-lg text-white font-bold mt-5 mb-3 ml-3">
                Latest Movies
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
