import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export type Movie = {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
};

export default function MoviesCard({
  id,
  poster_path,
  title,
  release_date,
  vote_average,
}: Movie) {
  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "https://placehold.co/500x750?text=No+Image";

  return (
    <View className="flex-1 max-w-[48%] min-w-[120px] mb-5">
      <Link href={`/movie/${id}`} asChild>
        <TouchableOpacity className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-black shadow-lg">
          <Image
            source={{ uri: posterUrl }}
            className="w-full h-[190px] rounded-xl"
            resizeMode="cover"
          />

          <Text className="mt-2 text-xs font-bold text-white" numberOfLines={1}>
            {title}
          </Text>

          <View className="mt-1 flex-row items-center justify-between">
            <Text className="text-xs text-light-300">
              {release_date?.split("-")[0] ?? "Ano desconhecido"}
            </Text>

            <View className="rounded-full bg-yellow-400/15 px-2 py-1">
              <Text className="text-[10px] font-bold text-yellow-400">
                ★ {vote_average?.toFixed(1) ?? "N/A"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
