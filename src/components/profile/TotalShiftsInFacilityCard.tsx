import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import StyledText from '@/components/StyledText';

import { BADGE_GRAY } from '@/styles/colors';
import { commonStyles } from '@/styles/commonStyles';
import { typographyStyles } from '@/styles/livoFonts';

interface TotalShiftsInFacilityCardProps {
  totalShiftsInFacility: number;
  facilityName: string;
  style?: any;
}

export function TotalShiftsInFacilityCard({
  totalShiftsInFacility,
  facilityName,
  style,
}: TotalShiftsInFacilityCardProps) {
  const { t } = useTranslation();

  return (
    <View
      style={[
        commonStyles.cardContainer,
        commonStyles.spaceBetweenContainer,
        style,
      ]}
    >
      <View>
        <StyledText style={typographyStyles.subtitle.regular}>
          {t('shift_list_total_performed_shifts')}
        </StyledText>
        <StyledText
          style={{ ...typographyStyles.body.regular, color: BADGE_GRAY }}
        >
          {t('shift_list_in')} {facilityName}
        </StyledText>
      </View>
      <StyledText style={typographyStyles.heading.small}>
        {totalShiftsInFacility}
      </StyledText>
    </View>
  );
}
