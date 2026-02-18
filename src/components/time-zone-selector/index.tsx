import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../config/constants';
import type { TimezoneRecord } from '../../types/timezone';

import { styles } from './styles';

interface TimezoneSelectorProps {
  visible: boolean;
  timezones: TimezoneRecord[];
  selected: TimezoneRecord | null;
  onSelect: (tz: TimezoneRecord | null) => void;
  onClose: () => void;
}

//Formats a GMT offset in seconds to a human-readable string.
// e.g., 19800 → "GMT+05:30", -18000 → "GMT-05:00"

function formatGmtOffset(offsetSeconds: number): string {
  const sign = offsetSeconds >= 0 ? '+' : '-';
  const abs = Math.abs(offsetSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  return `GMT${sign}${String(h).padStart(2, '0')}:${String(m).padStart(
    2,
    '0',
  )}`;
}

// Getting a city name from a zone name.
// America/New_York => New York

function formatCityName(zoneName: string): string {
  const parts = zoneName.split('/');
  const city = parts[parts.length - 1];
  return city.replace(/_/g, ' ');
}

// Getting the region name from a zone name.
// America/New_York => America

function getRegion(zoneName: string): string {
  return zoneName.split('/')[0];
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  visible,
  timezones,
  selected,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and group timezones based on search query.

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = query
      ? timezones.filter(
          tz =>
            tz.zoneName.toLowerCase().includes(query) ||
            tz.countryName.toLowerCase().includes(query) ||
            tz.countryCode.toLowerCase().includes(query) ||
            formatCityName(tz.zoneName).toLowerCase().includes(query),
        )
      : timezones;

    // Group by region
    const grouped: { title: string; data: TimezoneRecord[] }[] = [];
    const regionMap = new Map<string, TimezoneRecord[]>();

    for (const tz of filtered) {
      const region = getRegion(tz.zoneName);
      if (!regionMap.has(region)) {
        regionMap.set(region, []);
      }
      regionMap.get(region)!.push(tz);
    }

    // Sort regions alphabetically
    const sortedRegions = Array.from(regionMap.keys()).sort();
    for (const region of sortedRegions) {
      grouped.push({ title: region, data: regionMap.get(region)! });
    }

    // Flatten into a list with section headers for FlatList
    const flatList: Array<
      | { type: 'header'; title: string; key: string }
      | { type: 'item'; tz: TimezoneRecord; key: string }
    > = [];

    for (const group of grouped) {
      flatList.push({
        type: 'header',
        title: group.title,
        key: `header-${group.title}`,
      });
      for (const tz of group.data) {
        flatList.push({
          type: 'item',
          tz,
          key: tz.zoneName,
        });
      }
    }

    return flatList;
  }, [timezones, searchQuery]);

  const handleSelect = useCallback(
    (tz: TimezoneRecord | null) => {
      onSelect(tz);
      onClose();
      setSearchQuery('');
    },
    [onSelect, onClose],
  );

  const handleClose = useCallback(() => {
    onClose();
    setSearchQuery('');
  }, [onClose]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof filteredData)[number] }) => {
      if (item.type === 'header') {
        return (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{item.title}</Text>
          </View>
        );
      }

      const { tz } = item;
      console.log('tz', tz);
      const isSelected = selected?.zoneName === tz.zoneName;
      const city = formatCityName(tz.zoneName);
      const offset = formatGmtOffset(tz.gmtOffset);

      return (
        <TouchableOpacity
          style={[styles.item, isSelected && styles.itemSelected]}
          onPress={() => handleSelect(tz)}
          activeOpacity={0.7}
        >
          <View style={styles.itemLeft}>
            <Text
              style={[styles.itemCity, isSelected && styles.itemCitySelected]}
              numberOfLines={1}
            >
              {city}
            </Text>
            <Text style={styles.itemCountry} numberOfLines={1}>
              {tz.countryName}
            </Text>
          </View>
          <View style={styles.itemRight}>
            <Text
              style={[
                styles.itemOffset,
                isSelected && styles.itemOffsetSelected,
              ]}
            >
              {offset}
            </Text>
            {tz.dst === 1 && <Text style={styles.dstBadge}>DST</Text>}
          </View>
        </TouchableOpacity>
      );
    },
    [selected, handleSelect],
  );

  const emptyStateMessage = useCallback(() => {
    return (
      <View style={styles.mainEmptyContainer}>
        <Text style={styles.titleEmptyText}>No results found</Text>
        <Text style={styles.messageEmptyText}>
          Your connection appears to be offline. Cached data will be shown when
          available, and updates will load automatically once you’re back
          online.
        </Text>
      </View>
    );
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Select Timezone</Text>
          <View style={styles.closeButton} />
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city, country, or zone..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Local time button */}
        <TouchableOpacity
          style={[
            styles.localTimeButton,
            !selected && styles.localTimeButtonActive,
          ]}
          onPress={() => handleSelect(null)}
          activeOpacity={0.7}
        >
          <Text style={styles.localTimeIcon}>📍</Text>
          <Text
            style={[
              styles.localTimeText,
              !selected && styles.localTimeTextActive,
            ]}
          >
            Local Device Time
          </Text>
          {!selected && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        {/* Timezone list */}
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            filteredData?.length === 0 && styles.emptyContentContainerStyle,
          ]}
          ListEmptyComponent={emptyStateMessage}
          showsVerticalScrollIndicator={false}
          initialNumToRender={30}
          maxToRenderPerBatch={20}
          windowSize={10}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </SafeAreaView>
    </Modal>
  );
};

export default React.memo(TimezoneSelector);
