import { useMemo } from 'react';
import { View } from 'react-native';

import moment from 'moment';

import { DropDownInput } from '@/components/common/DropDownInput';
import { useDatePickerModal } from '@/components/modals/DatePickerModal';

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
  const { showModal } = useDatePickerModal('date-picker-modal');

  const todayMemo = useMemo(() => {
    return new Date();
  }, []);

  const onPressInput = () => {
    showModal({
      mode: mode,
      value: value,
      onSelectedTimeHandler: onSelectedDateHandler,
      minimumDate: todayMemo,
    });
  };

  const dateFormat = mode === 'time' ? 'HH:mm' : 'DD MMM YYYY';
  const formattedDateTime = moment(value).format(dateFormat);

  return (
    <View>
      {/*{Platform.OS === 'android' && (*/}
      {/*  <Button title={value.toDateString()} onPress={() => setShow(true)} />*/}
      {/*)}*/}
      <DropDownInput
        placeholderAsLabel
        placeholder={placeholder}
        selectedLabel={formattedDateTime}
        navigateToOptions={onPressInput}
        iconName={iconName}
      />
    </View>
  );
};
