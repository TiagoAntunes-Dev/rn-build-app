import AsyncStorage from "@react-native-async-storage/async-storage";

export type WatchlistMovie = Pick<
  Movie,
  "id" | "title" | "poster_path" | "release_date" | "vote_average"
>;

export type Watchlist = {
  id: string;
  name: string;
  description: string;
  movies: WatchlistMovie[];
  createdAt: string;
};

const WATCHLISTS_STORAGE_KEY = "movie-watchlists-v1";

export const getWatchlists = async (): Promise<Watchlist[]> => {
  const storedWatchlists = await AsyncStorage.getItem(WATCHLISTS_STORAGE_KEY);

  if (!storedWatchlists) {
    return [];
  }

  const parsedWatchlists: unknown = JSON.parse(storedWatchlists);
  return Array.isArray(parsedWatchlists) ? parsedWatchlists : [];
};

export const saveWatchlists = async (watchlists: Watchlist[]) => {
  await AsyncStorage.setItem(
    WATCHLISTS_STORAGE_KEY,
    JSON.stringify(watchlists),
  );
};
