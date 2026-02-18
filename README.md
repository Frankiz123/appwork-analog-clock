# appwork-analog-clock (React Native Home Exercise)

A React Native mobile app that displays a real-time **analog clock** and lets the user switch between **time zones** fetched from an online API. The app supports **offline mode** by caching the time zone list in a local **SQLite** database and persists the **last selected** time zone on launch.

## Features

- **Analog clock UI** with hour / minute / second hands (real-time updates)
- **Responsive sizing** across devices + **orientation change** support
- **Time zone selector** (search + list)
- **Offline-first** time zone loading (SQLite cache)
- **Background sync on reconnect** when the cache is empty
- **Persistence** of the last selected time zone

## Tech stack

- React Native (CLI)
- TypeScript
- SQLite via `@op-engineering/op-sqlite`
- Network status via `@react-native-community/netinfo`
- `react-native-svg` for drawing clock design (hands/markers)

## Getting started

### 1) Install dependencies

```bash
npm install --legacy-peer-deps
# or
yarn install
```

### 2) iOS pods

```bash
cd ios
pod install
cd ..
```

### 3) Run

```bash
#or
npx react-native run-ios
# or
npx react-native run-android
```

## Configuration

### Timezone API

This project uses **TimezoneDB** (example suggested in the assignment).

- API base: `https://api.timezonedb.com/v2.1`
- API key is loaded from environment variables (not committed to the repo).

#### 1) Create a `.env` file (local only)

Create a `.env` file in the project root:

```env
TIMEZONE_API_KEY=YOUR_TIMEZONEDB_KEY
```

If the API request fails or the key is missing/invalid, the app continues to function (clock still shows local time), and will use cached timezones if available.

## Architecture

Code is organized by responsibility:

```
src/
  components/
    analog-clock/          # Analog clock UI
    digital-time/          # Optional digital clock
    header-image/          # Optional Static header image
    time-zone-selector/    # Searchable timezone list
  hooks/
    useCurrentTime.ts      # Clock ticking + offset handling
    useTimezones.ts        # Offline-first loading + selection/persistence
  services/
    timeZoneApi.ts         # API call to fetch timezone list
    database.ts            # SQLite init + cache + preferences
  screens/
    home/                  # Screen composition
  config/
    constants.ts           # Constants like API Url, Key, async, color etc
  types/
    timeZone.ts            # Interfaces
```

### Key responsibilities

- **`useTimezones`**

  - Loads cached timezones from SQLite on launch.
  - If the cache is empty, tries to fetch from the API and caches results.
  - If offline on first launch, listens for connectivity and fetches once reconnected.
  - Restores and persists the user’s last selected timezone.

- **`useCurrentTime`**

  - Runs a 1-second tick interval.
  - Supports displaying local time or a selected timezone via `gmtOffset` seconds.

- **DB layer (`services/database.ts`)**
  - `timezones` table: cached timezone list
  - `preferences` table: last selected timezone

## Offline caching approach

1. **App launch** → initialize DB and attempt to load `timezones` from SQLite.
2. If cached list exists → show immediately (fast start, works offline).
3. If cache is empty:
   - If online → fetch from API, then store in SQLite.
   - If offline → show offline state and **wait for reconnect**; once online, fetch and cache.
4. **DB failure / corruption** → DB is re-initialized and the app falls back to API fetch on next successful network availability.

## Assumptions & trade-offs

- **Timezone source:** Uses TimezoneDB as suggested by the assignment.
- **Clock rendering:** Uses `react-native-svg` for drawing primitives; this avoids any prebuilt analog clock component while keeping the UI lightweight.
- **Tick interval:** 1000ms (1 second) for predictable updates and lower CPU usage vs high-frequency animation.
- **Offset handling:** Uses `gmtOffset` from the API as seconds offset. For simplicity, the clock time is computed by shifting the current time by this offset.
- **DST:** The API provides a `dst` flag. For this exercise, `gmtOffset` is used as provided by the API response.

## Note

- The UI includes an empty/offline state when the timezone list is not available.
- `.env` is not committed to the repository.
- Use `.env.example` as a template.
