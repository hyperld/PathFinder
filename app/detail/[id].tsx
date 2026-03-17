import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { useRecordingsStore } from "@/store/recordings-store";
import { formatDuration, formatDistance } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mapRef = useRef<MapView>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const renameRecording = useRecordingsStore((s) => s.renameRecording);
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

  useEffect(() => {
    if (recording) {
      setDraftName(recording.name || "Unnamed Route");
    }
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

  const saveName = () => {
    renameRecording(recording.id, draftName);
    setIsEditingName(false);
  };

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
        {!isEditingName ? (
          <View style={styles.nameRow}>
            <Text style={styles.routeName}>{recording.name || "Unnamed Route"}</Text>
            <Pressable
              style={styles.renameBtn}
              onPress={() => setIsEditingName(true)}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
              <Text style={styles.renameText}>Rename</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.editRow}>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Route name"
              placeholderTextColor="#64748B"
              style={styles.input}
              autoFocus
              maxLength={40}
            />
            <Pressable style={styles.saveBtn} onPress={saveName}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </Pressable>
            <Pressable
              style={styles.cancelBtn}
              onPress={() => {
                setDraftName(recording.name || "Unnamed Route");
                setIsEditingName(false);
              }}
            >
              <Ionicons name="close" size={18} color="#fff" />
            </Pressable>
          </View>
        )}

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
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  routeName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    flex: 1,
  },
  renameBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(37, 99, 235, 0.3)",
  },
  renameText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#0F172A",
    color: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
    fontWeight: "600",
  },
  saveBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
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
