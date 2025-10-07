import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '@/components/StyledText';
import { typographyStyles } from '@/styles/livoFonts';

interface NotificationsBadgeProps {
  notifications: number;
  style?: any;
}

export const NotificationsBadge: FC<NotificationsBadgeProps> = ({
  notifications,
  style,
}) => {
  return (
    <View style={[styles.badgeContainer, style]}>
      <StyledText style={styles.badgeText}>{notifications}</StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FA3D3B',
    borderRadius: 100,
    height: 20,
    width: 20,
  },
  badgeText: {
    color: 'white',
    textAlign: 'center',
    ...typographyStyles.subtitle.small,
  },
});
