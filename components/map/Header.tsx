import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTrackingStore } from "@/store/tracking-store";
import { formatDuration, formatDistance } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";

export function Header() {
  const insets = useSafeAreaInsets();
  const { isTracking, duration, distance } = useTrackingStore();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 8 }]}>
      <View style={styles.bar}>
        <View style={styles.titleRow}>
          <Ionicons name="navigate-circle" size={22} color="#2563EB" />
          <Text style={styles.title}>PathFinder</Text>
        </View>

        {isTracking && (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={16} color="#10B981" />
              <Text style={styles.statText}>{formatDuration(duration)}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="footsteps-outline" size={16} color="#10B981" />
              <Text style={styles.statText}>{formatDistance(distance)}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  bar: {
    backgroundColor: "rgba(30, 41, 59, 0.92)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: "#10B981",
    fontWeight: "600",
    fontSize: 14,
  },
});
