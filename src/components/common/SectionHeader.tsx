import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LivoIcon from '@/assets/icons/LivoIcon';
import StyledText from '@/components/StyledText';
import { DIVIDER_GRAY } from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';
import { typographyStyles } from '@/styles/livoFonts';

interface SectionHeaderProps {
  icon: string;
  title: string;
  style?: StyleProp<ViewStyle>;
}

export default function SectionHeader({
  icon,
  title,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <LivoIcon name={icon} size={24} color={DIVIDER_GRAY} />

      <StyledText style={styles.title}>{title}</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  title: {
    ...typographyStyles.body.regular,
    marginLeft: SPACE_VALUES.small,
  },
});
