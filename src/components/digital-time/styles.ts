import { StyleSheet } from 'react-native';

import { Colors } from '../../config/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  time: {
    color: Colors.textPrimary,
    fontSize: 44,
    fontWeight: '200',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  period: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginLeft: 6,
    letterSpacing: 1,
  },
  date: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  tzRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  tzName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  offsetBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  offsetText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
});
