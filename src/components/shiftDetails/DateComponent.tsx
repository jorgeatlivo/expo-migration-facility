import React from 'react';

import { IconCalendarMonth } from 'tabler-icons-react-native';

import Row from '@/components/atoms/Row';
import StyledText from '@/components/StyledText';

import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { formattedSchedule, formattedShortMonth } from '@/utils/utils';

interface DateComponentProps {
  startTime: string;
  finishTime: string;
}

export const DateComponent: React.FC<DateComponentProps> = ({
  startTime,
  finishTime,
}) => (
  <Row alignItems={'center'} flexShrink={1} style={{ marginBottom: 8 }}>
    <IconCalendarMonth size={16} style={{ marginRight: 8 }} color="#757C8E" />
    <Row alignItems={'center'} flexShrink={1}>
      <StyledText
        style={{
          ...typographyStyles.body.regular,
          marginRight: SPACE_VALUES.small,
        }}
      >
        {formattedShortMonth(startTime)}&nbsp;
      </StyledText>
      <StyledText /* Parragraph/Medium */
        style={{
          ...typographyStyles.body.regular,
        }}
      >
        {formattedSchedule(startTime, finishTime)}
      </StyledText>
    </Row>
  </Row>
);
