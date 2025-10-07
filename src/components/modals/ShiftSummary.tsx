import {View} from 'react-native';
import React from 'react';
import {typographyStyles} from '@/styles/livoFonts';
import {DateComponent} from '@/components/shiftDetails/DateComponent';
import {Shift} from '@/types';
import StyledText from '@/components/StyledText';

interface ShiftSummaryProps {
  shift: Shift;
  isAprox?: boolean;
}

export const ShiftSummary: React.FC<ShiftSummaryProps> = ({shift}) => {
  return (
    <View style={{}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 4,
        }}>
        <View
          style={{
            flexShrink: 1,
          }}>
          <StyledText
            style={{
              ...typographyStyles.heading.medium,
            }}>
            {shift.specialization?.displayText ??
              shift.specialization.translations.es}
          </StyledText>
          {shift.unit ? (
            <StyledText
              style={{
                ...typographyStyles.heading.small,
                color: '#8C95A7',
              }}>
              {shift.unit}
            </StyledText>
          ) : null}
        </View>
      </View>
      <DateComponent
        startTime={shift.startTime}
        finishTime={shift.finishTime}
      />
    </View>
  );
};
