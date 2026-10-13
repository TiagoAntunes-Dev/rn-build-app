import MoviesCard from "@/components/moviesCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { updateSearchCount } from "@/lib/appwrite";
import { fetchMovies } from "@/services/api";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const genreTags = [
  "Adventure",
  "Action",
  "Comedy",
  "Romance",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Animation",
  "Fantasy",
  "Mystery",
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError] = useState<Error | null>(null);
  const latestRequestId = useRef(0);

  const loadMovies = useCallback(async (query: string) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      latestRequestId.current += 1;
      setMovies([]);
      setMoviesError(null);
      setMoviesLoading(false);
      return;
    }

    const requestId = ++latestRequestId.current;
    setMoviesLoading(true);
    setMoviesError(null);

    try {
      const result = await fetchMovies({ query: normalizedQuery });
      const nextMovies = Array.isArray(result) ? result : [];

      if (requestId !== latestRequestId.current) {
        return;
      }

      setMovies(nextMovies);

      if (nextMovies.length > 0) {
        await updateSearchCount(normalizedQuery, nextMovies[0]);
      }
    } catch (error) {
      if (requestId !== latestRequestId.current) {
        return;
      }

      setMovies([]);
      setMoviesError(
        error instanceof Error ? error : new Error("Failed to load movies."),
      );
    } finally {
      if (requestId === latestRequestId.current) {
        setMoviesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      latestRequestId.current += 1;
      setMovies([]);
      setMoviesError(null);
      setMoviesLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      loadMovies(normalizedQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadMovies]);

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
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setSelectedGenre(null);

                  if (!text.trim()) {
                    latestRequestId.current += 1;
                    setMovies([]);
                    setMoviesError(null);
                    setMoviesLoading(false);
                  }
                }}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 4,
                paddingBottom: 8,
                paddingTop: 2,
              }}
              className="mb-5"
            >
              <View className="flex-row gap-2.5">
                {genreTags.map((genre) => {
                  const isSelected = selectedGenre === genre;

                  return (
                    <Pressable
                      key={genre}
                      onPress={() => {
                        setSelectedGenre(genre);
                        setSearchQuery(genre);
                      }}
                      style={{
                        borderWidth: isSelected ? 1 : 1,
                        borderColor: isSelected
                          ? "#a78bfa"
                          : "rgba(255,255,255,0.12)",
                        backgroundColor: isSelected
                          ? "rgba(167,139,250,0.18)"
                          : "rgba(255,255,255,0.05)",
                        paddingHorizontal: 14,
                        paddingVertical: 9,
                        borderRadius: 999,
                        shadowColor: isSelected ? "#a78bfa" : "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isSelected ? 0.28 : 0.1,
                        shadowRadius: 6,
                        elevation: isSelected ? 3 : 1,
                      }}
                    >
                      <Text
                        className="text-sm font-semibold"
                        style={{
                          color: isSelected ? "#fff" : "#e5e7eb",
                        }}
                      >
                        {genre}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

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
              movies.length > 0 && (
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
          ) : null
        }
      />
    </View>
  );
}
