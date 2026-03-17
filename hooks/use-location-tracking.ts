import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { useTrackingStore } from "@/store/tracking-store";
import { Coordinate } from "@/types/recording";

export function useLocationTracking() {
  const subscription = useRef<Location.LocationSubscription | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const { isTracking, addCoordinate } = useTrackingStore();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: loc.timestamp,
      });
    })();
  }, []);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    subscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 2,
      },
      (loc) => {
        const coord: Coordinate = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: loc.timestamp,
        };
        setCurrentLocation(coord);
        addCoordinate(coord);
      }
    );
  };

  const stopTracking = () => {
    subscription.current?.remove();
    subscription.current = null;
  };

  useEffect(() => {
    return () => {
      subscription.current?.remove();
    };
  }, []);

  return { startTracking, stopTracking, currentLocation };
}
