import { create } from "zustand";
import { Coordinate } from "@/types/recording";
import { haversine } from "@/utils/distance";

interface TrackingState {
  isTracking: boolean;
  coordinates: Coordinate[];
  duration: number;
  distance: number;

  startTracking: () => void;
  stopTracking: () => void;
  addCoordinate: (coord: Coordinate) => void;
  incrementDuration: () => void;
  reset: () => void;
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  isTracking: false,
  coordinates: [],
  duration: 0,
  distance: 0,

  startTracking: () => set({ isTracking: true }),

  stopTracking: () => set({ isTracking: false }),

  addCoordinate: (coord) => {
    const { coordinates, distance } = get();
    const lastCoord = coordinates[coordinates.length - 1];
    const added = lastCoord ? haversine(lastCoord, coord) : 0;

    set({
      coordinates: [...coordinates, coord],
      distance: distance + added,
    });
  },

  incrementDuration: () => set((s) => ({ duration: s.duration + 1 })),

  reset: () => set({ coordinates: [], duration: 0, distance: 0 }),
}));
