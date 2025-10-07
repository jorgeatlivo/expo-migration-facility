import { Platform, StyleSheet } from 'react-native';

import { BLACK, WHITE } from './colors';
import { SPACE_VALUES } from './spacing';

export const commonStyles = StyleSheet.create({
  headerStyle: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: WHITE,
    padding: SPACE_VALUES.medium,
    marginBottom: 8,
    elevation: 2,
    borderRadius: 14,
    marginHorizontal: 10,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetweenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContainer: {
    padding: SPACE_VALUES.large,
    borderRadius: SPACE_VALUES.small,
    backgroundColor: WHITE,
  },
});

export const shadowStyle = {
  ...Platform.select({
    ios: {
      shadowColor: BLACK,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    android: {
      elevation: 4,
    },
  }),
};
