import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';

import type { TimezoneRecord } from '../types/timezone';
import { TIMEZONE_API_KEY } from '../config/constants';
import { fetchTimezones } from '../services/timeZoneApi';
import {
  initDatabase,
  getCachedTimezones,
  cacheTimezones,
  getLastSelectedTimezone,
  setLastSelectedTimezone,
} from '../services/database';

interface UseTimezonesReturn {
  timezones: TimezoneRecord[];
  selectedTimezone: TimezoneRecord | null;
  loading: boolean;
  error: string | null;
  source: 'cache' | 'api' | null;
  selectTimezone: (tz: TimezoneRecord | null) => void;
  refresh: () => Promise<void>;
}

export function useTimezones(): UseTimezonesReturn {
  const [timezones, setTimezones] = useState<TimezoneRecord[]>([]);
  const [selectedTimezone, setSelectedTimezone] =
    useState<TimezoneRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'cache' | 'api' | null>(null);

  //  Fetches timezones from the API and caches them locally.
  const fetchAndCache = useCallback(async (): Promise<TimezoneRecord[]> => {
    const zones = await fetchTimezones();

    try {
      await cacheTimezones(zones);
    } catch (cacheErr) {
      console.warn('Failed to cache timezones:', cacheErr);
    }
    return zones;
  }, []);

  // Main loading offline-first.
  const loadTimezones = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await initDatabase();

      // Step 1: Try loading from cache
      let zones: TimezoneRecord[] = [];
      let dataSource: 'cache' | 'api' = 'cache';

      try {
        zones = await getCachedTimezones();
      } catch (dbErr) {
        console.warn('DB read failed, will fetch from API:', dbErr);
      }

      // Step 2: If cache is empty, try API (only if key is configured)
      if (zones.length === 0) {
        const apiKey = TIMEZONE_API_KEY as string;
        const hasApiKey =
          apiKey && apiKey !== 'YOUR_API_KEY' && apiKey.length > 5;

        if (hasApiKey) {
          try {
            zones = await fetchAndCache();
            dataSource = 'api';
          } catch (apiErr) {
            console.warn('API fetch failed:', apiErr);
            // Don't show error — just work with local time
          }
        }
      }

      setTimezones(zones);
      setSource(dataSource);

      // Step 3: Restore last selected timezone
      try {
        const lastZoneName = await getLastSelectedTimezone();
        if (lastZoneName) {
          const found = zones.find(z => z.zoneName === lastZoneName);
          if (found) {
            setSelectedTimezone(found);
          }
        }
      } catch (prefErr) {
        console.warn('Failed to restore last timezone:', prefErr);
      }
    } catch (err) {
      // Only show error for unexpected failures (DB init, etc.)
      const message =
        err instanceof Error ? err.message : 'Failed to load timezones';
      setError(message);
      console.error('Timezone loading failed:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAndCache]);

  // Load on mount
  useEffect(() => {
    loadTimezones();
  }, [loadTimezones]);

  // Background Listening using NetInfo Package if users device not have internet checking internet status
  useEffect(() => {
    if (loading || timezones.length > 0) {
      return;
    }

    const unsubscribe = NetInfo.addEventListener(async state => {
      if (!state.isConnected) {
        return;
      }

      // Double-check cache hasn't been filled in the meantime
      try {
        const cached = await getCachedTimezones();
        if (cached.length > 0) {
          setTimezones(cached);
          setSource('cache');
          unsubscribe();
          try {
            const lastZoneName = await getLastSelectedTimezone();
            if (lastZoneName) {
              const found = cached.find(z => z.zoneName === lastZoneName);
              if (found) {
                setSelectedTimezone(found);
              }
            }
          } catch {}
          return;
        }
      } catch {}

      // Cache still empty — fetch from API
      try {
        const zones = await fetchAndCache();
        if (zones.length > 0) {
          setTimezones(zones);
          setSource('api');
          unsubscribe();
          try {
            const lastZoneName = await getLastSelectedTimezone();
            if (lastZoneName) {
              const found = zones.find(z => z.zoneName === lastZoneName);
              if (found) {
                setSelectedTimezone(found);
              }
            }
          } catch {}
        }
      } catch {}
    });

    return () => unsubscribe();
  }, [loading, timezones.length, fetchAndCache]);

  // Selects a timezone and persists the selection.
  const selectTimezone = useCallback((tz: TimezoneRecord | null) => {
    setSelectedTimezone(tz);
    if (tz) {
      setLastSelectedTimezone(tz.zoneName).catch(err =>
        console.warn('Failed to persist timezone selection:', err),
      );
    }
  }, []);

  // Refresh Api Call.
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const zones = await fetchAndCache();
      setTimezones(zones);
      setSource('api');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to refresh timezones';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchAndCache]);

  return {
    timezones,
    selectedTimezone,
    loading,
    error,
    source,
    selectTimezone,
    refresh,
  };
}
