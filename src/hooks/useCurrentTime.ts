import { useState, useEffect, useRef, useCallback } from 'react';

import { CLOCK_TICK_INTERVAL_MS } from '../config/constants';

function getAdjustedTime(gmtOffsetSeconds: number | null): Date {
  const now = new Date();

  if (gmtOffsetSeconds === null) {
    return now;
  }

  // now.getTime() is already UTC epoch ms — just add the target offset
  return new Date(now.getTime() + gmtOffsetSeconds * 1000);
}

export function useCurrentTime(gmtOffsetSeconds: number | null = null) {
  const [time, setTime] = useState<Date>(() =>
    getAdjustedTime(gmtOffsetSeconds),
  );

  // Store offset in a ref so the interval callback always sees the latest value
  const offsetRef = useRef(gmtOffsetSeconds);
  offsetRef.current = gmtOffsetSeconds;

  const tick = useCallback(() => {
    setTime(getAdjustedTime(offsetRef.current));
  }, []);

  useEffect(() => {
    // Immediately sync on offset change
    tick();

    const interval = setInterval(tick, CLOCK_TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [tick, gmtOffsetSeconds]);

  // Return the adjusted time and convenience accessors.
  // When a gmtOffset is set, use UTC accessors on the shifted Date;
  // otherwise use local accessors.
  const hours =
    gmtOffsetSeconds !== null ? time.getUTCHours() : time.getHours();
  const minutes =
    gmtOffsetSeconds !== null ? time.getUTCMinutes() : time.getMinutes();
  const seconds =
    gmtOffsetSeconds !== null ? time.getUTCSeconds() : time.getSeconds();
  const milliseconds =
    gmtOffsetSeconds !== null
      ? time.getUTCMilliseconds()
      : time.getMilliseconds();

  return { time, hours, minutes, seconds, milliseconds };
}
