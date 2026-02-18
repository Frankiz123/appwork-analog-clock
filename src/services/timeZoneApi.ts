import { TIMEZONE_API_BASE, TIMEZONE_API_KEY } from '../config/constants';
import type { TimezoneApiResponse, TimezoneRecord } from '../types/timezone';

export async function fetchTimezones(): Promise<TimezoneRecord[]> {
  try {
    const url = `${TIMEZONE_API_BASE}/list-time-zone?key=${TIMEZONE_API_KEY}&format=json&fields=countryCode,countryName,zoneName,gmtOffset,dst`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      console.warn('[fetchTimezones] HTTP error:', response.status);
      return [];
    }

    const data = (await response.json()) as TimezoneApiResponse;

    if (!data || data.status !== 'OK' || !Array.isArray((data as any).zones)) {
      console.warn('[fetchTimezones] API FAILED:', (data as any)?.message);
      return [];
    }

    return data.zones
      .filter(Boolean)
      .sort((a, b) => (a.zoneName ?? '').localeCompare(b.zoneName ?? ''));
  } catch (err) {
    console.warn('[fetchTimezones] crashed:', err);
    return [];
  }
}
