import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recording } from "@/types/recording";

interface RecordingsState {
  recordings: Recording[];

  saveRecording: (recording: Recording) => void;
  renameRecording: (id: string, name: string) => void;
  deleteRecording: (id: string) => void;
  toggleFavourite: (id: string) => void;
  clearAllRecordings: () => void;
  clearFavourites: () => void;
}

export const useRecordingsStore = create<RecordingsState>()(
  persist(
    (set) => ({
      recordings: [],

      saveRecording: (recording) =>
        set((s) => ({ recordings: [recording, ...s.recordings] })),

      renameRecording: (id, name) =>
        set((s) => ({
          recordings: s.recordings.map((r) =>
            r.id === id ? { ...r, name: name.trim() || r.name || "Unnamed Route" } : r
          ),
        })),

      deleteRecording: (id) =>
        set((s) => ({
          recordings: s.recordings.filter((r) => r.id !== id),
        })),

      toggleFavourite: (id) =>
        set((s) => ({
          recordings: s.recordings.map((r) =>
            r.id === id ? { ...r, isFavourite: !r.isFavourite } : r
          ),
        })),

      clearAllRecordings: () =>
        set((s) => ({
          recordings: s.recordings.filter((r) => r.isFavourite),
        })),

      clearFavourites: () =>
        set((s) => ({
          recordings: s.recordings.filter((r) => !r.isFavourite),
        })),
    }),
    {
      name: "pathfinder-recordings",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState: unknown) => {
        const state = persistedState as { recordings?: Recording[] } | undefined;
        if (!state?.recordings) {
          return { recordings: [] };
        }

        return {
          recordings: state.recordings.map((r, index) => ({
            ...r,
            name: r.name ?? `Route ${index + 1}`,
          })),
        };
      },
    }
  )
);
