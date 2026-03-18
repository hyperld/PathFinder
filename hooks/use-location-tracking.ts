import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Linking } from "react-native";
import * as Location from "expo-location";
import { useTrackingStore } from "@/store/tracking-store";
import { Coordinate } from "@/types/recording";
import { haversine } from "@/utils/distance";

export type PermissionStatus = "undetermined" | "granted" | "denied";

const MIN_MOVEMENT_M = 5;

export function useLocationTracking() {
  const subscription = useRef<Location.LocationSubscription | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>("undetermined");
  const currentLocationRef = useRef<Coordinate | null>(null);
  const lastRecordedCoord = useRef<Coordinate | null>(null);
  const addCoordinate = useTrackingStore((s) => s.addCoordinate);

  const fetchCurrentLocation = useCallback(async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const coord: Coordinate = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: loc.timestamp,
      };
      setCurrentLocation(coord);
      currentLocationRef.current = coord;
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setPermissionStatus("granted");
        await fetchCurrentLocation();
      } else {
        setPermissionStatus("denied");
      }
    })();
  }, [fetchCurrentLocation]);

  useEffect(() => {
    const listener = AppState.addEventListener("change", async (nextState) => {
      if (nextState === "active") {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === "granted") {
          setPermissionStatus("granted");
          if (!currentLocationRef.current) {
            await fetchCurrentLocation();
          }
        } else {
          setPermissionStatus("denied");
        }
      }
    });
    return () => listener.remove();
  }, [fetchCurrentLocation]);

  const requestPermission = useCallback(async () => {
    const { canAskAgain } = await Location.getForegroundPermissionsAsync();

    if (canAskAgain) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setPermissionStatus("granted");
        await fetchCurrentLocation();
      } else {
        setPermissionStatus("denied");
      }
    } else {
      await Linking.openSettings();
    }
  }, [fetchCurrentLocation]);

  const startTracking = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPermissionStatus("denied");
      return;
    }

    lastRecordedCoord.current = null;

    subscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 3,
      },
      (loc) => {
        const coord: Coordinate = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        };
        setCurrentLocation(coord);
        currentLocationRef.current = coord;

        const accuracy = loc.coords.accuracy ?? 10;
        const threshold = Math.max(accuracy, MIN_MOVEMENT_M);

        if (lastRecordedCoord.current) {
          const moved = haversine(lastRecordedCoord.current, coord);
          if (moved < threshold) return;
        }

        lastRecordedCoord.current = coord;
        addCoordinate(coord);
      }
    );
  }, [addCoordinate]);

  const stopTracking = useCallback(() => {
    subscription.current?.remove();
    subscription.current = null;
  }, []);

  useEffect(() => {
    return () => {
      subscription.current?.remove();
    };
  }, []);

  return {
    startTracking,
    stopTracking,
    currentLocation,
    permissionStatus,
    requestPermission,
  };
}
