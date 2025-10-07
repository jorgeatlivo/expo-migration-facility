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
  // const [isVisible, setVisibility] = useState(false);
  //
  // const showDatePicker = () => {
  //   setVisibility(true);
  // };
  //
  // const hideDatePicker = () => {
  //   setVisibility(false);
  // };
  //
  // const handleConfirm = (date: Date) => {
  //   hideDatePicker();
  //   props.onSelectedDateHandler(date);
  // };
  //
  // const dateFormat = props.mode === 'time' ? 'HH:mm' : 'DD MMM YYYY';
  // const formattedDateTime = moment(props.value).format(dateFormat);
  //
  // return (
  //   <>
  //     <DropDownInput
  //       placeholderAsLabel
  //       placeholder={props.placeholder}
  //       selectedLabel={formattedDateTime}
  //       navigateToOptions={showDatePicker}
  //       iconName={props.iconName}
  //     />
  //     <DateTimePickerModal
  //       isVisible={isVisible}
  //       date={props.value}
  //       mode={props.mode}
  //       is24Hour={true}
  //       onConfirm={handleConfirm}
  //       onCancel={hideDatePicker}
  //       minuteInterval={5}
  //       minimumDate={new Date()}
  //     />
  //   </>
  // );
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
