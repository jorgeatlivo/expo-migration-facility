import { useMemo, useState } from 'react';
import { Platform, View } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { DropDownInput } from '@/components/common/DropDownInput';
import { useDatePickerModal } from '@/components/modals/DatePickerModal';

import { useCurrentLocale } from '@/hooks/useCurrentLocale';

interface ShiftDateTimePickerProps {
  placeholder: string;
  onSelectedDateHandler: (date: Date) => void;
  value: Date;
  mode: 'date' | 'time';
  iconName?: string;
}

export const ShiftDateTimePicker = ({
  placeholder,
  onSelectedDateHandler,
  value,
  mode,
  iconName,
}: ShiftDateTimePickerProps) => {
  const lang = useCurrentLocale();
  const [show, setShow] = useState(false);
  const { showModal } = useDatePickerModal('date-picker-modal');

  const todayMemo = useMemo(() => {
    return new Date();
  }, []);

  const onPressInput = () =>
    Platform.OS === 'ios'
      ? showModal({
          mode: mode,
          value: value,
          onSelectedTimeHandler: onSelectedDateHandler,
          minimumDate: todayMemo,
        })
      : setShow(true);

  const dateFormat = mode === 'time' ? 'HH:mm' : 'DD MMM YYYY';
  const formattedDateTime = moment(value).format(dateFormat);

  return (
    <View>
      <DropDownInput
        placeholderAsLabel
        placeholder={placeholder}
        selectedLabel={formattedDateTime}
        navigateToOptions={onPressInput}
        iconName={iconName}
      />

      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          display={'default'}
          locale={lang}
          minimumDate={todayMemo}
          style={{ alignSelf: 'center' }}
          onChange={(_, date) => {
            date && onSelectedDateHandler(date);
            setShow(false);
          }}
        />
      )}
    </View>
  );
};
