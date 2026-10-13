import {
  getWatchlists,
  saveWatchlists,
  type Watchlist,
  type WatchlistMovie,
} from "@/lib/watchlists";
import { fetchMovies } from "@/services/api";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const posterUrl = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : null;

export default function Saved() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState(false);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);

  const activeList = watchlists.find((list) => list.id === activeListId);

  useEffect(() => {
    getWatchlists()
      .then(setWatchlists)
      .catch(() => setStorageError(true))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!activeListId || !query) return;

    let isCurrentRequest = true;
    const timeoutId = setTimeout(() => {
      setIsSearching(true);
      setSearchFailed(false);
      fetchMovies({ query })
        .then((movies) => {
          if (isCurrentRequest) {
            setSearchResults(Array.isArray(movies) ? movies : []);
          }
        })
        .catch(() => {
          if (isCurrentRequest) {
            setSearchResults([]);
            setSearchFailed(true);
          }
        })
        .finally(() => {
          if (isCurrentRequest) {
            setIsSearching(false);
          }
        });
    }, 350);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timeoutId);
    };
  }, [activeListId, searchQuery]);

  const persistWatchlists = async (nextWatchlists: Watchlist[]) => {
    setWatchlists(nextWatchlists);
    try {
      await saveWatchlists(nextWatchlists);
      setStorageError(false);
    } catch {
      setStorageError(true);
      Alert.alert("Erro ao salvar", "Não foi possível salvar suas watchlists.");
    }
  };

  const openCreateForm = () => {
    setEditingListId(null);
    setListName("");
    setListDescription("");
    setIsFormVisible(true);
  };

  const openEditForm = (list: Watchlist) => {
    setEditingListId(list.id);
    setListName(list.name);
    setListDescription(list.description);
    setIsFormVisible(true);
  };

  const submitListForm = () => {
    const name = listName.trim();
    if (!name) {
      Alert.alert("Nome obrigatório", "Escolha um nome para a watchlist.");
      return;
    }

    const existingList = watchlists.find((list) => list.id === editingListId);
    const nextList: Watchlist = {
      id: existingList?.id ?? `${Date.now()}`,
      name,
      description: listDescription.trim(),
      movies: existingList?.movies ?? [],
      createdAt: existingList?.createdAt ?? new Date().toISOString(),
    };
    const nextWatchlists = existingList
      ? watchlists.map((list) =>
          list.id === existingList.id ? nextList : list,
        )
      : [nextList, ...watchlists];

    void persistWatchlists(nextWatchlists);
    setIsFormVisible(false);
  };

  const deleteWatchlist = (list: Watchlist) => {
    Alert.alert("Excluir watchlist", `Excluir "${list.name}" e seus filmes?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          void persistWatchlists(
            watchlists.filter((item) => item.id !== list.id),
          );
          if (activeListId === list.id) {
            setActiveListId(null);
          }
        },
      },
    ]);
  };

  const updateListMovies = (listId: string, movies: WatchlistMovie[]) => {
    void persistWatchlists(
      watchlists.map((list) =>
        list.id === listId ? { ...list, movies } : list,
      ),
    );
  };

  const addMovie = (movie: Movie) => {
    if (!activeList || activeList.movies.some((item) => item.id === movie.id)) {
      return;
    }

    const savedMovie: WatchlistMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };
    updateListMovies(activeList.id, [savedMovie, ...activeList.movies]);
  };

  const removeMovie = (movieId: number) => {
    if (!activeList) return;
    updateListMovies(
      activeList.id,
      activeList.movies.filter((movie) => movie.id !== movieId),
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centeredPage}>
        <ActivityIndicator color="#e8b44f" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          {activeList ? (
            <Pressable
              onPress={() => {
                setActiveListId(null);
                setSearchQuery("");
                setSearchResults([]);
                setIsSearching(false);
                setSearchFailed(false);
              }}
              hitSlop={10}
            >
              <Text style={styles.backLabel}>‹ MINHAS LISTAS</Text>
            </Pressable>
          ) : (
            <Text style={styles.eyebrow}>SUA PRÓXIMA SESSÃO</Text>
          )}
          <Text style={styles.title}>{activeList?.name ?? "Watchlists"}</Text>
          <Text style={styles.subtitle}>
            {activeList
              ? activeList.description || "Sua seleção pessoal de filmes."
              : "Organize filmes em maratonas e coleções."}
          </Text>
        </View>

        {storageError && (
          <Text style={styles.errorMessage}>
            Não foi possível acessar o armazenamento local.
          </Text>
        )}

        {activeList ? (
          <>
            <View style={styles.listSummary}>
              <Text style={styles.count}>{activeList.movies.length}</Text>
              <Text style={styles.countLabel}>
                {activeList.movies.length === 1
                  ? "FILME NA LISTA"
                  : "FILMES NA LISTA"}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Adicionar filmes</Text>
            <TextInput
              value={searchQuery}
              onChangeText={(value) => {
                setSearchQuery(value);
                setSearchResults([]);
                setIsSearching(false);
                setSearchFailed(false);
              }}
              placeholder="Buscar um filme..."
              placeholderTextColor="#85858d"
              style={styles.searchInput}
              returnKeyType="search"
            />

            {isSearching && (
              <ActivityIndicator color="#e8b44f" style={styles.searchSpinner} />
            )}
            {searchQuery.trim() &&
              !isSearching &&
              searchResults.length === 0 && (
                <Text style={styles.emptyHint}>
                  {searchFailed
                    ? "Falha ao buscar filmes. Verifique sua conexão e tente novamente."
                    : "Nenhum filme encontrado."}
                </Text>
              )}
            {searchResults.map((movie) => {
              const alreadyAdded = activeList.movies.some(
                (item) => item.id === movie.id,
              );
              return (
                <View key={movie.id} style={styles.resultRow}>
                  <Poster path={movie.poster_path} compact />
                  <View style={styles.resultInfo}>
                    <Text style={styles.movieTitle} numberOfLines={2}>
                      {movie.title}
                    </Text>
                    <Text style={styles.movieMeta}>
                      {movie.release_date?.slice(0, 4) || "Ano desconhecido"}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => addMovie(movie)}
                    disabled={alreadyAdded}
                    style={[
                      styles.addButton,
                      alreadyAdded && styles.addButtonDisabled,
                    ]}
                  >
                    <Text style={styles.addButtonText}>
                      {alreadyAdded ? "Adicionado" : "+ Adicionar"}
                    </Text>
                  </Pressable>
                </View>
              );
            })}

            <Text style={styles.sectionTitle}>Na sua watchlist</Text>
            {activeList.movies.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Sua maratona comeca aqui</Text>
                <Text style={styles.emptyHint}>
                  Busque acima e adicione os filmes que quer assistir.
                </Text>
              </View>
            ) : (
              activeList.movies.map((movie, index) => (
                <View key={movie.id} style={styles.movieRow}>
                  <Text style={styles.movieNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  <Poster path={movie.poster_path} compact />
                  <View style={styles.resultInfo}>
                    <Text style={styles.movieTitle} numberOfLines={2}>
                      {movie.title}
                    </Text>
                    <Text style={styles.movieMeta}>
                      {movie.release_date?.slice(0, 4) || "Ano desconhecido"} ·
                      ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
                    </Text>
                  </View>
                  <Pressable onPress={() => removeMovie(movie.id)} hitSlop={8}>
                    <Text style={styles.removeLabel}>REMOVER</Text>
                  </Pressable>
                </View>
              ))
            )}
          </>
        ) : (
          <>
            <Pressable onPress={openCreateForm} style={styles.createButton}>
              <Text style={styles.createButtonMark}>+</Text>
              <Text style={styles.createButtonText}>Criar watchlist</Text>
            </Pressable>

            {watchlists.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>
                  Uma lista para cada maratona
                </Text>
                <Text style={styles.emptyHint}>
                  Crie uma watchlist, por exemplo Maratona Resident Evil, e
                  monte sua ordem de filmes.
                </Text>
              </View>
            ) : (
              <View style={styles.listCollection}>
                {watchlists.map((list) => (
                  <View key={list.id} style={styles.listCard}>
                    <Pressable
                      onPress={() => setActiveListId(list.id)}
                      style={styles.listCardMain}
                    >
                      <View style={styles.posterStack}>
                        {list.movies.slice(0, 3).map((movie, index) => (
                          <View
                            key={movie.id}
                            style={[
                              styles.stackPoster,
                              { left: index * 24, zIndex: 3 - index },
                            ]}
                          >
                            <Poster path={movie.poster_path} />
                          </View>
                        ))}
                        {list.movies.length === 0 && (
                          <View style={styles.emptyPoster}>
                            <Text style={styles.emptyPosterMark}>+</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.listCardInfo}>
                        <Text style={styles.listName} numberOfLines={2}>
                          {list.name}
                        </Text>
                        <Text style={styles.listDescription} numberOfLines={2}>
                          {list.description || "Sem descricao"}
                        </Text>
                        <Text style={styles.listCount}>
                          {list.movies.length}{" "}
                          {list.movies.length === 1 ? "filme" : "filmes"} ·
                          ABRIR LISTA ›
                        </Text>
                      </View>
                    </Pressable>
                    <View style={styles.cardActions}>
                      <Pressable onPress={() => openEditForm(list)} hitSlop={8}>
                        <Text style={styles.actionLabel}>EDITAR</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => deleteWatchlist(list)}
                        hitSlop={8}
                      >
                        <Text style={styles.deleteLabel}>EXCLUIR</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={isFormVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFormVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingListId ? "Editar watchlist" : "Nova watchlist"}
            </Text>
            <TextInput
              value={listName}
              onChangeText={setListName}
              placeholder="Nome da lista"
              placeholderTextColor="#85858d"
              style={styles.formInput}
              maxLength={50}
              autoFocus
            />
            <TextInput
              value={listDescription}
              onChangeText={setListDescription}
              placeholder="Descrição (opcional)"
              placeholderTextColor="#85858d"
              style={[styles.formInput, styles.descriptionInput]}
              maxLength={180}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setIsFormVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={submitListForm} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>
                  {editingListId ? "Salvar" : "Criar lista"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Poster({
  path,
  compact = false,
}: {
  path: string | null;
  compact?: boolean;
}) {
  const uri = posterUrl(path);
  return uri ? (
    <Image
      source={{ uri }}
      style={compact ? styles.compactPoster : styles.poster}
      resizeMode="cover"
    />
  ) : (
    <View
      style={
        compact ? styles.compactPosterPlaceholder : styles.posterPlaceholder
      }
    >
      <Text style={styles.posterPlaceholderText}>FILME</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#111114" },
  centeredPage: {
    flex: 1,
    backgroundColor: "#111114",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 22, paddingTop: 68, paddingBottom: 130 },
  header: { marginBottom: 26 },
  eyebrow: {
    color: "#e8b44f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  backLabel: {
    color: "#e8b44f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  title: { color: "#f5f3ed", fontSize: 32, fontWeight: "800" },
  subtitle: { color: "#a5a4a7", fontSize: 14, lineHeight: 21, marginTop: 7 },
  errorMessage: { color: "#f18c81", fontSize: 13, marginBottom: 16 },
  createButton: {
    minHeight: 56,
    backgroundColor: "#e8b44f",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginBottom: 22,
  },
  createButtonMark: {
    color: "#211a0d",
    fontSize: 24,
    fontWeight: "500",
    marginTop: -2,
  },
  createButtonText: { color: "#211a0d", fontWeight: "800", fontSize: 15 },
  listCollection: { gap: 13 },
  listCard: {
    backgroundColor: "#1b1b20",
    borderWidth: 1,
    borderColor: "#303036",
    borderRadius: 12,
    padding: 14,
  },
  listCardMain: { flexDirection: "row", minHeight: 114, alignItems: "center" },
  posterStack: {
    width: 112,
    height: 105,
    position: "relative",
    justifyContent: "center",
    flexShrink: 0,
  },
  stackPoster: {
    position: "absolute",
    top: 4,
    borderWidth: 2,
    borderColor: "#1b1b20",
    borderRadius: 6,
    overflow: "hidden",
  },
  poster: {
    width: 62,
    height: 90,
    borderRadius: 5,
    backgroundColor: "#2d2d33",
  },
  emptyPoster: {
    width: 62,
    height: 90,
    borderRadius: 5,
    backgroundColor: "#29292f",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3c3c43",
    borderStyle: "dashed",
  },
  emptyPosterMark: { color: "#e8b44f", fontSize: 24 },
  listCardInfo: { flex: 1, paddingLeft: 8 },
  listName: { color: "#f5f3ed", fontSize: 17, fontWeight: "800" },
  listDescription: {
    color: "#9d9ca3",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
    minHeight: 34,
  },
  listCount: {
    color: "#e8b44f",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 8,
    letterSpacing: 0.5,
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: "#303036",
    paddingTop: 11,
    marginTop: 11,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  actionLabel: {
    color: "#b5b4bb",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  deleteLabel: {
    color: "#da8077",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  emptyState: {
    borderTopWidth: 1,
    borderTopColor: "#303036",
    paddingTop: 25,
    marginTop: 8,
  },
  emptyTitle: { color: "#f5f3ed", fontSize: 17, fontWeight: "700" },
  emptyHint: { color: "#99989f", fontSize: 13, lineHeight: 19, marginTop: 7 },
  listSummary: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 9,
    marginBottom: 27,
    borderBottomWidth: 1,
    borderBottomColor: "#303036",
    paddingBottom: 16,
  },
  count: { color: "#e8b44f", fontSize: 28, fontWeight: "800" },
  countLabel: {
    color: "#a5a4a7",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sectionTitle: {
    color: "#f5f3ed",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#1b1b20",
    borderWidth: 1,
    borderColor: "#37373e",
    borderRadius: 10,
    color: "#f5f3ed",
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 14,
  },
  searchSpinner: { marginTop: 15 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#29292f",
  },
  movieRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#29292f",
  },
  compactPoster: {
    width: 48,
    height: 68,
    borderRadius: 5,
    backgroundColor: "#2d2d33",
  },
  compactPosterPlaceholder: {
    width: 48,
    height: 68,
    borderRadius: 5,
    backgroundColor: "#2d2d33",
    alignItems: "center",
    justifyContent: "center",
  },
  resultInfo: { flex: 1 },
  movieTitle: {
    color: "#f5f3ed",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  movieMeta: { color: "#99989f", fontSize: 11, marginTop: 5 },
  addButton: {
    backgroundColor: "#e8b44f",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 7,
  },
  addButtonDisabled: { backgroundColor: "#35343a" },
  addButtonText: { color: "#211a0d", fontSize: 10, fontWeight: "800" },
  movieNumber: { color: "#73727a", fontSize: 11, fontWeight: "800", width: 21 },
  removeLabel: {
    color: "#da8077",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  posterPlaceholder: {
    width: 67,
    height: 98,
    borderRadius: 5,
    backgroundColor: "#2d2d33",
    alignItems: "center",
    justifyContent: "center",
  },
  posterPlaceholderText: {
    color: "#99989f",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.76)",
    justifyContent: "center",
    padding: 22,
  },
  modalContent: {
    backgroundColor: "#1b1b20",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#37373e",
    padding: 20,
  },
  modalTitle: {
    color: "#f5f3ed",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 18,
  },
  formInput: {
    backgroundColor: "#111114",
    borderWidth: 1,
    borderColor: "#37373e",
    borderRadius: 9,
    color: "#f5f3ed",
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  descriptionInput: { height: 92 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  cancelButton: { paddingHorizontal: 14, paddingVertical: 11 },
  cancelButtonText: { color: "#c0bfc5", fontSize: 13, fontWeight: "700" },
  saveButton: {
    backgroundColor: "#e8b44f",
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 8,
  },
  saveButtonText: { color: "#211a0d", fontSize: 13, fontWeight: "800" },
});
