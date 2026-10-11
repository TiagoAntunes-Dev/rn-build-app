import { Link } from "expo-router";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

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
    <View className="w-[30%]">
      <Link href={`/movie/${id}`} asChild>
        <TouchableOpacity>
          <Image
            source={{ uri: posterUrl }}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
          />

          <Text className="text-xs font-bold text-white mt-2" numberOfLines={1}>
            {title}
          </Text>

          <Text className="text-xs text-light-300 mt-1">
            {release_date?.split("-")[0] ?? "Ano desconhecido"}
          </Text>

          <Text className="text-xs text-yellow-400 mt-1">
            ★ {vote_average?.toFixed(1) ?? "N/A"}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
