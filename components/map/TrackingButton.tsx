import { Pressable, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface TrackingButtonProps {
  isTracking: boolean;
  onPress: () => void;
}

const FLIP_DURATION = 500;

export function TrackingButton({ isTracking, onPress }: TrackingButtonProps) {
  const flip = useSharedValue(0);

  const handlePress = () => {
    flip.value = withTiming(isTracking ? 0 : 1, {
      duration: FLIP_DURATION,
      easing: Easing.inOut(Easing.ease),
    });
    setTimeout(onPress, FLIP_DURATION / 2);
  };

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 800 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden" as const,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 800 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden" as const,
    };
  });

  return (
    <Pressable onPress={handlePress} style={styles.pressable}>
      <Animated.View style={[styles.face, styles.frontFace, frontStyle]}>
        <Ionicons name="play-circle" size={24} color="#fff" />
        <Text style={styles.label}>Start Tracking</Text>
      </Animated.View>

      <Animated.View style={[styles.face, styles.backFace, backStyle]}>
        <Ionicons name="stop-circle" size={24} color="#fff" />
        <Text style={styles.label}>Stop & Save</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: 192,
    height: 56,
    alignItems: "center",
  },
  face: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  frontFace: {
    backgroundColor: "#10B981",
  },
  backFace: {
    backgroundColor: "#EF4444",
  },
  label: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
