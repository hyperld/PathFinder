import { useRef, useCallback, useEffect } from "react";
import { View, Alert, Pressable, StyleSheet } from "react-native";
import MapView, { Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Header } from "@/components/map/Header";
import { TrackingButton } from "@/components/map/TrackingButton";
import { NavButton } from "@/components/map/NavButton";

import { useTrackingStore } from "@/store/tracking-store";
import { useRecordingsStore } from "@/store/recordings-store";
import { useLocationTracking } from "@/hooks/use-location-tracking";
import { useTimer } from "@/hooks/use-timer";

const DELTA = 0.003;
const TRACKING_DELTA = 0.0015;

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const hasCentered = useRef(false);

  const {
    isTracking,
    coordinates,
    duration,
    distance,
    startTracking: storeStart,
    stopTracking: storeStop,
    reset,
  } = useTrackingStore();
  const { saveRecording } = useRecordingsStore();
  const {
    startTracking: locationStart,
    stopTracking: locationStop,
    currentLocation,
  } = useLocationTracking();

  useTimer();

  const recenter = useCallback(() => {
    if (!currentLocation) return;
    mapRef.current?.animateToRegion(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: DELTA,
        longitudeDelta: DELTA,
      },
      600
    );
  }, [currentLocation]);

  useEffect(() => {
    if (currentLocation && !hasCentered.current) {
      hasCentered.current = true;
      recenter();
    }
  }, [currentLocation, recenter]);

  const handleToggleTracking = useCallback(() => {
    if (!isTracking) {
      storeStart();
      locationStart();
      if (currentLocation) {
        mapRef.current?.animateToRegion(
          {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: TRACKING_DELTA,
            longitudeDelta: TRACKING_DELTA,
          },
          800
        );
      }
    } else {
      storeStop();
      locationStop();

      const state = useTrackingStore.getState();

      if (state.coordinates.length < 2) {
        Alert.alert("Too Short", "Walk a bit more before saving a route.");
        reset();
        return;
      }

      saveRecording({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        distance: state.distance,
        duration: state.duration,
        coordinates: state.coordinates,
        isFavourite: false,
      });

      reset();
    }
  }, [
    isTracking,
    currentLocation,
    storeStart,
    storeStop,
    locationStart,
    locationStop,
    saveRecording,
    reset,
  ]);

  const initialRegion = currentLocation
    ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : {
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation
        followsUserLocation={isTracking}
        showsMyLocationButton={false}
        showsCompass={false}
        legalLabelInsets={{ bottom: 8, left: 8, right: 0, top: 0 }}
      >
        {coordinates.length >= 2 && (
          <Polyline
            coordinates={coordinates.map((c) => ({
              latitude: c.latitude,
              longitude: c.longitude,
            }))}
            strokeColor="#2563EB"
            strokeWidth={4}
          />
        )}
      </MapView>

      <Header />

      <Pressable
        onPress={recenter}
        style={[styles.recenterBtn, { top: insets.top + 72 }]}
      >
        <Ionicons name="locate" size={22} color="#fff" />
      </Pressable>

      <View style={styles.bottomBar}>
        <NavButton icon="star" onPress={() => router.push("/favourites")} />

        <TrackingButton
          isTracking={isTracking}
          onPress={handleToggleTracking}
        />

        <NavButton icon="time" onPress={() => router.push("/history")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  recenterBtn: {
    position: "absolute",
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(30, 41, 59, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  bottomBar: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
