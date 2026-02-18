import { open, type DB } from '@op-engineering/op-sqlite';

import type { TimezoneRecord } from '../types/timezone';
import { DB_NAME } from '../config/constants';

let db: DB | null = null;

// Creates the database and ensures the schema exists.

export async function initDatabase(): Promise<DB> {
  if (db) {
    return db;
  }

  db = open({ name: DB_NAME });

  // Create timezone cache table
  db.executeSync(`
    CREATE TABLE IF NOT EXISTS timezones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      countryCode TEXT NOT NULL,
      countryName TEXT NOT NULL,
      zoneName TEXT NOT NULL UNIQUE,
      gmtOffset INTEGER NOT NULL,
      dst INTEGER DEFAULT 0
    );
  `);

  // Create user preferences table
  db.executeSync(`
    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  return db;
}

//Retrieves all cached timezone records from the local database.
// Returns Array of TimezoneRecord, empty if no cached data.

export async function getCachedTimezones(): Promise<TimezoneRecord[]> {
  const database = await initDatabase();

  const result = database.executeSync(
    'SELECT countryCode, countryName, zoneName, gmtOffset, dst FROM timezones ORDER BY zoneName ASC',
  );

  return result.rows.map(row => ({
    countryCode: row.countryCode as string,
    countryName: row.countryName as string,
    zoneName: row.zoneName as string,
    gmtOffset: row.gmtOffset as number,
    dst: (row.dst as number) ?? 0,
  }));
}

// Caches the provided timezone list into the local database.
// Clears existing data first to ensure a fresh copy.
// Zones Array of timezone records from the API.

export async function cacheTimezones(zones: TimezoneRecord[]): Promise<void> {
  const database = await initDatabase();

  await database.transaction(async tx => {
    await tx.execute('DELETE FROM timezones');

    for (const zone of zones) {
      await tx.execute(
        'INSERT OR REPLACE INTO timezones (countryCode, countryName, zoneName, gmtOffset, dst) VALUES (?, ?, ?, ?, ?)',
        [
          zone.countryCode,
          zone.countryName,
          zone.zoneName,
          zone.gmtOffset,
          zone.dst ? 1 : 0,
        ],
      );
    }
  });
}

// Retrieves the last selected timezone zone name from preferences.
// Returns The zone name string, or null if not set.

export async function getLastSelectedTimezone(): Promise<string | null> {
  const database = await initDatabase();

  const result = database.executeSync(
    "SELECT value FROM preferences WHERE key = 'last_timezone'",
  );

  if (result.rows.length > 0) {
    return result.rows[0].value as string;
  }

  return null;
}

// Persists the user's selected timezone to the local database.
// Param zoneName - IANA timezone name to persist.

export async function setLastSelectedTimezone(zoneName: string): Promise<void> {
  const database = await initDatabase();

  database.executeSync(
    "INSERT OR REPLACE INTO preferences (key, value) VALUES ('last_timezone', ?)",
    [zoneName],
  );
}
