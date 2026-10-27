import { Alert } from "react-native";
import { Client, Databases, ID, Query } from "react-native-appwrite";

type Movie = {
  id: number;
  poster_path?: string | null;
  title: string;
  vote_average?: number;
};

// Cada variável é lida por extenso para o Expo embutir o valor no build.
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;

const missingEnvVars = Object.entries({
  EXPO_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID: PROJECT_ID,
  EXPO_PUBLIC_APPWRITE_DATABASE_ID: DATABASE_ID,
  EXPO_PUBLIC_APPWRITE_COLLECTION_ID: COLLECTION_ID,
})
  .filter(([, value]) => !value?.trim())
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Appwrite config is missing: ${missingEnvVars.join(", ")}. Add them to your .env file.`,
  );
}

export const client = new Client()
  .setEndpoint(ENDPOINT!)
  .setProject(PROJECT_ID!);

const databases = new Databases(client);

const getMovieRatingFromTmdb = async (movieId: number): Promise<number> => {
  if (!movieId) {
    return 0;
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return Number(data?.vote_average ?? 0);
  } catch (error) {
    console.error("Erro ao buscar avaliação do filme no TMDB:", error);
    return 0;
  }
};

export const updateSearchCount = async (query: string, movie: Movie) => {
  const searchTerm = query.trim();

  if (!searchTerm) {
    return;
  }

  try {
    const result = await databases.listDocuments(DATABASE_ID!, COLLECTION_ID!, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await databases.updateDocument(
        DATABASE_ID!,
        COLLECTION_ID!,
        existingMovie.$id,
        {
          count: Number(existingMovie.count ?? 0) + 1,
          movie_id: movie.id,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          title: movie.title,
        },
      );
    } else {
      await databases.createDocument(
        DATABASE_ID!,
        COLLECTION_ID!,
        ID.unique(),
        {
          searchTerm,
          movie_id: movie.id,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          title: movie.title,
          count: 1,
        },
      );
    }
  } catch (error: any) {
    console.error("Erro ao atualizar contagem de busca:", error);
    Alert.alert("Erro no Appwrite", error?.message || "Erro desconhecido");
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await databases.listDocuments(DATABASE_ID!, COLLECTION_ID!, [
      Query.orderDesc("count"),
      Query.limit(5),
    ]);

    const normalizedMovies = await Promise.all(
      result.documents.map(async (document) => {
        const movieId = Number(document.movie_id ?? 0);
        const storedVoteAverage = Number(document.vote_average ?? 0);

        const resolvedVoteAverage =
          storedVoteAverage > 0
            ? storedVoteAverage
            : await getMovieRatingFromTmdb(movieId);

        return {
          documentId: document.$id,
          searchTerm: String(document.searchTerm ?? ""),
          movie_id: movieId,
          title: String(document.title ?? "Movie"),
          count: Number(document.count ?? 0),
          poster_url: String(document.poster_url ?? ""),
          vote_average: resolvedVoteAverage,
        } satisfies TrendingMovie;
      }),
    );

    return normalizedMovies;
  } catch (error: any) {
    console.error("Erro ao buscar filmes em alta:", error);
    Alert.alert("Erro no Appwrite", error?.message || "Erro desconhecido");
    return undefined;
  }
};
