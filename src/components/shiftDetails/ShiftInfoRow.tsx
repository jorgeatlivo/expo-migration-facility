import React from 'react';
import { View, StyleSheet } from 'react-native';
import LivoIcon from '@/assets/icons/LivoIcon';
import { typographyStyles } from '@/styles/livoFonts';
import StyledText from '@/components/StyledText';
import { SPACE_VALUES } from '@/styles/spacing';

interface ShiftInfoRowProps {
  icon: string;
  label?: string;
  subTitle?: string;
  overline?: string;
  style?: any;
  iconColor?: string;
  children?: React.ReactNode;
}

export const ShiftInfoRow: React.FC<ShiftInfoRowProps> = ({
  icon,
  label,
  subTitle,
  overline,
  style,
  iconColor,
  children,
}) => {
  return (
    <View style={[styles.container, style]}>
      <LivoIcon name={icon} size={24} color={iconColor || '#707A91'} />
      {children ? (
        children
      ) : (
        <>
          {label && <StyledText style={styles.labelText}>{label}</StyledText>}
          {subTitle && (
            <StyledText style={styles.subTitleText}>{subTitle}</StyledText>
          )}
          {overline && (
            <StyledText style={styles.overlineText}>{overline}</StyledText>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE_VALUES.tiny,
  },
  labelText: {
    ...typographyStyles.body.regular,
    color: '#2C3038',
    marginRight: SPACE_VALUES.small,
    marginLeft: SPACE_VALUES.small,
  },
  subTitleText: {
    ...typographyStyles.body.regular,
    color: '#2C3038',
    marginRight: SPACE_VALUES.small,
  },
  overlineText: {
    ...typographyStyles.body.regular,
    color: '#848DA9',
  },
});
