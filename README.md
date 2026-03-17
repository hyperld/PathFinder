# PathFinder

A React Native (Expo) mobile application for tracking physical movements in real-time, saving routes, and reviewing past activities.

## Features

- **Real-Time Map** -- Full-screen Apple Maps integration via `react-native-maps`, showing the user's live location with automatic centering on launch.
- **Activity Tracking** -- Start/Stop button with a 3D flip animation. Records GPS coordinates in real-time, draws a polyline on the map, and displays live duration and estimated distance in the header.
- **Persistence** -- Saves recordings (date, distance, duration, coordinate array) locally via AsyncStorage through Zustand's persist middleware.
- **History** -- Lists all past recordings with date, distance, and duration. Swipe any card right to reveal a delete action, or use "Clear All" to wipe everything.
- **Favourite Routes** -- Star any recording from the History screen to bookmark it. Favourited routes are accessible from the main map screen via a dedicated button.
- **Detail View** -- Tap any recording to view the full route rendered on a map with start/end markers and stats.
- **Recenter** -- A locate button below the header snaps the map back to the user's current position.

## Tech Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| Framework        | Expo (Managed Workflow, Expo Go)          |
| Navigation       | Expo Router (stack-based)                 |
| Maps             | react-native-maps (Apple Maps on iOS)     |
| Location         | expo-location (foreground GPS tracking)   |
| State Management | Zustand with AsyncStorage persistence     |
| Animations       | react-native-reanimated                   |
| Gestures         | react-native-gesture-handler (Swipeable)  |
| Icons            | @expo/vector-icons (Ionicons)             |

## Project Structure

```
app/
  _layout.tsx            Root stack navigator
  index.tsx              Main map screen
  history.tsx            Recording history list
  favourites.tsx         Starred recordings
  detail/[id].tsx        Route detail view

components/
  map/
    Header.tsx           Top bar with live stats
    TrackingButton.tsx   Start/Stop with flip animation
    NavButton.tsx        Circular icon button
  history/
    RecordingCard.tsx    Swipeable recording list item

store/
  tracking-store.ts      Live session state
  recordings-store.ts    Persisted recordings

hooks/
  use-location-tracking.ts   GPS subscription
  use-timer.ts               Duration counter

utils/
  distance.ts            Haversine formula
  format.ts              Duration and distance formatting

types/
  recording.ts           TypeScript interfaces
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Open the app in Expo Go on your iOS device by scanning the QR code.

## Permissions

The app requests foreground location access to track your position. On iOS this is handled via the `NSLocationWhenInUseUsageDescription` key in `app.json`.
