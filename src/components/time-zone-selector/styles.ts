import { Platform, StyleSheet } from 'react-native';

import { Colors } from '../../config/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: Colors.textSecondary,
    fontSize: 20,
    fontWeight: '300',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    padding: 0,
  },
  localTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  localTimeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  localTimeIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  localTimeText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  localTimeTextActive: {
    color: Colors.primary,
  },
  checkmark: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  itemSelected: {
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  itemLeft: {
    flex: 1,
    marginRight: 12,
  },
  itemCity: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemCitySelected: {
    color: Colors.primary,
  },
  itemCountry: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemOffset: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  itemOffsetSelected: {
    color: Colors.primary,
  },
  dstBadge: {
    color: Colors.tertiary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  mainEmptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyContentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  titleEmptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.danger,
  },
  messageEmptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    color: Colors.tertiary,
  },
});
