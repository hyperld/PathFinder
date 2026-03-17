import { useEffect, useRef } from "react";
import { useTrackingStore } from "@/store/tracking-store";

export function useTimer() {
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isTracking, incrementDuration } = useTrackingStore();

  useEffect(() => {
    if (isTracking) {
      interval.current = setInterval(() => {
        incrementDuration();
      }, 1000);
    } else if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [isTracking, incrementDuration]);
}
