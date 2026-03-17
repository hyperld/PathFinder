import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, headerBackTitle: "Back" }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="history"
          options={{
            headerShown: true,
            headerTitle: "History",
            headerStyle: { backgroundColor: "#0F172A" },
            headerTintColor: "#fff",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="favourites"
          options={{
            headerShown: true,
            headerTitle: "Favourite Routes",
            headerStyle: { backgroundColor: "#0F172A" },
            headerTintColor: "#fff",
            animation: "slide_from_left",
          }}
        />
        <Stack.Screen
          name="detail/[id]"
          options={{
            headerShown: true,
            headerTitle: "Route Detail",
            headerStyle: { backgroundColor: "#0F172A" },
            headerTintColor: "#fff",
            animation: "slide_from_right",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
