import { StyleSheet } from 'react-native';

import { BADGE_GRAY, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

export const SectionStyles = StyleSheet.create({
  section: {
    backgroundColor: WHITE,
    borderRadius: SPACE_VALUES.small,
    paddingHorizontal: SPACE_VALUES.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACE_VALUES.small,
  },
  description: {
    marginBottom: SPACE_VALUES.medium,
  },
  card: {
    borderRadius: SPACE_VALUES.small,
    marginBottom: SPACE_VALUES.large,
  },
  cardHeader: {
    ...typographyStyles.subtitle.regular,
    marginBottom: SPACE_VALUES.small,
  },
  detailRow: {
    marginBottom: SPACE_VALUES.tiny,
  },
  detailText: {
    ...typographyStyles.body.regular,
    color: BADGE_GRAY,
    marginTop: SPACE_VALUES.tiny,
  },
  noOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACE_VALUES.medium,
  },
  addButton: {
    marginTop: SPACE_VALUES.medium,
  },
});
