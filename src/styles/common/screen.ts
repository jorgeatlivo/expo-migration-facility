import { StyleSheet } from 'react-native';
import { SPACE_VALUES } from '@/styles/spacing';
import { BORDER_GRAY, WHITE } from '@/styles/colors';

export const ScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabBar: {
    marginTop: SPACE_VALUES.large,
    marginHorizontal: SPACE_VALUES.medium,
  },
  content: {
    flex: 1,
    padding: SPACE_VALUES.medium,
  },
  filters: {
    marginVertical: SPACE_VALUES.small,
  },
  bottomBox: {
    backgroundColor: WHITE,
    paddingHorizontal: SPACE_VALUES.large,
    paddingTop: SPACE_VALUES.medium,
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
  },
  actionButton: {
    margin: SPACE_VALUES.large,
  }
});
