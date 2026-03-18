# PathFinder

A React Native (Expo) app that tracks walking/running routes using GPS, displays them on a live map, and lets you save, review, rename, favourite, and delete recorded routes.

## Running the Project

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo`)
- iOS Simulator (macOS) or Android Emulator, or the **Expo Go** app on a physical device

### Setup

```bash
# Install dependencies
npm install

# Start the Expo dev server
npx expo start
```

From there:
- Press **i** to open in iOS Simulator
- Press **a** to open in Android Emulator
- Scan the QR code with Expo Go on a physical device

> **Note:** GPS tracking requires a physical device. Simulators can use simulated locations but won't produce realistic route data.

## AI Tools Used

**Cursor (Claude)** was used throughout the entire development process:

- **Architecture & scaffolding** — Generated the initial project structure, Expo Router layout, and Zustand store design. This saved significant time on boilerplate and ensured the navigation stack, state management, and file organisation all followed modern conventions from the start.
- **Feature implementation** — Built out core features (GPS tracking with jitter filtering, haversine distance calculation, swipe-to-delete cards, animated tracking button) through iterative prompts. The AI handled wiring up expo-location subscriptions, persisted storage with Zustand middleware, and react-native-reanimated flip animations.
- **Code review & refactoring** — Used the AI to audit the full codebase for dead code, unused imports, naming inconsistencies, and orphaned template files. It identified an entire chain of unused Expo template components and safely removed them, and relocated shared components to appropriate folders.
- **Edge-case handling** — The AI identified and fixed GPS jitter inflating distance calculations (accuracy-based filtering) and implemented a full location-permission-denied flow with automatic re-checking when the app returns from Settings.

## Biggest Challenge During the Vibe Coding Process

The hardest part was **GPS accuracy and distance inflation**. When tracking short walks (10–20 meters), the recorded distance would often show 5–10x the real value. The initial instinct was that the haversine math was wrong, but the formula was correct — the real culprit was GPS jitter. Phone GPS drifts ±5–15 meters even when standing still, and every tiny drift was being blindly accumulated as "walked distance."

The fix required understanding how `expo-location`'s `coords.accuracy` field works, then designing a filter that only records a new coordinate when the movement exceeds `max(reported_accuracy, 5m)`. Getting the threshold right — filtering enough jitter without swallowing real short movements — took several iterations of testing and tuning. It was a good reminder that working with real-world sensor data is fundamentally messier than working with clean API responses.
