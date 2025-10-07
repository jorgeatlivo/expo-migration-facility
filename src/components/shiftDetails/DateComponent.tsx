import React from "react";
import { View } from "react-native";
import { formattedSchedule, formattedShortMonth, formattedWeekDay } from "../../utils/utils";
import { IconCalendarMonth, IconClock } from "tabler-icons-react-native";
import { typographyStyles } from "../../styles/livoFonts";
import { SPACE_VALUES } from "../../styles/spacing";
import StyledText from "../StyledText";

interface DateComponentProps {
  startTime: string;
  finishTime: string;
  isAprox?: boolean;
}

export const DateComponent: React.FC<DateComponentProps> = ({ startTime, finishTime, isAprox }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexShrink: 1,
  }}>
    <IconCalendarMonth size={16} style={{ marginRight: 8 }} color="#757C8E" />
    <View
      style={{
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <StyledText
        style={{
          ...typographyStyles.body.regular,
          marginRight: SPACE_VALUES.small
        }}>
        {formattedShortMonth(startTime)}&nbsp;
      </StyledText>
      <StyledText /* Parragraph/Medium */
        style={{
          ...typographyStyles.body.regular,
        }}>
        {formattedSchedule(startTime, finishTime)}</StyledText>
    </View>
  </View>
)