import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import StyledText from '@/components/StyledText';

import { BLUE_FADED, CORAL } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import LivoIcon from '@/assets/icons/LivoIcon';

interface FavoriteTagProps {
  size?: 'regular' | 'small';
  outline?: boolean;
  style?: any;
}

export default function FavoriteTag({
  outline,
  style,
  size = 'regular',
}: FavoriteTagProps) {
  const { t } = useTranslation();
  return (
    <View style={[styles.container, outline && styles.border, style]}>
      <LivoIcon name="heart-filled" size={16} color={CORAL} />
      <StyledText style={[typographyStyles.subtitle[size], styles.text]}>
        {t('favorite_label')}
      </StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  border: {
    borderRadius: SPACE_VALUES.tiny,
    padding: SPACE_VALUES.tiny,
    borderWidth: 1,
    borderColor: BLUE_FADED,
  },
  text: {
    marginLeft: SPACE_VALUES.tiny,
  },
});
