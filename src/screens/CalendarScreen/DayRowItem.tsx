import { StyleSheet, TouchableOpacity, View } from 'react-native';

import StyledText from '@/components/StyledText';

import { BLACK, DARK_BLUE, GRAY, PURPLE, WHITE } from '@/styles/colors';
import { fontWeight, LayoutTextEnum } from '@/styles/fonts';
import { SPACE_VALUES } from '@/styles/spacing';

interface DayRowItemProps {
  weekDay: string;
  day: string;
  isSelected: boolean;
  hasShifts: boolean;
  onPress: () => void;
  hasAlert: boolean;
  isToday: boolean;
  isHoliday?: boolean;
}

export const DayRowItem: React.FC<DayRowItemProps> = ({
  weekDay,
  day,
  isSelected,
  hasShifts,
  onPress,
  hasAlert,
  isToday,
  isHoliday,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.dayButton}>
      <StyledText type={LayoutTextEnum.body} style={styles.weekdayTitle}>
        {weekDay}
      </StyledText>
      <View>
        {hasAlert && <View style={styles.alert} />}
        <View
          style={[
            styles.dayCircle,
            {
              backgroundColor: isSelected
                ? isHoliday
                  ? PURPLE
                  : DARK_BLUE
                : hasShifts
                  ? WHITE
                  : 'transparent',
            },
            (isToday || isHoliday) && styles.dayCircleBorder,
            (isToday || isHoliday) && {
              borderColor: isToday ? DARK_BLUE : PURPLE,
            },
          ]}
        >
          <StyledText
            type={LayoutTextEnum.body}
            style={{
              color: isSelected ? WHITE : hasShifts ? DARK_BLUE : BLACK,
              fontFamily: hasShifts ? fontWeight.bold : fontWeight.regular,
            }}
          >
            {day}
          </StyledText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  alert: {
    position: 'absolute',
    top: 1,
    right: 1,
    backgroundColor: 'red',
    borderRadius: 5,
    width: 7,
    height: 7,
    zIndex: 2,
  },
  weekdayTitle: {
    fontSize: 13,
    color: GRAY,
    marginBottom: SPACE_VALUES.small,
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dayCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: 27,
    height: 27,
  },
  dayCircleBorder: {
    borderWidth: 1,
  },
});
