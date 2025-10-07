import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import moment from 'moment';

import { ShiftTimeConfigDTO } from '@/services/shifts';

import { typographyStyles } from '@/styles/livoFonts';
import { SPACE_VALUES } from '@/styles/spacing';

import { ShiftDateTimePicker } from './ShiftDateTimePicker';
import { ShiftScheduleSelector } from './ShiftScheduleSelector';

interface EditShiftTimeDetailsProps {
  setShiftDate: (date: Date) => void;
  shiftDate: Date;
  setShiftStartTime: (startTime: Date) => void;
  shiftStartTime: Date;
  setShiftEndTime: (shiftEndTime: Date) => void;
  shiftEndTime: Date;
  shiftTimeConfig?: ShiftTimeConfigDTO;
  timeInDay?: string;
}

const EditShiftTimeDetails: React.FC<EditShiftTimeDetailsProps> = ({
  setShiftDate,
  shiftDate,
  setShiftStartTime,
  shiftStartTime,
  setShiftEndTime,
  shiftEndTime,
  shiftTimeConfig,
  timeInDay,
}) => {
  const { t } = useTranslation();
  const timeTags = [
    {
      id: 'dayShift',
      label: t('common_morning'),
    },
    {
      id: 'eveningShift',
      label: t('common_evening'),
    },
    {
      id: 'nightShift',
      label: t('common_night'),
    },
  ];

  const [selectedTimeInDay, setTimeInDay] = useState(
    timeInDay ?? timeTags[0].id
  );
  const handleSelectTimeTag = (selectedTag: string) => {
    const schedule =
      shiftTimeConfig &&
      shiftTimeConfig[selectedTag as keyof typeof shiftTimeConfig];
    const startTime = moment({
      hour: schedule?.startTime.hour,
      minute: schedule?.startTime.minute,
    });
    const endTime = moment({
      hour: schedule?.endTime.hour,
      minute: schedule?.endTime.minute,
    });
    setTimeInDay(selectedTag);
    setShiftStartTime(startTime.toDate());
    setShiftEndTime(endTime.toDate());
  };

  return (
    <View>
      <View style={styles.sectionContainer}>
        <ShiftDateTimePicker
          onSelectedDateHandler={setShiftDate}
          value={shiftDate}
          mode={'date'}
          placeholder={t('shift_list_date_label')}
          iconName="calendar"
        />
      </View>
      <View style={styles.sectionContainer}>
        {shiftTimeConfig && timeInDay && (
          <ShiftScheduleSelector
            schedules={timeTags}
            selectedSchedule={selectedTimeInDay}
            onChangeSchedule={handleSelectTimeTag}
          />
        )}
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.timeRowContainer}>
          <View style={styles.timeInputContainer}>
            <ShiftDateTimePicker
              onSelectedDateHandler={setShiftStartTime}
              value={shiftStartTime}
              mode={'time'}
              placeholder={t('shift_list_start_time_label')}
              iconName="clock"
            />
          </View>
          <View style={styles.timeInputContainerFlex}>
            <ShiftDateTimePicker
              onSelectedDateHandler={setShiftEndTime}
              value={shiftEndTime}
              mode={'time'}
              placeholder={t('shift_list_end_time_label')}
              iconName="clock"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(EditShiftTimeDetails);

export const styles = StyleSheet.create({
  customTextInput: {
    borderWidth: 1,
    paddingHorizontal: SPACE_VALUES.large,
    borderRadius: 8,
    borderColor: '#848DA9',
    backgroundColor: '#FFFF',
    paddingVertical: SPACE_VALUES.medium,
  },
  sectionContainer: {
    marginBottom: SPACE_VALUES.large,
  },
  label: {
    ...typographyStyles.subtitle.small,
    marginBottom: SPACE_VALUES.small,
  },
  selectTagsContainer: {
    marginBottom: SPACE_VALUES.large,
  },
  tagContainer: {
    flex: 1,
  },
  timeRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputContainer: {
    marginRight: SPACE_VALUES.small,
    flex: 1,
  },
  timeInputContainerFlex: {
    flex: 1,
  },
});
