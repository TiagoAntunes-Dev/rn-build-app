export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEYS: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`, // <--- AQUI: Usa Bearer com o JWT
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  // Não precisa mais do api_key na URL, o Bearer cuida disso
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(
      `Falha para carregar filmes: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string,
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEYS}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Falha para carregar detalhes do filme: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data as MovieDetails;
  } catch (error) {
    console.log("Erro ao buscar detalhes do filme:", error);
    throw new Error("Falha ao buscar detalhes do filme.");
  }
};

export const fetchMovieVideos = async (
  movieId: string,
): Promise<MovieVideo[]> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos?language=pt-BR&include_video_language=pt,en,null`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(
      `Falha para carregar trailers: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.results as MovieVideo[];
};
