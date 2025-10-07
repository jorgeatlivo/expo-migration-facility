import React from 'react';
import { View } from 'react-native';

import StyledText from '@/components/StyledText';

import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface UnitComponentProps {
  unit: string;
}

export const UnitComponent: React.FC<UnitComponentProps> = ({ unit }) => (
  <View
    style={{
      padding: 16,
    }}
  >
    <StyledText /* Label/Medium */
      style={{
        ...typographyStyles.subtitle.regular,
        marginBottom: 14,
      }}
    >
      Unidad
    </StyledText>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACE_VALUES.small,
        alignItems: 'baseline',
      }}
    >
      <StyledText /* Parragraph/Small */
        style={{
          ...typographyStyles.body.regular,
        }}
      >
        {unit}
      </StyledText>
    </View>
  </View>
);
