import MoviesCard from "@/components/moviesCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLatestMovies = useCallback(
    () => fetchMovies({ query: searchQuery }),
    [searchQuery],
  );

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    fetchData: refetchMovies,
    reset: resetMovies,
  } = useFetch(fetchLatestMovies, false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await refetchMovies();
      } else {
        resetMovies();
      }
    }, 500); // Debounce time of 500ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchLatestMovies]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MoviesCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image
                source={icons.logo}
                className="w-12 h-10"
                resizeMode="contain"
              />
            </View>

            <View className="my-5 bg-[#252537] rounded-full">
              <SearchBar
                placeholder="Search for movies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {moviesError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {moviesError.message}
              </Text>
            )}

            {!moviesLoading &&
              !moviesError &&
              searchQuery.trim() &&
              movies?.length > 0 && (
                <Text className="text-xl text-white font-bold px-5 mb-3">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }

        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="flex-1 items-center justify-center mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found for your search."
                  : "Start typing to search for movies."}
              </Text>
            </View>
          )
          : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});
