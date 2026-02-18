import { StyleSheet } from 'react-native';

import { Colors } from '../../config/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bgGlow: {
    position: 'absolute',
    top: -150,
    left: '50%',
    marginLeft: -200,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(0, 229, 255, 0.03)',
  },

  // ── Portrait ──
  portraitContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  clockSection: {
    marginBottom: 8,
  },

  // ── Selector Button ──
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: Colors.border,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  selectorIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  selectorTextContainer: {
    flex: 1,
  },
  selectorLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  selectorValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  selectorArrow: {
    color: Colors.textSecondary,
    fontSize: 24,
    fontWeight: '300',
    marginLeft: 8,
  },

  // ── Status indicators ──
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  statusText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    maxWidth: 360,
    width: '100%',
    gap: 10,
  },
  offlineIcon: {
    fontSize: 18,
  },
  offlineText: {
    flex: 1,
    color: Colors.tertiary,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    maxWidth: 360,
    width: '100%',
    gap: 10,
  },
  errorText: {
    flex: 1,
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  retryText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  sourceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  sourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sourceText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
