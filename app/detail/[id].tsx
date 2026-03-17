import { useRef, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { useRecordingsStore } from "@/store/recordings-store";
import { formatDuration, formatDistance } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mapRef = useRef<MapView>(null);
  const recording = useRecordingsStore((s) =>
    s.recordings.find((r) => r.id === id)
  );

  useEffect(() => {
    if (!recording || recording.coordinates.length < 2) return;

    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        recording.coordinates.map((c) => ({
          latitude: c.latitude,
          longitude: c.longitude,
        })),
        {
          edgePadding: { top: 80, right: 60, bottom: 200, left: 60 },
          animated: true,
        }
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [recording]);

  if (!recording) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Recording not found</Text>
      </View>
    );
  }

  const startCoord = recording.coordinates[0];
  const endCoord = recording.coordinates[recording.coordinates.length - 1];
  const date = new Date(recording.date);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: startCoord.latitude,
          longitude: startCoord.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled
        zoomEnabled
        showsCompass={false}
      >
        <Polyline
          coordinates={recording.coordinates.map((c) => ({
            latitude: c.latitude,
            longitude: c.longitude,
          }))}
          strokeColor="#2563EB"
          strokeWidth={4}
        />
        <Marker
          coordinate={{
            latitude: startCoord.latitude,
            longitude: startCoord.longitude,
          }}
          title="Start"
          pinColor="#10B981"
        />
        <Marker
          coordinate={{
            latitude: endCoord.latitude,
            longitude: endCoord.longitude,
          }}
          title="End"
          pinColor="#EF4444"
        />
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.dateText}>
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
        <Text style={styles.timeText}>
          {date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="footsteps-outline" size={22} color="#10B981" />
            <Text style={styles.statValue}>
              {formatDistance(recording.distance)}
            </Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={22} color="#10B981" />
            <Text style={styles.statValue}>
              {formatDuration(recording.duration)}
            </Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="location-outline" size={22} color="#10B981" />
            <Text style={styles.statValue}>
              {recording.coordinates.length}
            </Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  map: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
  },
  infoCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(30, 41, 59, 0.96)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  dateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 4,
  },
  timeText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: "#10B981",
    fontWeight: "700",
    fontSize: 18,
  },
  statLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
});
