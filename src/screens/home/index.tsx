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
    syncing,
    error,
    source,
    selectTimezone,
    refresh,
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

  // Offline: initial load done, no data, not syncing, no error => waiting for network
  const offlineUI = useMemo(() => {
    if (loading || timezones?.length > 0 || syncing || error) {
      return null;
    }
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineIcon}>📡</Text>
        <Text style={styles.offlineText}>
          You're offline. Timezones will load automatically when you reconnect.
        </Text>
      </View>
    );
  }, [loading, timezones?.length, syncing, error]);

  // Syncing: NetInfo detected connectivity, background fetch in progress
  const syncingUI = useMemo(() => {
    if (!syncing) {
      return null;
    }
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.statusText}>
          Connection restored, loading timezones...
        </Text>
      </View>
    );
  }, [syncing]);

  const errorUI = useMemo(() => {
    if (!error) {
      return null;
    }
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={refresh}
          activeOpacity={0.7}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }, [error, refresh]);

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
        {offlineUI}
        {syncingUI}
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
