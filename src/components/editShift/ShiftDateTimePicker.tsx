import React, { useState} from 'react';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {Button, Platform, View} from 'react-native';
import i18n from '@/locale/i18n';


interface ShiftDateTimePickerProps {
  placeholder: string;
  onSelectedDateHandler: (date: Date) => void;
  value: Date;
  mode: 'date' | 'time';
  minimumDate?: Date;
  iconName?: string;
}

export const ShiftDateTimePicker = ({placeholder, onSelectedDateHandler, minimumDate, value, mode, iconName}: ShiftDateTimePickerProps) => {
  const [show, setShow] = useState(false);

  const onChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios'); // keep open on iOS
    if (selectedDate) {
      onSelectedDateHandler(selectedDate);
    }
  };

  return (
      <View style={{ alignSelf: 'center' }}>
        {Platform.OS === 'android' && (
            <Button title={value.toDateString()} onPress={() => setShow(true)} />
        )}

        {show && (
            <DateTimePicker
                value={value}
                mode={mode}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChange}
                minimumDate={minimumDate}
                locale={i18n.language}
                style={{ alignSelf: 'center' }}
                placeholderText={placeholder}
            />
        )}
      </View>
  );
};
