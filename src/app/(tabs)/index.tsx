import "@/app/globals.css";
import MoviesCard from "@/components/moviesCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { client, getTrendingMovies } from "@/lib/appwrite"; // 3. Ajuste o caminho de acordo com onde você criou o arquivo appwrite.ts no passo 3
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react"; // 1. Adicione useState
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native"; // 2. Adicione Pressable (ou Button)

export default function App() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies, true);

  const trendingData = Array.isArray(trendingMovies) ? trendingMovies : [];

  // Estados para o controle de Ping
  const [pingLoading, setPingLoading] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const fetchLatestMovies = useCallback(() => fetchMovies({ query: "" }), []);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(fetchLatestMovies, true);

  // Função de Ping
  const handlePing = async () => {
    setPingLoading(true);
    setPingStatus(null);
    try {
      await client.ping();
      setPingStatus("✅ Appwrite Conectado!");
    } catch (error: any) {
      console.error(error);
      setPingStatus(`❌ Falha: ${error?.message || "Erro de conexão"}`);
    } finally {
      setPingLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      {moviesLoading || trendingLoading ? (
        <ActivityIndicator size="large" color="#0000ff" className="flex-1" />
      ) : moviesError || trendingError ? (
        <Text className="text-white mt-10 px-5">
          Error: {moviesError?.message || trendingError?.message}
        </Text>
      ) : (
        <FlatList
          className="mt-2 pb-30"
          data={movies ?? []}
          renderItem={({ item }) => <MoviesCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 10,
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

              {trendingData.length > 0 && (
                <View className="mt-6 mb-4 px-3">
                  <Text className="text-lg text-white font-bold mb-3">
                    Trending Movies
                  </Text>

                  <FlatList
                    data={trendingData}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) =>
                      `${item.movie_id ?? item.searchTerm ?? index}`
                    }
                    renderItem={({ item, index }) => (
                      <View className="mr-3 relative overflow-visible">
                        <Text
                          className="absolute z-0"
                          style={{
                            fontSize: 88,
                            lineHeight: 88,
                            fontWeight: "800",
                            letterSpacing: -4,
                            color: "rgba(255,255,255,0.16)",
                            left: -16,
                            bottom: 2,
                            textShadowColor: "rgba(0,0,0,0.45)",
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 8,
                          }}
                        >
                          {index + 1}
                        </Text>

                        <View className="ml-6 w-[130px] rounded-2xl border border-white/10 bg-white/5 p-2 shadow-black shadow-lg z-10">
                          <Image
                            source={{
                              uri:
                                item.poster_url ||
                                "https://placehold.co/500x750?text=No+Image",
                            }}
                            className="w-[114px] h-[170px] rounded-xl"
                            resizeMode="cover"
                          />

                          <View className="mt-2 flex-row items-center justify-between">
                            <Text
                              className="text-white text-xs font-bold flex-1"
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>
                            <View className="ml-2 rounded-full bg-yellow-400/15 px-2 py-1">
                              <Text className="text-yellow-400 text-[10px] font-bold">
                                ★ {(item.vote_average ?? 0).toFixed(1)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                    contentContainerStyle={{ paddingRight: 12 }}
                  />
                </View>
              )}

              {/* --- CONTROLE DE PING DO APPWRITE --- */}
              <View className="items-center mt-4 mb-2">
                <Pressable
                  onPress={handlePing}
                  disabled={pingLoading}
                  className={`px-6 py-2 rounded-full ${pingLoading ? "bg-gray-500" : "bg-blue-600"}`}
                >
                  <Text className="text-white font-bold">
                    {pingLoading ? "Testando..." : "Ping Appwrite"}
                  </Text>
                </Pressable>
                {pingStatus && (
                  <Text className="text-white mt-2 text-sm">{pingStatus}</Text>
                )}
              </View>
              {/* ----------------------------------- */}

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
