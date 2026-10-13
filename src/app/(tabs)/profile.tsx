import { images } from "@/constants/images";
import { fetchMovieDetails } from "@/services/api";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const stats = [
  { label: "Watched", value: "128" },
  { label: "Saved", value: "24" },
  { label: "Favorites", value: "9" },
];

const watchlist = [
  {
    id: 693134,
    title: "Dune: Part Two",
    description: "Sci-Fi • 2h 46m",
    progress: "82% watched",
  },
  {
    id: 414906,
    title: "The Batman",
    description: "Action • 2h 56m",
    progress: "100% watched",
  },
  {
    id: 120467,
    title: "The Grand Budapest Hotel",
    description: "Comedy • 1h 39m",
    progress: "58% watched",
  },
];

const favoriteGenres = ["Sci-Fi", "Action", "Thriller", "Drama"];

export default function Profile() {
  const [posterPaths, setPosterPaths] = useState<Record<number, string | null>>(
    {},
  );
  const [postersLoading, setPostersLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    Promise.all(
      watchlist.map(async (movie) => {
        try {
          const details = await fetchMovieDetails(String(movie.id));
          return [movie.id, details.poster_path] as const;
        } catch {
          return [movie.id, null] as const;
        }
      }),
    ).then((posters) => {
      if (isCurrent) {
        setPosterPaths(Object.fromEntries(posters));
        setPostersLoading(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute h-full w-full"
        resizeMode="cover"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-5 pt-16">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-white">Profile</Text>
            <Pressable className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
              <Text className="text-sm font-medium text-white">Edit</Text>
            </Pressable>
          </View>

          <View className="rounded-[30px] border border-white/10 bg-[#111827]/70 p-5 shadow-black shadow-lg">
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
                }}
                className="h-20 w-20 rounded-full border-[3px] border-violet-400"
                resizeMode="cover"
              />

              <View className="ml-4 flex-1">
                <Text className="text-2xl font-bold text-white">
                  Daniel Carter
                </Text>
                <Text className="mt-1 text-sm text-gray-300">
                  @danielwatcher
                </Text>
                <Text className="mt-2 text-sm text-violet-200">
                  Movie lover • 4K nights
                </Text>
              </View>
            </View>

            <View className="mt-5 flex-row justify-between">
              {stats.map((stat) => (
                <View
                  key={stat.label}
                  className="flex-1 items-center rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                >
                  <Text className="text-xl font-bold text-white">
                    {stat.value}
                  </Text>
                  <Text className="mt-1 text-[11px] text-gray-300">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-8 rounded-[28px] border border-white/10 bg-[#111827]/75 p-5">
            <Text className="mb-4 text-lg font-bold text-white">
              Favorite genres
            </Text>
            <View className="flex-row flex-wrap">
              {favoriteGenres.map((genre) => (
                <View
                  key={genre}
                  className="mr-2 mb-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-2"
                >
                  <Text className="text-sm font-medium text-violet-100">
                    {genre}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-8">
            <Text className="mb-4 text-xl font-bold text-white">
              Continue watching
            </Text>

            {watchlist.map((movie) => (
              <Pressable
                key={movie.title}
                className="mb-4 flex-row overflow-hidden rounded-[24px] border border-white/10 bg-[#111827]/75"
              >
                {posterPaths[movie.id] ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w342${posterPaths[movie.id]}`,
                    }}
                    className="h-28 w-24"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-28 w-24 items-center justify-center bg-white/5">
                    {postersLoading ? (
                      <ActivityIndicator color="#a78bfa" />
                    ) : (
                      <Text className="px-2 text-center text-[10px] text-gray-400">
                        Poster indisponível
                      </Text>
                    )}
                  </View>
                )}

                <View className="flex-1 justify-center px-4 py-3">
                  <Text className="text-base font-bold text-white">
                    {movie.title}
                  </Text>
                  <Text className="mt-1 text-xs text-gray-300">
                    {movie.description}
                  </Text>

                  <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <View
                      className="h-full rounded-full bg-violet-400"
                      style={{
                        width:
                          movie.progress === "82% watched"
                            ? "82%"
                            : movie.progress === "100% watched"
                              ? "100%"
                              : "58%",
                      }}
                    />
                  </View>

                  <Text className="mt-2 text-xs text-violet-200">
                    {movie.progress}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
