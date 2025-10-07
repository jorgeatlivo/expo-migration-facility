import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BLUE_FADED } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { Divider } from '@/components/common/Divider';
import StyledText from '@/components/StyledText';
import OpenFavoriteProfessionals from './OpenFavoriteProfessionals';

type NoClaimsPlaceholderProps = {
  navigation: NavigationProp<any>;
  style?: StyleProp<ViewStyle>;
};

export default function NoClaimsPlaceholder({
  navigation,
  style,
}: NoClaimsPlaceholderProps) {
  const { t } = useTranslation();

  return (
    <View style={style}>
      <View style={styles.titleContainer}>
        <StyledText style={styles.title}>
          {t('shift_detail_pending_claims_label')}
        </StyledText>
      </View>

      <StyledText style={styles.description}>
        {t('shift_detail_no_pending_claims')}
      </StyledText>

      <View style={styles.divider}>
        <Divider />
      </View>

      <OpenFavoriteProfessionals
        navigation={navigation}
        style={styles.openFavoriteProfessionals}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE_VALUES.small,
  },
  title: {
    ...typographyStyles.heading.small,
  },
  description: {
    ...typographyStyles.body.regular,
    color: BLUE_FADED,
  },
  divider: {
    marginVertical: SPACE_VALUES.small,
  },
  openFavoriteProfessionals: {
    marginVertical: SPACE_VALUES.small,
  },
});
