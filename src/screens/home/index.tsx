import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import AnalogClock from '../../components/analog-clock';
import DigitalTime from '../../components/digital-time';
import TimezoneSelector from '../../components/time-zone-selector';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import { useTimezones } from '../../hooks/useTimezones';
import { Colors } from '../../config/constants';
import HeaderImage from '../../components/header-image';

import { styles } from './styles';

const HomeScreen: React.FC = () => {
  // Timezone management
  const {
    timezones,
    selectedTimezone,
    loading,
    error,
    source,
    selectTimezone,
  } = useTimezones();

  // Current time adjusted to the selected timezone's offset
  const gmtOffset = selectedTimezone?.gmtOffset ?? null;
  const { hours, minutes, seconds } = useCurrentTime(gmtOffset);

  // Modal visibility
  const [selectorVisible, setSelectorVisible] = useState(false);

  const openSelector = useCallback(() => setSelectorVisible(true), []);
  const closeSelector = useCallback(() => setSelectorVisible(false), []);

  // Formats the city name from a zone name for the selector button.
  const displayName = selectedTimezone
    ? selectedTimezone.zoneName.split('/').pop()?.replace(/_/g, ' ') ??
      'Unknown'
    : 'Local Time';

  const loadingUI = useMemo(() => {
    if (!loading) return null;
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.statusText}>Loading timezones...</Text>
      </View>
    );
  }, [loading]);

  const errorUI = useMemo(() => {
    if (!error) return null;
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠ {error}</Text>
      </View>
    );
  }, [error]);

  const sourceUI = useMemo(() => {
    if (loading || !source) return null;

    const dotColor = source === 'cache' ? Colors.tertiary : Colors.primary;
    const label = source === 'cache' ? 'Cached data' : 'Live data';

    return (
      <View style={styles.sourceIndicator}>
        <View style={[styles.sourceDot, { backgroundColor: dotColor }]} />
        <Text style={styles.sourceText}>
          {label} • {timezones?.length ?? 0} zones
        </Text>
      </View>
    );
  }, [loading, source, timezones?.length]);

  return (
    <View style={styles.container}>
      <HeaderImage />

      <View style={styles.portraitContainer}>
        {/* Clock */}
        <View style={styles.clockSection}>
          <AnalogClock hours={hours} minutes={minutes} seconds={seconds} />
        </View>

        {/* Digital time display */}
        <DigitalTime
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          timezoneName={selectedTimezone?.zoneName ?? null}
          gmtOffset={gmtOffset}
        />

        {/* Timezone selector button */}
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={openSelector}
          activeOpacity={0.7}
        >
          <Text style={styles.selectorIcon}>🌍</Text>
          <View style={styles.selectorTextContainer}>
            <Text style={styles.selectorLabel}>TIMEZONE</Text>
            <Text style={styles.selectorValue} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
          <Text style={styles.selectorArrow}>›</Text>
        </TouchableOpacity>
        {loadingUI}
        {errorUI}
        {sourceUI}
      </View>

      {/* Timezone selector modal */}
      <TimezoneSelector
        visible={selectorVisible}
        timezones={timezones}
        selected={selectedTimezone}
        onSelect={selectTimezone}
        onClose={closeSelector}
      />
    </View>
  );
};

export default HomeScreen;
