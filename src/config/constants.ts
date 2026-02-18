export const TIMEZONE_API_KEY = 'REMOVED';

export const TIMEZONE_API_BASE = 'https://api.timezonedb.com/v2.1';

// SQLite database name for offline caching
export const DB_NAME = 'analogclock.db';

// AsyncStorage key for persisting the user's last selected timezone
export const STORAGE_KEY_LAST_TIMEZONE = '@analogclock/last_timezone';

// Clock refresh interval in milliseconds
export const CLOCK_TICK_INTERVAL_MS = 1000;

export const Colors = {
  background: '#0A0E1A',
  surface: '#111827',
  card: '#1A2236',
  primary: '#00E5FF',
  secondary: '#7C3AED',
  tertiary: '#F59E0B',
  danger: '#EF4444',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textOnPrimary: '#0A0E1A',
  border: '#1E293B',
  glow: 'rgba(0, 229, 255, 0.15)',
  glass: 'rgba(17, 24, 39, 0.85)',
  clockRimStart: '#1E293B',
  clockRimEnd: '#334155',
  hourMarker: '#CBD5E1',
  minuteMarker: '#475569',
  hourHand: '#E2E8F0',
  minuteHand: '#CBD5E1',
  secondHand: '#EF4444',
  centerPin: '#F1F5F9',
  inputBg: '#1E293B',
} as const;

export const Fonts = {
  regular: 'System',
  bold: 'System',
  mono: 'Courier',
} as const;
