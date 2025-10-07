import React from 'react';
import {commonStyles} from '@/styles/commonStyles';
import {View} from 'react-native';
import StyledText from '../StyledText';
import {typographyStyles} from '@/styles/livoFonts';
import {BADGE_GRAY} from '@/styles/colors';

interface CVSummaryCardProps {
  cvSummary: string;
}

export function CVSummaryCard({cvSummary}: CVSummaryCardProps) {
  return (
    <View style={commonStyles.cardContainer}>
      <StyledText style={{...typographyStyles.body.regular, color: BADGE_GRAY}}>
        {cvSummary}
      </StyledText>
    </View>
  );
}
