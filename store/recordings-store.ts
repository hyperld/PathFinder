import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recording } from "@/types/recording";

interface RecordingsState {
  recordings: Recording[];

  saveRecording: (recording: Recording) => void;
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

      clearAllRecordings: () => set({ recordings: [] }),

      clearFavourites: () =>
        set((s) => ({
          recordings: s.recordings.filter((r) => !r.isFavourite),
        })),
    }),
    {
      name: "pathfinder-recordings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
