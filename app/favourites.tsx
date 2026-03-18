import { View, Text, FlatList, Pressable, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useRecordingsStore } from "@/store/recordings-store";
import { RecordingCard } from "@/components/recordings/RecordingCard";
import { Ionicons } from "@expo/vector-icons";

export default function FavouritesScreen() {
  const router = useRouter();
  const { recordings, toggleFavourite, deleteRecording, clearFavourites } =
    useRecordingsStore();
  const favourites = recordings.filter((r) => r.isFavourite);

  const handleClearAll = () => {
    Alert.alert(
      "Clear Favourites",
      "Delete all favourite recordings? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: clearFavourites,
        },
      ]
    );
  };

  if (favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="star-outline" size={64} color="#334155" />
        <Text style={styles.emptyTitle}>No favourite routes</Text>
        <Text style={styles.emptySubtitle}>
          Star a recording to see it here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.countText}>
          {favourites.length} favourite{favourites.length !== 1 ? "s" : ""}
        </Text>
        <Pressable onPress={handleClearAll} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text style={styles.clearText}>Clear All</Text>
        </Pressable>
      </View>

      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <RecordingCard
            recording={item}
            onPress={() => router.push(`/detail/${item.id}`)}
            onToggleFavourite={() => toggleFavourite(item.id)}
            onDelete={() => deleteRecording(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyTitle: {
    color: "#6B7280",
    fontSize: 16,
  },
  emptySubtitle: {
    color: "#4B5563",
    fontSize: 14,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  countText: {
    color: "#6B7280",
    fontSize: 13,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
  clearText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },
});
