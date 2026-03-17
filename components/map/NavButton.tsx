import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NavButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export function NavButton({ icon, onPress }: NavButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Ionicons name={icon} size={26} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(30, 41, 59, 0.92)",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
