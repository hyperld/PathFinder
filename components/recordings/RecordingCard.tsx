import { useRef } from "react";
import { Pressable, View, Text, StyleSheet, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Recording } from "@/types/recording";
import { formatDuration, formatDistance } from "@/utils/format";

interface RecordingCardProps {
  recording: Recording;
  onPress: () => void;
  onToggleFavourite: () => void;
  onDelete: () => void;
}

export function RecordingCard({
  recording,
  onPress,
  onToggleFavourite,
  onDelete,
}: RecordingCardProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const date = new Date(recording.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete();
  };

  const renderLeftActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0.5, 1],
      extrapolate: "clamp",
    });

    return (
      <Pressable onPress={handleDelete} style={styles.deleteAction}>
        <Animated.View style={[styles.trashIcon, { transform: [{ scale }] }]}>
          <Ionicons name="trash" size={24} color="#fff" />
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.outerWrap}>
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        overshootLeft={false}
        leftThreshold={80}
      >
        <Pressable onPress={onPress} style={styles.card}>
          <View style={styles.swipeHint}>
            <Ionicons name="chevron-forward" size={12} color="#EF4444" />
          </View>

          <View style={styles.content}>
            <Text style={styles.name}>{recording.name || "Unnamed Route"}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.time}>{formattedTime}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons name="navigate-outline" size={14} color="#10B981" />
                <Text style={styles.statText}>
                  {formatDistance(recording.distance)}
                </Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="time-outline" size={14} color="#10B981" />
                <Text style={styles.statText}>
                  {formatDuration(recording.duration)}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={onToggleFavourite}
            hitSlop={12}
            style={styles.starBtn}
          >
            <Ionicons
              name={recording.isFavourite ? "star" : "star-outline"}
              size={24}
              color={recording.isFavourite ? "#FBBF24" : "#6B7280"}
            />
          </Pressable>

          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </Pressable>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  trashIcon: {
    alignItems: "center",
    gap: 4,
  },
  deleteText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#1E293B",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  swipeHint: {
    width: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  date: {
    color: "#CBD5E1",
    fontWeight: "600",
    fontSize: 13,
  },
  time: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "600",
  },
  starBtn: {
    padding: 8,
  },
});
