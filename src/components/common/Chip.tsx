import React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Typography } from '@/components/atoms/Typography';

import { WHITE } from '@/styles/colors';
import { SPACE_VALUES } from '@/styles/spacing';

interface Props {
  label: string;
  backgroundColor: string;
}

export const Chip = ({ label, backgroundColor }: Props) => (
  <Animated.View style={[styles.chip, { backgroundColor }]}>
    <Typography variant={'info/caption'} color={WHITE}>
      {label}
    </Typography>
  </Animated.View>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: SPACE_VALUES.small,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
