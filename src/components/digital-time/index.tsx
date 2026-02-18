import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

import { styles } from './styles';

interface DigitalTimeProps {
  hours: number;
  minutes: number;
  seconds: number;
  timezoneName: string | null;
  gmtOffset: number | null;
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Formats hours:minutes:seconds into a 12-hour time string with AM/PM.

function formatTime(
  h: number,
  m: number,
  s: number,
): { time: string; period: string } {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  const time = `${String(hour12).padStart(2, '0')}:${String(m).padStart(
    2,
    '0',
  )}:${String(s).padStart(2, '0')}`;
  return { time, period };
}

function formatGmtOffset(offsetSeconds: number): string {
  const sign = offsetSeconds >= 0 ? '+' : '-';
  const abs = Math.abs(offsetSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  return `UTC${sign}${String(h).padStart(2, '0')}:${String(m).padStart(
    2,
    '0',
  )}`;
}

function formatCityName(zoneName: string): string {
  const parts = zoneName.split('/');
  const city = parts[parts.length - 1];
  return city.replace(/_/g, ' ');
}

const DigitalTime: React.FC<DigitalTimeProps> = ({
  hours,
  minutes,
  seconds,
  timezoneName,
  gmtOffset,
}) => {
  const { time, period } = formatTime(hours, minutes, seconds);
  const now = new Date();

  const dateStr = `${DAYS[now.getDay()]}, ${
    MONTHS[now.getMonth()]
  } ${now.getDate()}`;

  const showFormatGmtOffset = useMemo(() => {
    if (gmtOffset !== null) {
      return (
        <View style={styles.offsetBadge}>
          <Text style={styles.offsetText}>{formatGmtOffset(gmtOffset)}</Text>
        </View>
      );
    }
    return <></>;
  }, [gmtOffset]);

  const showTimeZoneName = useMemo(() => {
    if (timezoneName) {
      return formatCityName(timezoneName);
    }
    return 'Local Time';
  }, [timezoneName]);

  return (
    <View style={styles.container}>
      {/* Digital time display */}
      <View style={styles.timeRow}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.period}>{period}</Text>
      </View>

      {/* Date */}
      <Text style={styles.date}>{dateStr}</Text>

      {/* Timezone info */}
      <View style={styles.tzRow}>
        <Text style={styles.tzName}>{showTimeZoneName}</Text>
        {showFormatGmtOffset}
      </View>
    </View>
  );
};

export default React.memo(DigitalTime);
