import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const formatMoney = (amount: number | null | undefined) => {
  if (!amount || !Number.isFinite(amount) || amount < 0) {
    return "N/A";
  }

  const magnitudes = [
    { divisor: 1_000_000_000_000, label: "trilhões" },
    { divisor: 1_000_000_000, label: "bilhões" },
    { divisor: 1_000_000, label: "milhões" },
    { divisor: 1_000, label: "mil" },
  ];
  const magnitude = magnitudes.find(({ divisor }) => amount >= divisor);
  const value = magnitude ? amount / magnitude.divisor : amount;
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: magnitude ? 1 : 0,
  }).format(value);

  return `US$ ${formattedValue}${magnitude ? ` ${magnitude.label}` : ""}`;
};

export default function MovieDetails() {
  const { id } = useLocalSearchParams();

  interface MovieInfoProps {
    label: string;
    value: string | number | null | undefined;
  }
  const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm">{value || "N/A"}</Text>
    </View>
  );

  const { data: movie, loading } = useFetch(
    () => fetchMovieDetails(id as string),
    true,
  );

  return (
    <View className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[500px]"
            resizeMode="stretch"
          />
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white text-xl font-bold mb-2">
            {movie?.title}
          </Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-yellow-400 text-sm font-bold">
              {movie?.vote_average?.toFixed(1)}
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count})
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />

          <MovieInfo
            label="Genres"
            value={
              movie?.genres?.map((genre) => genre.name).join(" - ") || "N/A"
            }
          />

          <View className="mt-5 w-full flex-row flex-wrap justify-between">
            <View className="w-[48%]">
              <MovieInfo
                label="Language"
                value={movie?.original_language?.toUpperCase() || "N/A"}
              />
            </View>
            <View className="w-[48%]">
              <MovieInfo label="Budget" value={formatMoney(movie?.budget)} />
            </View>
            <View className="w-[48%]">
              <MovieInfo label="Revenue" value={formatMoney(movie?.revenue)} />
            </View>
            <View className="w-full">
              <MovieInfo
                label="Production Companies"
                value={
                  movie?.production_companies
                    .map((company) => company.name)
                    .join(" - ") || "N/A"
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-bold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
