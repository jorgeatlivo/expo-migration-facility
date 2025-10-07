import React from 'react';
import { View } from 'react-native';

import StyledText from '@/components/StyledText';

import { BADGE_GRAY } from '@/styles/colors';
import { commonStyles } from '@/styles/commonStyles';
import { typographyStyles } from '@/styles/livoFonts';

interface CVSummaryCardProps {
  cvSummary: string;
}

export function CVSummaryCard({ cvSummary }: CVSummaryCardProps) {
  return (
    <View style={commonStyles.cardContainer}>
      <StyledText
        style={{ ...typographyStyles.body.regular, color: BADGE_GRAY }}
      >
        {cvSummary}
      </StyledText>
    </View>
  );
}
