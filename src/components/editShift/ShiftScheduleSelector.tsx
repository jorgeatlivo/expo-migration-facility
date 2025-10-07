import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { shiftTimeInDayLabels } from '@/components/claimReviews/Separators';
import LivoIcon from '@/assets/icons/LivoIcon';
import StyledText from '@/components/StyledText';
import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';
import { ACTION_BLUE, BORDER_GRAY, WHITE } from '@/styles/colors';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/atoms/Typography';

interface ShiftScheduleSelectorProps {
  schedules: {
    id: string;
    label: string;
  }[];
  selectedSchedule: string;
  onChangeSchedule: (schedule: string) => any;
}

const scheduleDisplayMap: Record<
  string,
  typeof shiftTimeInDayLabels.DAY_SHIFT
> = {
  dayShift: shiftTimeInDayLabels.DAY_SHIFT,
  eveningShift: shiftTimeInDayLabels.EVENING_SHIFT,
  nightShift: shiftTimeInDayLabels.NIGHT_SHIFT,
};

export function ShiftScheduleSelector(props: ShiftScheduleSelectorProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Typography variant={'info/overline'} style={styles.floatingLabel}>
        {t('shift_list_schedule_label')}
      </Typography>
      {props.schedules.map((schedule, index) => {
        const isSelected = schedule.id === props.selectedSchedule;
        const scheduleDisplay = scheduleDisplayMap[schedule.id];
        return (
          <TouchableOpacity
            key={schedule.id}
            style={[
              styles.optionContainer,
              {
                marginBottom: index < props.schedules.length - 1 ? 12 : 0,
              },
            ]}
            onPress={() => props.onChangeSchedule(schedule.id)}
          >
            <View style={styles.labelContainer}>
              <LivoIcon
                name={scheduleDisplay.iconName}
                size={24}
                color={scheduleDisplay.color}
              />
              <StyledText style={styles.label}>{schedule.label}</StyledText>
            </View>
            {isSelected ? (
              <LivoIcon name="radiobox-filled" color={ACTION_BLUE} size={24} />
            ) : (
              <LivoIcon
                name="radiobox-unchecked"
                color={BORDER_GRAY}
                size={24}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: BORDER_GRAY,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: { flexDirection: 'row', alignItems: 'center' },
  label: {
    ...typographyStyles.body.regular,
    marginLeft: SPACE_VALUES.tiny,
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: SPACE_VALUES.small,
    paddingHorizontal: SPACE_VALUES.small,
    backgroundColor: WHITE,
  },
});
